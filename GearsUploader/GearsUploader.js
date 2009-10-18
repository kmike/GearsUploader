(function($){  //$-safe plugin

/**
 * GerasUploader and GearsSingleFileUploader classes.
 *
 * Classes for uploading files using Google's Gears plugin.
 *
 * They can display upload status, progress bar and emulate
 * classic html form uploads so server-side changes are not required.
 *
 * Depends on GearsMultipartForm.js (and optionally - on ProgressBar.js)
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 */

this.GearsUploader = new Class({

    Implements: [Options, Events],

    options :{
        progressBar: null,
        statusElement: null,
        statuses: {},
        verboseProcessing: true,
        queueProcessing: true,
        uploadHandler: 'upload-handler',
        selectHandler: 'select-handler',
        fileOpenOptions: {singleFile: false},
        url: '.',
        fileElementName: 'file',
        formElement: null,
        hideUploadHandler: true,

        onUploadUninitialized: $empty,
        onUploadOpen: $empty,
        onUploadSent: $empty,
        onUploadInteractive: $empty,
        onUploadComplete: $empty,

        onBeforeProcess: $empty,
        onAfterProcess: $empty,
        onBeforeUpload: $empty
    },

    initialize: function(options) {
        this.setOptions(options);
        this.files = [];
        this.alreadyUploaded = false;
        this.attachHandlers();
        this.setStatus('noFiles');
    },

    getFileElementName: function(index){
        return this.options.fileElementName+index;
    },

    getFormFiles: function(){
        var formFiles = {};
        for (var i=0; i< this.files.length; i++)
            formFiles[this.getFileElementName(i)] = this.files[i];
        return formFiles;
    },

    getExistingFormFields: function(){
        if (this.options.formElement == null)
            return {};

        var form = $(this.options.formElement);
        if (!form)
            return {};

        var fields = {};
        form.getElements('input, textarea').each(function(elem){
            if (elem.name && elem.value != '') {
                fields[elem.name] = elem.value;
            }
        });
        form.getElements('select').each(function(elem){
            var opts = [];
            $each(elem.options, function(opt){
                if (opt.selected)
                    opts.push(opt.value);
            });
            if (opts)
                fields[elem.name] = opts;
        });
        return fields;
    },

    getFormFields: function(){
        return this.getExistingFormFields();
    },

    handleFile: function(file){
        this.files.push(file);
    },

    handleFilesOpen : function(files){
        var self = this;
        self.fireEvent('beforeProcess');
        if (this.options.queueProcessing) {
            function doQueue(index){

                if (self.options.verboseProcessing)
                    self.setStatus('processing', ' (' + (index + 1) + '/' + files.length + ')');
                else
                    self.setStatus('processing');

                setTimeout(function(){
                    self.handleFile(files[index]);
                    if (index < files.length - 1)
                        doQueue(index + 1);
                    else {
                        self.setStatus('selected');
                        $(self.options.uploadHandler).show();
                    }
                }, 0);
            }
            doQueue(0);
        }
        else{
            self.setStatus('processing'); // this won't show up in most browsers!
            files.each(function(file, index){
                self.handleFile(file);
            });
            self.setStatus('selected');
            $(self.options.uploadHandler).show();
            self.fireEvent('afterProcess');
        }
    },

    attachHandlers: function(){
        var self = this;
        $(self.options.selectHandler).addEvent('click', function(ev){
            ev.stop();
            var desktop = google.gears.factory.create('beta.desktop');

            desktop.openFiles(function(files){
                if (!files.length)
                    return;
                self.alreadyUploaded = false;
                self.hideProgressBar();
                self.handleFilesOpen(files);

            }, self.options.fileOpenOptions);
        });

        var uploadHandler = $(self.options.uploadHandler);
        uploadHandler.store('originalDisplay', uploadHandler.getStyle('display'));

        uploadHandler.addEvent('click', function(ev){
            ev.stop();
            if (self.alreadyUpladed)
            {
                self.setStatus('alreadyUploaded');
                return;
            }

            if (!self.files.length)
                return;

            self.showProgressBar();
            self.setProgressNow(0);

            var form = new GearsMultipartForm({
                files: self.getFormFiles(),
                fields: self.getFormFields(),
                onprogress: function(e){
                    if (e.lengthComputable)
                        self.setProgress(e.loaded / e.total * 85);
                },
                onreadystatechange: function()
                {
                    switch (form.request.readyState){
                        case 0: // Uninitialized
                            self.setStatus('stateUninitialized');
                            self.fireEvent('uploadUninitialized');
                            break;
                        case 1: // Open
                            self.setStatus('stateOpen');
                            self.fireEvent('uploadOpen');
                            break;
                        case 2: // Sent
                            self.setStatus('stateSent');
                            self.setProgress(90);
                            self.fireEvent('uploadSent');
                            break;
                        case 3: // Interactive
                            self.setStatus('stateInteractive');
                            self.setProgress(95);
                            self.fireEvent('uploadInteractive');
                            break;
                        case 4: // Complete
                            self.setStatus('stateComplete');
                            self.alreadyUploaded = true;
                            self.setProgress(100);
                            self.fireEvent('uploadComplete');
                            break;
                    }
                }
            });
            self.fireEvent('beforeUpload');
            form.post(self.options.url);
        });
        if (self.options.hideUploadHandler)
            uploadHandler.hide();
    },


/* methods for dealing with progress bar and status */

    setRawStatus: function(html){
        if (this.options.statusElement) {
            $(this.options.statusElement).set('html', html);
        }
    },

    setStatus: function(msgId, extra){
        if (!extra)
            extra='';
        if (msgId in this.options.statuses)
            this.setRawStatus(this.options.statuses[msgId] + extra);
        else
            this.setRawStatus(msgId + extra);
    },

    showProgressBar: function(){
        if (this.options.progressBar)
            $(this.options.progressBar.options.container).show();
    },

    hideProgressBar: function(){
        if (this.options.progressBar)
            $(this.options.progressBar.options.container).hide();
    },

    setProgress: function(to){
        if (this.options.progressBar)
            this.options.progressBar.set(to);
    },

    setProgressNow: function(to){
        if (this.options.progressBar) {
            var pb = this.options.progressBar;
            pb.to = to.toInt();
            $(pb.options.percentageID).setStyle('width', pb.calculate(pb.to));
            if (pb.options.displayText) {
                $(pb.options.displayID).set('text', pb.to + '%');
            }
        }
    }

});


this.GearsSingleFileUploader = new Class({
    Extends: GearsUploader,

    options: {
        verboseProcessing: false,
        fileOpenOptions: {
            singleFile: true
        },
        statuses: {}
    },

    getFileElementName: function(index){
        return this.options.fileElementName;
    }
});

})(document.id); // end $-safe plugin
