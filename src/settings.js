define(function() {
    return codebox.settings.schema("editor",
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
                    "type": "integer",
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
                }
            }
        }
    );
    /*{
        "title": "Code Editor",
        "fields": {
            "printmargincolumn": {
                "label": "Print Margin Column",
                "type": "number",
                "min":  0,
                "max": 1000,
                "step": 1,
                "default": false
            },
            "wraplimitrange": {
                "label": "Wrap Limit Range",
                "type": "number",
                "min":  0,
                "max": 1000,
                "step": 1,
                "default": 80
            },
            "showinvisibles": {
                "label": "Show Invisibles",
                "type": "boolean",
                "default": false
            },
            "highlightactiveline": {
                "label": "Highlight Active Line",
                "type": "boolean",
                "default": false
            },
            "enablesoftwrap": {
                "label": "Enable Soft Wrap",
                "type": "boolean",
                "default": true
            },
            "enablesofttabs": {
                "label": "Use Soft Tabs",
                "type": "boolean",
                "default": true
            },
            "tabsize": {
                "label": "Tab Size",
                "type": "number",
                "min":  0,
                "max": 1000,
                "step": 1,
                "default": 4
            }
        }
}*/
});