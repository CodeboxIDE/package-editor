define([

], function() {
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");

    commands.register({
        id: "file.open",
        title: "Open File",
        palette: false,
        run: function(args) {
            if (!args.path) throw "Need 'path' to open a file";
        }
    });
});