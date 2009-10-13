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
