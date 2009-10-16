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
/*
    Class:        ProgressBar
    Author:       David Walsh
    Website:    http://davidwalsh.name
    Version:      3.0
    Date:         2/1/2009
    Built For:  MooTools 1.2
*/


var ProgressBar = new Class({

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
// Copyright 2007, Google Inc.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//  3. Neither the name of Google Inc. nor the names of its contributors may be
//     used to endorse or promote products derived from this software without
//     specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Sets up google.gears.*, which is *the only* supported way to access Gears.
//
// Circumvent this file at your own risk!
//
// In the future, Gears may automatically define google.gears.* without this
// file. Gears may use these objects to transparently fix bugs and compatibility
// issues. Applications that use the code below will continue to work seamlessly
// when that happens.

(function() {
  // We are already defined. Hooray!
  if (window.google && google.gears) {
    return;
  }

  var factory = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
    factory = new GearsFactory();
  } else {
    // IE
    try {
      factory = new ActiveXObject('Gears.Factory');
      // privateSetGlobalObject is only required and supported on IE Mobile on
      // WinCE.
      if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
        factory.privateSetGlobalObject(this);
      }
    } catch (e) {
      // Safari
      if ((typeof navigator.mimeTypes != 'undefined')
           && navigator.mimeTypes["application/x-googlegears"]) {
        factory = document.createElement("object");
        factory.style.display = "none";
        factory.width = 0;
        factory.height = 0;
        factory.type = "application/x-googlegears";
        document.documentElement.appendChild(factory);
      }
    }
  }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!factory) {
    return;
  }

  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!window.google) {
    google = {};
  }

  if (!google.gears) {
    google.gears = {factory: factory};
  }
})();
/*
 * GearsMultipartForm
 *
 * Javascript multipart form class.
 * Can be used for emulating classic html form
 * submissions (with text fields and file fields)
 * according to rfc2388.
 *
 * Limitation: `multipart/mixed` part or rfc2388 is
 * not implemented (several files as one form entry).
 * Don't know if it is used anywhere.
 *
 * Built for Google Gears >= 0.5.21, does not require any js library.
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 * Example:

 var desktop = google.gears.factory.create('beta.desktop');
 desktop.openFiles(function(files){
    var form = new GearsMultipartForm({
        files: {'myFile1': files[0]},
        fields: {'myInput': 'value', 'mySelect': ['value1', 'value2']}
    });
    form.post('my_url');
 });

 *
 */

var GearsMultipartForm = function(options){
    this.options = {

        // progress callback, see Gears docs for more info
        onprogress: function(){},

        // readystatechange callback, see Gears docs for more info
        onreadystatechange: function(){},

        // dictionary with Gears files to be submitted
        // {'file field name': File}
        files: {},

        // text form fields
        // {'field name': 'text content'}
        // {'field name': ['value1', 'value2']}
        fields: {}
    };

    var self=this;
    var initialize = function(){
        for (opt in options)
            self.options[opt] = options[opt];
    }
    initialize();

    this.buildData = function(boundary)
    {
        var crlf = '\r\n';
        var builder = google.gears.factory.create('beta.blobbuilder');
        var self=this;

        function addTextField(name, text)
        {
            builder.append('--'+boundary+crlf);
            builder.append(self.getContentDispositionHeader(name)+crlf);
            builder.append(crlf);
            builder.append(text);
            builder.append(crlf);
        }

        function addFileField(name, file)
        {
            builder.append('--'+boundary+crlf);
            builder.append(self.getContentDispositionHeader(name, file.name)+crlf);
            var mime = 'application/octet-stream';
            if ('mime' in file)
                mime = file.mime;
            builder.append('Content-Type: '+mime+crlf+crlf);
            builder.append(file.blob);
            builder.append(crlf);
        }

        for (name in this.options.fields){
            var value = this.options.fields[name];
            if (value.constructor != Array) // single value
                value = [value];
            for (var i=0; i<value.length; i++)
                addTextField(name, value[i]);
        }

        for (name in this.options.files){
            var file = this.options.files[name];
            addFileField(name, file);
        }

        builder.append('--'+boundary+'--'+crlf);
        return builder.getAsBlob();
    }

    this.getContentDispositionHeader = function(name, filename)
    {
        /*
         in rfc 2388 (paragraph 5.4) it is stated that filename should be
         rfc2047-encoded, but it seems that current browsers do not encode
         them and thus encoding confuse existing server scripts, so pass
         filename as-is.
        */
        var res = 'Content-Disposition: form-data; name="'+name+'"';
        if (filename)
            res = res + '; filename="' + filename + '"';
        return res;
    }

    this.getContentTypeHeader = function(type)
    {
        // default content-type is text.plain
        if (type == null)
            type = 'text/plain';
        return 'Content-Type:'+type+ this.crlf;
    }

    this.generateBoundary = function()
    {
        // smth. like firefox behaviour for constructing boundary string
        function randomString(len) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var randomstring = '';
            for (var i=0; i<len; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            return randomstring;
        }
        return '-------------------------'+randomString(24);
    }

    this.post = function(url){

        var boundary = this.generateBoundary();

        this.request = google.gears.factory.create('beta.httprequest');
        this.request.upload.onprogress = this.options.onprogress;
        this.request.onreadystatechange = this.options.onreadystatechange;

        this.request.open('POST', url);
        this.request.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);

        // Add ajax header so requests can be distinguished on server side.
        // For Django it is as simple as `if request.ajax():`
        this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        // Send data
        this.request.send(this.buildData(boundary));
    }

};
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

