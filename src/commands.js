define(function(Tab) {
    var Q = codebox.require("hr/promise");
    var commands = codebox.require("core/commands");

    // Save the file
    commands.register({
        id: "editor.save",
        title: "File: Save",
        shortcuts: [
            "mod+s"
        ],
        context: ["editor"],
        run: function(args, editor) {
            return editor.write();
        }
    });
});