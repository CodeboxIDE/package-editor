var ace = require("./ace");
var aceCommands = ace.require("ace/commands/default_commands");

var Q = codebox.require("q");
var _ = codebox.require("hr.utils");
var commands = codebox.require("core/commands");

module.exports = _.map([
    {
        id: "find",
        title: "Find"
    },
    {
        id: "replace",
        title: "Replace"
    }
], function(command) {
    var shortcuts = [];
    var cmd = _.find(aceCommands.commands, { name: command.id });

    return {
        title: "Editor: "+command.title,
        id: "editor."+command.id,
        shortcuts: cmd.bindKey.mac? [
            cmd.bindKey.mac.replace("Command", "mod")
        ] : [],
        context: ["editor"],
        run: function(args, ctx) {
            ctx.editor.execCommand(command.id);
        }
    };
});