var GearsUploader = new Class({

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

        onUploadUninitialized: function(){
            this.setStatus('stateUninitialized');
        },

        onUploadOpen: function(){
            this.setStatus('stateOpen');
        },

        onUploadSent: function(){
            this.setStatus('stateSent');
        },

        onUploadInteractive: function(){
            this.setStatus('stateInteractive');
        },

        onUploadComplete: function(){
            this.setStatus('stateComplete');
        }

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

    getFormFields: function(){
        return {};
    },

    handleFile: function(file){
        this.files.push(file);
    },

    handleFilesOpen : function(files){
        var self = this;
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

        $(self.options.uploadHandler).addEvent('click', function(ev){
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
                        self.setProgress(e.loaded / e.total * 100);
                },
                onreadystatechange: function()
                {
                    switch (form.request.readyState){
                        case 0: // Uninitialized
                            self.fireEvent('uploadUninitialized');
                            break;
                        case 1: // Open
                            self.fireEvent('uploadOpen');
                            break;
                        case 2: // Sent
                            self.fireEvent('uploadSent');
                            break;
                        case 3: // Interactive
                            self.fireEvent('uploadInteractive');
                            break;
                        case 4: // Complete
                            self.fireEvent('uploadComplete');
                            self.alreadyUploaded = true;
                            break;
                    }
                }
            });
            form.post(self.options.url);
        }).hide();

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


