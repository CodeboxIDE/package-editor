define(function(Tab) {
    var Q = codebox.require("hr/promise");
    var commands = codebox.require("core/commands");

    // Add command to open a file
    commands.register({
        id: "editor.save",
        title: "File: Save",
        shortcuts: [
            "mod+s"
        ],
        context: ["editor"],
        run: function(args, context) {

        }
    });
});