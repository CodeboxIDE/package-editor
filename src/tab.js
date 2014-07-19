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
            Tab.__super__.initialize.apply(this, arguments);

            // Create the ace editor
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

            // Allow commands shortcuts in the editor
            var $input = this.editor.textInput.getElement();
            var handleKeyEvent = function(e) {
                if (!e.altKey && !e.ctrlKey && !e.metaKey) return;
                keyboard.enableKeyEvent(e);
            };
            $input.addEventListener('keypress', handleKeyEvent, false);
            $input.addEventListener('keydown', handleKeyEvent, false);
            $input.addEventListener('keyup', handleKeyEvent, false);

            // Update editor layout
            this.listenTo(this.tab, "tab:layout", function() {
                this.editor.resize();
                this.editor.renderer.updateFull();
            });

            // Focus editor
            this.listenTo(this.tab, "tab:state", function(state) {
                if (state) this.focus();
            });

            // Clear editor when tab close
            this.listenTo(this.tab, "tab:close", function() {
                // Destroy the editor
                this.editor.destroy();

                // Destroy events and instance
                this.off();
                this.stopListening();
            });

            // File update
            this.listenTo(this.model, "change", this.updateFile);
            this.updateFile();

            // Read file
            this.read();
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

        // Update file
        updateFile: function() {
            this.editor.getSession().setMode("ace/mode/"+languages.getModeByExtension(this.model.getExtension()));
        },

        // Set editor content
        setContent: function(content) {
            return this.editor.setValue(content);
        },

        // Get editor content
        getContent: function(content) {
            return this.editor.getValue();
        },

        // Read the file
        read: function() {
            var that = this;

            return this.model.read()
            .then(function(content) {
                return that.setContent(content);
            });
        }
    });

    return Tab;
});