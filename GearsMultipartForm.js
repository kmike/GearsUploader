/*
 * GearsMultipartForm
 *
 * Javascript multipart form class.
 * Can be used for emulating classic html form
 * uploads (with text field and file fields).
 *
 * Built for Mootools 1.2 and Google Gears >= 0.5.21
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 *
 * Example:

 var desktop = google.gears.factory.create('beta.desktop');
 desktop.openFiles(function(files){
    var form = GearsMultipartForm({
                 files: {'myfile': files[0]},
                 fields: {'input1': 'any text', 'input2': 'any text'}
             });
    form.post('my_url');
 });

 *
 */

var GearsMultipartForm = new Class({

    options : {
        onprogress: $empty,
        onreadystatechange: $empty,
        files: {}, // {'file field name': File}
        fields: {} // {'field name': 'text content'}
    },

    initialize: function(options) {
        self = this;
        $each(options, function(value,key){
            self.options[key]=value;
        });
    },

    buildData: function(boundary)
    {
        var crlf = '\r\n';

        var builder = google.gears.factory.create('beta.blobbuilder');
        var self = this;

        $each(this.options.fields, function(text, name){
            builder.append('--'+boundary+crlf);
            builder.append(self.getContentDispositionHeader(name)+crlf);
            builder.append(crlf);
            builder.append(text);
            builder.append(crlf);
        });

        $each(this.options.files, function(file, name){
            builder.append('--'+boundary+crlf);
            builder.append(self.getContentDispositionHeader(name, file.name)+crlf);
            var mime = 'application/octet-stream';
            if ('mime' in file)
                mime = file.mime;
            builder.append('Content-Type: '+mime+crlf+crlf);
            builder.append(file.blob);
            builder.append(crlf);
        });

        builder.append('--'+boundary+'--'+crlf);
        return builder.getAsBlob();
    },

    getContentDispositionHeader: function(name, filename)
    {
        var res = 'Content-Disposition: form-data; name="'+name+'"';
        if (filename)
            res = res + '; filename="' + filename + '"'; // rfc2047.encode(filename)?
        return res;
    },

    getContentTypeHeader: function(type)
    {
        if (type == null)
            type = 'text/plain';
        return 'Content-Type:'+type+ this.crlf;
    },

    post: function(url){

        function randomString(len) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var randomstring = '';
            for (var i=0; i<len; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            return randomstring;
        }

        var boundary = '-------------------------'+randomString(24);

        this.request = google.gears.factory.create('beta.httprequest');
        this.request.upload.onprogress = this.options.onprogress;
        this.request.onreadystatechange = this.options.onreadystatechange;

        this.request.open('POST', url);
        this.request.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
        this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.request.send(this.buildData(boundary));
    }
});
