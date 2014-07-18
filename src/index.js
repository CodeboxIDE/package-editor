define([
    "src/tab"
], function(Tab) {
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");

    var File = codebox.require("models/file");

    commands.register({
        id: "file.open",
        title: "Open File",
        palette: false,
        run: function(args) {
            if (!args.path) throw "Need 'path' to open a file";

            return File.get(args.path)
            .then(function(f) {
                codebox.tabs.add(Tab, {
                    model: f
                }, {
                    title: f.get("name")
                });
            });
        }
    });
});