define([
    "ace"
], function(ace) {
    var hr = codebox.require("hr/hr");

    var Tab = hr.View.extend({
        className: "component-editor",

        initialize: function() {
            Tab.__super__.initialize.apply(this, arguments);

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
        },

        render: function() {
            this.editor.resize();
            this.editor.renderer.updateFull();

            return this.ready();
        },
    });

    return Tab;
});