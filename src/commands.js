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
            return editor.save();
        }
    });

    // Save all files
    commands.register({
        id: "editor.save.all",
        title: "File: Save All",
        shortcuts: [
            "mod+alt+s"
        ],
        run: function(args, editor) {
            return codebox.tabs.tabs.reduce(function(prev, tab) {
                if (tab.get("type") != "editor") return prev;

                return prev.then(function() {
                    return tab.view.save();
                })
            }, Q());
        }
    });
});