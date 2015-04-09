var ace = require("./ace");
var aceModes = ace.require("ace/ext/modelist");
var aceLangs = ace.require("ace/ext/language_tools");
var aceWhitespace = ace.require("ace/ext/whitespace");
var aceRange = ace.require("ace/range");

var settings = require("./settings");
var languages = require("./languages");

var $ = codebox.require("jquery");
var keyboard = codebox.require("utils/keyboard");
var dialogs = codebox.require("utils/dialogs");

var Tab = codebox.tabs.Panel.extend({
    className: "component-editor",

    initialize: function() {
        var that = this;
        Tab.__super__.initialize.apply(this, arguments);

        // Status bar messages
        this.msgPosition = this.statusbar.add({});
        this.listenTo(this, "cursor:change", this.onCursorChange);

        this.msgMode = this.statusbar.add({
            position: "right",
            click: this.onSelectMode.bind(this)
        });
        this.listenTo(this, "mode:change", this.onModeChange);

        // Init the ace editor
        this.initEditor();

        // Init the tab
        this.initTab();

        // Init the file
        this.initFile();

        // Settings
        this.listenTo(settings.data, "set", this.onSettingsChange);

        this.onSettingsChange();
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

        // Map of current cursors
        this.markersC = {};
        this.markersS = {};

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

        this.editor.session.setUseWorker(true);
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true
        });
        this.editor.session.doc.setNewLineMode("unix");

        this.editor.session.on('change', function(e) {
            that.setTabState("modified", true);
            that.trigger("content:change");
        });

        this.editor.session.selection.on('changeCursor', function() {
            that.trigger("cursor:change", that.getCursor());
        });

        this.editor.session.selection.on('changeSelection', function(){
            var selection = that.editor.getSelectionRange();
            that.trigger("selection:change", that.getSelection());
        });

        this.editor.session.on('changeMode', function() {
            that.trigger("mode:change", that.getMode());
        });

        // Clear command on Windows/ChromeOS Ctrl-Shift-P
        this.editor.commands.addCommands([{
            name: "commandpalette",
            bindKey: {
                win: "Ctrl-Shift-P",
                mac: "Command-Shift-P"
            },
            exec: function(editor, line) {
                return false;
            },
            readOnly: true
        }]);
        this.editor.commands.addCommands([{
            name: "showSettingsMenu",
            bindKey: {
                win: "Ctrl-,",
                mac: "Command-,"
            },
            exec: function(editor, line) {
                return false;
            },
            readOnly: true
        }]);

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
        this.listenTo(this, "tab:layout", function() {
            this.editor.resize();
            this.editor.renderer.updateFull();
        });

        this.listenTo(this, "tab:state", function(state) {
            if (state) this.focus();
        });

        this.listenTo(this, "tab:close", function() {
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

    // Toggle readonly
    setReadOnly: function(b) {
        this.editor.setReadOnly(b);
    },

    // Set editor content
    setContent: function(content) {
        return this.editor.setValue(content);
    },

    // Get editor content
    getContent: function(content) {
        return this.editor.getValue();
    },

    // Apply delta changement
    applyDocDeltas: function(deltas) {
        return this.editor.session.doc.applyDeltas(deltas);
    },

    // Return doc content
    getDocContent: function() {
        return this.editor.session.doc.getValue();
    },

    // Set doc content
    setDocContent: function(c) {
        this.editor.session.doc.setValue(c);
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
    save: function() {
        var that = this;

        return this.model.save(this.getContent())
        .then(function() {
            that.setTabState("modified", false);
        });
    },

    ///// Cursor/Selection/Position management

    // Get position (row, column) from index in file
    posFromIndex: function(index) {
        var row, lines;
        lines = this.editor.session.doc.getAllLines();
        for (row = 0; row < lines.length; row++) {
            var line = lines[row];
            if (index <= (line.length)) break;
            index = index - (line.length + 1);
        }

        return {
            'row': row,
            'column': index
        };
    },

    // Return scrolling position
    getScrollTop: function() {
        return this.editor.session.getScrollTop();
    },

    // Set scrolling position
    setScrollTop: function(y) {
        this.editor.session.setScrollTop(y);
    },

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

    // Get selection
    getSelection: function() {
        var selection = this.editor.getSelectionRange();
        return {
            start: {
                row: selection.start.row,
                column: selection.start.column
            },
            end: {
                row: selection.end.row,
                column: selection.end.column
            }
        };
    },

    // Get selection
    setSelection: function(anchor, lead) {
        if (anchor) this.editor.getSession().getSelection().setSelectionAnchor(anchor.row, anchor.column);
        if (lead) this.editor.getSession().getSelection().selectTo(lead.row, lead.column);
    },

    // Move other cursor
    moveCursorExt: function(cId, c) {
        var name, range = new aceRange.Range(c.y, c.x, c.y, c.x+1);

        // Remove old cursor
        if (this.markersC[cId]) this.editor.getSession().removeMarker(this.markersC[cId]);

        // Calcul name
        name = c.title || cId;

        // Add new cursor
        this.markersC[cId] = this.editor.getSession().addMarker(range, "marker-cursor marker-"+c.color.replace("#", ""), function(html, range, left, top, config){
            html.push("<div class='marker-cursor' style='top: "+top+"px; left: "+left+"px; border-left-color: "+c.color+"; border-bottom-color: "+c.color+";'>"
            + "<div class='marker-cursor-nametag' style='background: "+c.color+";'>&nbsp;"+name+"&nbsp;<div class='marker-cursor-nametag-flag' style='border-right-color: "+c.color+"; border-bottom-color: "+c.color+";'></div>"
            + "</div>&nbsp;</div>");
        }, true);
    },

    // Remove an other cursor
    removeCursorExt: function(cId) {
        if (this.markersC[cId]) this.editor.getSession().removeMarker(this.markersC[cId]);
        delete this.markersC[cId];
    },

    // Move an other selection
    moveSelectionExt: function(cId, c) {
        var range = new aceRange.Range(c.start.y, c.start.x, c.end.y, c.end.x);
        if (this.markersS[cId]) this.editor.getSession().removeMarker(this.markersS[cId]);
        this.markersS[cId] = this.editor.getSession().addMarker(range, "marker-selection marker-"+c.color.replace("#", ""), "line", false);
    },

    // Remove another selection
    removeSelectionExt: function(cId) {
        if (this.markersS[cId]) this.editor.getSession().removeMarker(this.markersS[cId]);
        delete this.markersS[cId];
    },

    // Remove all another cursors/selections
    removeAllExt: function() {
        _.each(
            [].concat(
                _.keys(this.markersS),
                _.keys(this.markersC)
            ),
            function(cId) {
                this.removeSelectionExt(cId);
                this.removeCursorExt(cId);
            },
            this
        );
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

    // Settings changed
    onSettingsChange: function() {
        var that = this;

        ace.config.loadModule(["keybinding", "ace/keyboard/"+settings.data.get("keyboard")], function(binding) {
            if (binding && binding.handler) that.editor.setKeyboardHandler(binding.handler);
        });

        this.$editor.css("fontSize", settings.data.get("fontsize"));
        this.editor.setShowPrintMargin(settings.data.get("showprintmargin"));
        this.editor.setShowInvisibles(settings.data.get("showinvisibles"));
        this.editor.setHighlightActiveLine(settings.data.get("highlightactiveline"));
        this.editor.getSession().setUseWrapMode(settings.data.get("enablesoftwrap"));
        this.editor.getSession().setWrapLimitRange(settings.data.get("wraplimitrange"), settings.data.get("wraplimitrange"));
        this.editor.getSession().setUseSoftTabs(settings.data.get("enablesofttabs"));
        this.editor.getSession().setTabSize(settings.data.get("tabsize"));
    },

    // Update file
    onFileChange: function() {
        var mode = languages.getByExtension(this.model.getExtension());
        this.setMode(mode? mode.name : "text");
        this.setTabTitle(this.model.get("name", "loading..."));
        this.setTabId("file://"+this.model.get("path"));
    },

    // Cursor move
    onCursorChange: function() {
        var cursor = this.getCursor();
        this.msgPosition.set("content", "Line "+(cursor.row+1)+", Column "+(cursor.column+1));
    },

    // Mode change
    onModeChange: function() {
        var mode = this.getMode();
        var lang = languages.getByMode(mode)
        mode =  lang? lang.caption : mode;
        this.msgMode.set("content", mode);
    },

    // Click to select mode
    onSelectMode: function(e) {
        var that = this;
        dialogs.list(languages.all, {
            template: "<div class='item-text'><%- item.get('caption') %></div>"
        })
        .then(function(mode) {
            return that.setMode(mode.get("name"));
        })
    }
});

module.exports = Tab;
