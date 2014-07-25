define([
    "ace",
    "src/tab",
    "src/settings",
    "src/commands",
    "less!src/stylesheets/main.less"
], function(ace, Tab, settings) {
    var Q = codebox.require("hr/promise");
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");
    var File = codebox.require("models/file");

    var aceconfig = ace.require("ace/config");
    aceconfig.set("basePath", "packages/editor/ace");

    var openFile = function(f) {
        if (f.isDirectory()) return Q.reject(new Error("Could not open a folder"));

        return codebox.tabs.add(Tab, {
            model: f
        }, {
            type: "editor",
            title: f.get("name"),
            uniqueId: "file://"+f.get("path")
        });
    };

    var openNewfile = function() {
        var f = File.buffer("untitled", "");
        openFile(f);
    };

    // Default tab is an empty buffer
    codebox.tabs.on("tabs:opennew", openNewfile);
    openNewfile();

    // Add command to open a file
    commands.register({
        id: "file.open",
        title: "File: Open",
        run: function(args) {
            return Q()
            .then(function() {
                if (args.file) return args.file;
                if (args.path) return File.get(args.path);

                return File.buffer("untitled", "");
            })
            .then(openFile);
        }
    });
});