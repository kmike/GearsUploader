/*
Script: Element.Shortcuts.js
    Extends the Element native object to include some shortcut methods.

    License:
        MIT-style license.

    Authors:
        Aaron Newton

*/

Element.implement({
    hide: function(){
        var d;
        try {
            // IE fails here if the element is not in the dom
            if ((d = this.getStyle('display')) == 'none') d = null;
        } catch(e){}

        return this.store('originalDisplay', d || 'block').setStyle('display', 'none');
    },

    show: function(display){
        return this.setStyle('display', display || this.retrieve('originalDisplay') || 'block');
    }
});
