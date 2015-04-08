require("../ace/ace");

require("../ace/ext-modelist");
require("../ace/ext-language_tools");
require("../ace/ext-whitespace");

var aceconfig = ace.require("ace/config");
aceconfig.set("basePath", "packages/editor/ace");

module.exports = window.ace;