var Tab = require("./tab");

var ace = require("./ace");
var aceModes = ace.require("ace/ext/modelist");

var Q = codebox.require("q");
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
    run: function(args) {
        return codebox.tabs.tabs.reduce(function(prev, tab) {
            if (tab.get("type") != "editor") return prev;

            return prev.then(function() {
                return tab.view.save();
            })
        }, Q());
    }
});

// Set syntax
commands.register(_.map(aceModes.modesByName, function(mode) {
    return {
        id: "editor.syntax."+mode.name,
        title: "Set Syntax: "+mode.caption,
        context: ["editor"],
        run: function(args, editor) {
            editor.setMode(mode.name);
        }
    }
}));