var GearsSingleFileUploader = new Class({
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
/**
 * GearsImageUploader class
 *
 * Classes for uploading images using Google's Gears plugin.
 *
 * They can display upload status, progress bar and emulate
 * classic html form uploads so server-side changes are not required.
 *
 * Do client-side resizing before upload.
 *
 * Depends on GearsUploader.js, GearsMultipartForm.js
 * (optionally - on ProgressBar.js).
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 */

var GearsImageUtilsMixin = new Class({

    canvasFromBlob: function(blob, maxWidth){
        var canvas = google.gears.factory.create('beta.canvas');
        canvas.decode(blob);
        if (maxWidth)
            this.makeThumbnail(canvas, maxWidth);
        return canvas;
    },

    makeThumbnail: function(canvas, maxWidth){
        var w = canvas.width;
        var h = canvas.height;
        var ratio = h / w;

        if (maxWidth < w) {
            w = maxWidth;
            h = w * ratio;
        }
        canvas.resize(parseInt(w), parseInt(h));
    },

    blobFromCanvas: function(canvas, quality)
    {
        return canvas.encode("image/jpeg", {quality: quality});
    },

    imgFromBlob: function(blob, imgElement)
    {
        var localServer = google.gears.factory.create('beta.localserver');
        var store = localServer.createStore('store');
        var url = url ? url: '/image'+Math.random()+'.jpg?';
        store.captureBlob(blob, url, "image/jpeg");
        $(imgElement).setProperty('src', url);
        setTimeout(function (){store.remove(url)}, 1000);
    }
});


var GearsImageUploader = new Class({
    Extends: GearsUploader,
    Implements: GearsImageUtilsMixin,

    options :{
        statuses: {},

        maxWidth: 600,
        previewWidth: null,
        quality: 0.9,
        fileOpenOptions: {
            filter : ['image/jpeg', 'image/png'],
            singleFile: false
        },
        previewsElement: 'gears-previews',
        fileElementName: 'image',
        onUploadComplete: function(){
            this.files.each(function(file){
                file.img.dispose();
            });
            this.files = [];
            this.setStatus('stateComplete');
        }
    },

    injectImage: function(img){
        var elem = $(this.options.previewsElement);
        if (elem)
            img.inject(elem, 'top');
        return img;
    },

    handleFile: function(file){
        var canvas = this.canvasFromBlob(file.blob, this.options.maxWidth);
        var blob = this.blobFromCanvas(canvas);

        var previewCanvas = canvas;
        var previewBlob = blob;

        if (this.options.previewWidth) {
            this.makeThumbnail(previewCanvas, this.options.previewWidth);
            previewBlob = this.blobFromCanvas(previewCanvas);
        }

        var self = this;
        var img = new Element('img', {
            'events':{
                'click': function(){
                    self.files = self.files.filter(function(item){
                        return item.img != img;
                    });
                    img.dispose();
                    if (!self.files.length)
                        self.setStatus('noFiles');
                }
            }
        });
        img = this.injectImage(img);
        this.imgFromBlob(previewBlob, img);
        this.files.push({'name':file.name, 'blob':blob, 'img': img});
    }
});

var GearsSingleImageUploader = new Class({

    Extends: GearsImageUploader,

    options: {
        verboseProcessing: false,
        fileElementName: 'image',
        statuses: {},
        fileOpenOptions: {
            filter : ['image/jpeg', 'image/png'],
            singleFile: true
        },
        onUploadComplete: function(){
            this.files = [];
            this.setStatus('stateComplete');
        }
    },

    getFileElementName: function(index){
        return this.options.fileElementName;
    },

    injectImage: function(img){
        var elem = $(this.options.previewsElement);
        if (elem) {
            elem.src = img.src;
            return $(this.options.previewsElement);
        }
        return img;
    }
});
/*
 * DjangoUploader and DjangoImageUploader classes.
 *
 * Emulates django image and files uploading using formsets.
 * No server side changes are needed.
 *
 * If you want to replace ImageField or FileField in form then use
 * GearsSingleFileUploader or GearsSingleImageUploader.
 * DjangoUploader and DjangoImageUploader are for django formsets.
 *
 * Depends on GearsUploader.js and GearsMultipartForm.js
 * (optionally : ProgressBar.js and GearsImageUploader.js)
 *
 */

var DjangoFormsetMixin = new Class({
    options: {
        formsetPrefix: 'form'
    },

    getManagementFields: function(){
        var prefix = this.options.formsetPrefix;
        var fields = {};
        fields[prefix + '-INITIAL_FORMS'] = '0';
        fields[prefix + '-TOTAL_FORMS'] = this.files.length.toString();
        return fields;
    },

    getFormFiles: function(){
        var formFiles = {};
        var pref = this.options.formsetPrefix+'-';
        var name = '-'+this.options.fileElementName;
        for (var i = 0; i < this.files.length; i++) {
            formFiles[pref+i+name] = this.files[i];
        }
        return formFiles;
    },

    getFormFields: function(){
        return this.getManagementFields();
    }
});

var DjangoUploader = new Class({
    Extends: GearsUploader,
    Implements: DjangoFormsetMixin
});

if (window.GearsImageUploader) {
    var DjangoImageUploader = new Class({
        Extends: GearsImageUploader,
        Implements: DjangoFormsetMixin
    });
}
/**
 * Russian localization for uploader classes.
 *
 * Include it after other uploader files and statuses becomes Russian.
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 */

if (window.GearsUploader) {
    GearsUploader.implement('options', {
        statuses: {
            'noFiles': 'Ни одного файла не выбрано.',
            'alreadyUploaded': 'Эти файлы уже были загружены.',
            'processing': 'Обработка файлов..',
            'selected': 'Файлы подготовлены к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка файлов..',
            'stateSent': 'Файлы отправлены, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Файлы загружены.'
        }
    });
}

if (window.GearsSingleFileUploader) {
    GearsSingleFileUploader.implement('options', {
        statuses: {
            'noFiles': 'Файл не выбран.',
            'alreadyUploaded': 'Этот файл уже был загружен.',
            'processing': 'Обработка..',
            'selected': 'Файл готов к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка файла..',
            'stateSent': 'Файл отправлен, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Файл загружен на сервер.'
        }
    });
}

if (window.GearsImageUploader) {
    GearsImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Ни одного файла не выбрано.',
            'alreadyUploaded': 'Эти файлы уже были загружены.',
            'processing': 'Обработка изображений..',
            'selected': 'Изображения готовы к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка файлов..',
            'stateSent': 'Файлы отправлены, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Изображения загружены.'
        }
    });
}

if (window.GearsSingleImageUploader) {
    GearsSingleImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Изображение не выбрано.',
            'alreadyUploaded': 'Это изображение уже было загружено.',
            'processing': 'Обработка изображения..',
            'selected': 'Изображение готово к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка изображения..',
            'stateSent': 'Файл отправлен, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Изображение загружено.'
        }
    });
}
