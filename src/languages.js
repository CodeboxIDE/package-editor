define(function (_) {
    var _ = codebox.require("hr/utils");
    var aceModes = ace.require("ace/ext/modelist");

    var getByExtension = function(ext) {
        if (ext && ext[0] == '.') ext = ext.slice(1);

        return _.find(aceModes.modesByName, function(mode) {
            var exts = mode.extensions.split("|");
            return _.contains(exts, ext);
        });
    };

    var getByMode = function(name) {
        return _.find(aceModes.modesByName, function(mode) {
            return mode.name == name;
        });
    };

    var allModes = _.map(aceModes.modesByName, function(mode) {
        return {
            'name': mode.name,
            'caption': mode.caption
        };
    });

    return {
        all: allModes,
        getByExtension: getByExtension,
        getByMode: getByMode
    };
});