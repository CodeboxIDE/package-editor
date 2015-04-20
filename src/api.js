var ace = require("./ace");
var Q = codebox.require("q");
var _ = codebox.require("hr.utils");

var logger = codebox.require("hr.logger")("autocomplete");

var langTools = ace.require("ace/ext/language_tools");

var addCompleter = function(fn) {
    langTools.addCompleter({
        getCompletions: function(editor, session, pos, prefix, callback) {
            Q()
            .then(function() {
                return fn(editor.__tabEditor, pos, prefix);
            }).then(function(data) {
                callback(null, data);
            }, function(err) {
                logger.exception("Autocompletion", err);
                callback(err);
            });
        }
    });
};



module.exports = {
    ace: ace,
    autocomplete: {
        add: addCompleter
    }
};
