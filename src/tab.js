define([
    "ace",
    "src/languages"
], function(ace, languages) {
    var hr = codebox.require("hr/hr");
    var keyboard = codebox.require("utils/keyboard");

    // Import ace
    var aceRange =  ace.require("ace/range");
    var aceModes = ace.require("ace/ext/modelist");
    var aceLangs = ace.require("ace/ext/language_tools");
    var aceWhitespace = ace.require("ace/ext/whitespace");

    var Tab = codebox.tabs.Panel.extend({
        className: "component-editor",

        initialize: function() {
            var that = this;
            Tab.__super__.initialize.apply(this, arguments);

            // Status bar messages
            this.msgPosition = this.statusbar.add({});
            this.listenTo(this, "cursor:change", this.onCursorChange);

            this.msgMode = this.statusbar.add({ position: "right" });
            this.listenTo(this, "mode:change", this.onModeChange);

            // Init the ace editor
            this.initEditor();

            // Init the tab
            this.initTab();

            // Init the file
            this.initFile();

            this.onCursorChange();
            this.onModeChange();
        },

        render: function() {
            this.editor.resize();
            this.editor.renderer.updateFull();

            return this.ready();
        },

        // Focus the editor
        focus: function() {
            this.editor.resize();
            this.editor.renderer.updateFull();
            this.editor.focus();
        },

        // Init editor
        initEditor: function() {
            var that = this;

            this.$editor = $("<div>", {
                'class': "editor-content"
            });
            this.$editor.appendTo(this.$el);
            this.editor = ace.edit(this.$editor.get(0));

            this.editor.setTheme({
                'isDark': true,
                'cssClass': "ace-codebox",
                'cssText': ""
            });

            this.editor.session.on('change', function(e) {
                that.setTabState("modified", true);
                that.trigger("content:change");
            });

            this.editor.session.selection.on('changeCursor', function() {
                that.trigger("cursor:change", that.getCursor());
            });

            this.editor.session.on('modeCursor', function() {
                that.trigger("mode:change", that.getMode());
            });

            // Allow commands shortcuts in the editor
            var $input = this.editor.textInput.getElement();
            var handleKeyEvent = function(e) {
                if (!e.altKey && !e.ctrlKey && !e.metaKey) return;
                keyboard.enableKeyEvent(e);
            };
            $input.addEventListener('keypress', handleKeyEvent, false);
            $input.addEventListener('keydown', handleKeyEvent, false);
            $input.addEventListener('keyup', handleKeyEvent, false);
        },

        // Init the tab
        initTab: function() {
            this.listenTo(this.tab, "tab:layout", function() {
                this.editor.resize();
                this.editor.renderer.updateFull();
            });

            this.listenTo(this.tab, "tab:state", function(state) {
                if (state) this.focus();
            });

            this.listenTo(this.tab, "tab:close", function() {
                // Destroy the editor
                this.editor.destroy();

                // Destroy events and instance
                this.off();
                this.stopListening();
            });
        },

        // Init the file
        initFile: function() {
            this.listenTo(this.model, "change", this.onFileChange);
            this.onFileChange();

            // Read file
            this.read();
        },

        ///// Content management

        // Set editor content
        setContent: function(content) {
            return this.editor.setValue(content);
        },

        // Get editor content
        getContent: function(content) {
            return this.editor.getValue();
        },

        ///// File management

        // Read the file
        read: function() {
            var that = this;

            return this.model.read()
            .then(function(content) {
                that.setContent(content);
                that.moveCursor(0, 0);
                that.setTabState("modified", false);
                that.focus();
            });
        },

        // Write the file
        write: function() {
            var that = this;

            return this.model.write(this.getContent())
            .then(function() {
                that.setTabState("modified", false);
            });
        },

        ///// Cursor management

        // Move cursor
        moveCursor: function(x, y) {
            this.editor.gotoLine(x, y);
        },

        // Return cursor position
        getCursor: function() {
            var cursor = this.editor.getSession().getSelection().getCursor();
            return {
                row: cursor.row,
                column: cursor.column
            };
        },

        ///// Settings management

        // Define the mode
        setMode: function(mode) {
            this.editor.session.setMode("ace/mode/"+mode);
        },

        // Return the mode
        getMode: function() {
            return this.editor.session.getMode().$id.replace("ace/mode/", "");
        },

        ///// Events

        // Update file
        onFileChange: function() {
            this.setMode(languages.getModeByExtension(this.model.getExtension()));
        },

        // Cursor move
        onCursorChange: function() {
            var cursor = this.getCursor();
            this.msgPosition.set("content", "Line "+(cursor.row+1)+", Column "+(cursor.column+1));
        },

        // Mode change
        onModeChange: function() {
            var mode = this.getMode();
            this.msgMode.set("content", mode);
        }
    });

    return Tab;
});