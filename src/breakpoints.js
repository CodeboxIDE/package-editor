var _ = codebox.require("hr.utils");
var Model = codebox.require("hr.model");
var Collection = codebox.require("hr.collection");

var Breakpoint = Model.extend({
    defaults: {
        file: "",
        line: 0
    }
});


var Breakpoints = Collection.extend({
    model: Breakpoint,

    // Return list of active breakpoints in an editor
    getEditorBreakpoints: function(editor) {
        return _.chain(editor.editor.session.getBreakpoints() || {})
        .map(function(value, key) {
            if (!value) return null;
            return {
                file: editor.model.get('path'),
                line: parseInt(key)
            };
        })
        .compact()
        .value();
    },

    // Bind an editor to breakpoints
    bindEditor: function(editor) {
        var that = this;
        var $editor = editor.editor;

        $editor.session.on("changeBreakpoint", function() {
            that.updateEditorBreakpoints(editor);
        });

        // Add remove breakpoints by clicking the gutter
        $editor.on("guttermousedown", function(e) {
            var target = e.domEvent.target;
            if (target.className.indexOf("ace_gutter-cell") == -1)
                return;
            if (!e.editor.isFocused())
                return;
            if (e.clientX > 25 + target.getBoundingClientRect().left)
                return;

            var row = e.getDocumentPosition().row;

            if (that.hasBreakpoint(editor.model.get('path'), row)) {
                e.editor.session.clearBreakpoint(row)
            } else {
                e.editor.session.setBreakpoint(row);
            }
            e.stop();
        });

        // Update breakpoints for change
        $editor.session.doc.on("change", function(e) {
            var delta = e.data;
            var range = delta.range;
            var changed = false;

            if (range.end.row == range.start.row)
                return;

            var len, firstRow;
            len = range.end.row - range.start.row;
            if (delta.action == "insertText") {
                firstRow = range.start.column ? range.start.row + 1 : range.start.row;
            }
            else {
                firstRow = range.start.row;
            }

            if (delta.action[0] == "i") {
                var args = Array(len);
                args.unshift(firstRow, 0);
                changed = true;
                $editor.session.$breakpoints.splice.apply($editor.session.$breakpoints, args);
            }
            else {
                var rem = $editor.session.$breakpoints.splice(firstRow + 1, len);

                if (!$editor.session.$breakpoints[firstRow]) {
                    for (var i = rem.length; i--; ) {
                        if (rem[i]) {
                            changed = true;
                            $editor.session.$breakpoints[firstRow] = rem[i];
                            break;
                        }
                    }
                }
            }

            if (changed) that.updateEditorBreakpoints(editor);
        });

        // Remov breakpoints on close
        this.listenTo(editor, "tab:close", function() {
            that.clearBreakpoints(editor);
        });

        that.updateEditorBreakpoints(editor);
    },

    // Updte editor breakpoint
    updateEditorBreakpoints: function(editor) {
        var that = this;
        var filename = editor.model.get('path');
        var breakpoints = this.getEditorBreakpoints(editor);
        var toRemove = [];

        this.each(function(b) {
            if (b.get("file") != filename) return;

            var exists = _.has(breakpoints, { line: b.get("line") });
            if (!exists) {
                toRemove.push(b);
            } else {
                _.remove(breakpoints, { line: b.get("line") });
            }
        });

        // Remove old breakpoints
        this.remove(toRemove);

        // Add new
        this.add(breakpoints);
    },

    // Clear breakpoints for a file
    clearBreakpoints: function(editor) {
        var filename = editor.model.get('path');
        var toRemove = this.filter(function(b) {
            return b.get("file") == filename;
        });
        this.remove(toRemove);
    },

    // Check if has breakpoint at a line
    hasBreakpoint: function(file, row) {
        return this.find(function(b) {
            return b.get('file') == file && b.get('line') == row;
        }) != null;
    },
});

module.exports = new Breakpoints();
