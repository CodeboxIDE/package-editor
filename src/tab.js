define(function() {
    var hr = codebox.require("hr/hr");

    var Tab = hr.View.extend({


        render: function() {
            this.$el.html(this.model.get("path"));
            return this.ready();
        }
    });

    return Tab;
});