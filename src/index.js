define([
    "src/tab"
], function(Tab) {
    var Q = codebox.require("hr/promise");
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");

    var File = codebox.require("models/file");

    var openFile = function(f) {
        if (f.isDirectory()) return Q.reject(new Error("Could not open a folder"));

        return codebox.tabs.add(Tab, {
            model: f
        }, {
            title: f.get("name"),
            uniqueId: "file://"+f.get("path")
        });
    };

    commands.register({
        id: "file.open",
        title: "Open File",
        palette: false,
        run: function(args) {
            if (!args.path) throw "Need 'path' to open a file";

            return File.get(args.path)
            .then(openFile);
        }
    });
});