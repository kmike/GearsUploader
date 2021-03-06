(function($){  //$-safe plugin

/*
    Class:        ProgressBar
    Author:       David Walsh
    Website:    http://davidwalsh.name
    Version:      3.0
    Date:         2/1/2009
    Updated:      17/10/2009 by Mikhail Korobov to make it $-safe
    Built For:  MooTools 1.2.3
*/

this.ProgressBar = new Class({

    //implements
    Implements: [Events, Options],

    //options
    options: {
        container: document.body,
        boxID:'progress-bar-box-id',
        percentageID:'progress-bar-percentage-id',
        displayID:'progress-bar-display-id',
        startPercentage: 0,
        displayText: false,
        speed:10,
        step:1,
        allowMore: false
    },

    //initialization
    initialize: function(options) {
        //set options
        this.setOptions(options);
        //quick container
        this.options.container = $(this.options.container);
        //create elements
        this.createElements();
    },

    //creates the box and percentage elements
    createElements: function() {
        var box = new Element('div', {
            id:this.options.boxID
        });
        var perc = new Element('div', {
            id:this.options.percentageID,
            'style':'width:0px;'
        });
        perc.inject(box);
        box.inject(this.options.container);
        if(this.options.displayText) {
            var text = new Element('div', {
                id:this.options.displayID
            });
            text.inject(this.options.container);
        }
        this.set(this.options.startPercentage);
    },

    //calculates width in pixels from percentage
    calculate: function(percentage) {
        return ($(this.options.boxID).getStyle('width').replace('px','') * (percentage / 100)).toInt();
    },

    //animates the change in percentage
    animate: function(go) {
        var run = false;
        var self = this;
        if(!self.options.allowMore && go > 100) {
            go = 100;
        }
        self.to = go.toInt();
        $(self.options.percentageID).set('morph', {
            duration: this.options.speed,
            link:'cancel',
            onComplete: function() {
                self.fireEvent('change',[self.to]);
                if(go >= 100)
                {
                    self.fireEvent('complete',[self.to]);
                }
            }
        }).morph({
            width:self.calculate(go)
        });
        if(self.options.displayText) {
            $(self.options.displayID).set('text', self.to + '%');
        }
    },

    //sets the percentage from its current state to desired percentage
    set: function(to) {
        this.animate(to);
    },

    //steps a pre-determined percentage
    step: function() {
        this.set(this.to + this.options.step);
    }

});

})(document.id); // end $-safe plugin
