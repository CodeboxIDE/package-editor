define(function() {
    return codebox.settings.model("editor", {
        'title': "Code Editor",
        'fields': {
            'keyboard': {
                'label': "Keyboard mode",
                'type': "select",
                'options': {
                    "vim": "Vim",
                    "emacs": "Emacs",
                    "textinput": "Default"
                },
                'default': "textinput"
            },
            'fontsize': {
                'label': "Font Size",
                'type': "number",
                'min':  10,
                'max': 30,
                'step': 1,
                'default': 12
            },
            'printmargincolumn': {
                'label': "Print Margin Column",
                'type': "number",
                'min':  0,
                'max': 1000,
                'step': 1,
                'default': false
            },
            'wraplimitrange': {
                'label': "Wrap Limit Range",
                'type': "number",
                'min':  0,
                'max': 1000,
                'step': 1,
                'default': 80
            },
            'showprintmargin': {
                'label': "Show Print Margin",
                'type': "boolean",
                'default': false
            },
            'showinvisibles': {
                'label': "Show Invisibles",
                'type': "boolean",
                'default': false
            },
            'highlightactiveline': {
                'label': "Highlight Active Line",
                'type': "boolean",
                'default': false
            },
            'enablesoftwrap': {
                'label': "Enable Soft Wrap",
                'type': "boolean",
                'default': true
            },
            'enablesofttabs': {
                'label': "Use Soft Tabs",
                'type': "boolean",
                'default': true
            },
            'tabsize': {
                'label': "Tab Size",
                'type': "number",
                'min':  0,
                'max': 1000,
                'step': 1,
                'default': 4
            }
        }
    });
});