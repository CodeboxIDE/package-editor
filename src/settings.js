module.exports = codebox.settings.schema("editor",
    {
        "title": "Code Editor",
        "type": "object",
        "properties": {
            "keyboard": {
                "description": "Keyboard",
                "type": "string",
                "enum": [
                    "vim", "emacs", "textinput"
                ],
                "default": "textinput"
            },
            "fontsize": {
                "description": "Font Size",
                "type": "number",
                "default": 13
            },
            "showprintmargin": {
                "description": "Show Print Margin",
                "type": "boolean",
                "default": false
            },
            "showinvisibles": {
                "description": "Show Invisibles",
                "type": "boolean",
                "default": false
            },
            "highlightactiveline": {
                "description": "Highlight Active Line",
                "type": "boolean",
                "default": false
            },
            "enablesoftwrap": {
                "description": "Enable Soft Wrap",
                "type": "boolean",
                "default": true
            },
            "enablesofttabs": {
                "description": "Use Soft Tabs",
                "type": "boolean",
                "default": true
            },
            "printmargincolumn": {
                "description": "Print Margin Column",
                "type": "number",
                "minimum":  0,
                "maximum": 1000,
                "multipleOf": 1,
                "default": 60
            },
            "wraplimitrange": {
                "description": "Wrap Limit Range",
                "type": "number",
                "minimum":  0,
                "maximum": 1000,
                "multipleOf": 1,
                "default": 80
            },
            "tabsize": {
                "description": "Tab Size",
                "type": "number",
                "minimum":  0,
                "maximum": 1000,
                "multipleOf": 1,
                "default": 4
            },
            "autocompletion": {
                "title": "Live Autocompletion",
                "type": "boolean",
                "default": true
            }
        }
    }
);
