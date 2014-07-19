define([
    "ace"
], function(ace) {
    var hr = codebox.require("hr/hr");
    var keyboard = codebox.require("utils/keyboard");

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
            return this;
        },
    });

    return Tab;
});