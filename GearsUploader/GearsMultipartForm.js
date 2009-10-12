/*
 * GearsMultipartForm
 *
 * Javascript multipart form class.
 * Can be used for emulating classic html form
 * submissions (with text fields and file fields).
 *
 * Built for Google Gears >= 0.5.21, does not require any js library.
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 *
 * Example:

 var desktop = google.gears.factory.create('beta.desktop');
 desktop.openFiles(function(files){
    var form = new GearsMultipartForm({
        files: {'myfile': files[0]},
        fields: {'input1': 'any text', 'input2': 'any text'}
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

        for (name in this.options.fields){
            var text = this.options.fields[name];
            builder.append('--'+boundary+crlf);
            builder.append(this.getContentDispositionHeader(name)+crlf);
            builder.append(crlf);
            builder.append(text);
            builder.append(crlf);
        }

        for (name in this.options.files){
            var file = this.options.files[name];
            builder.append('--'+boundary+crlf);
            builder.append(this.getContentDispositionHeader(name, file.name)+crlf);
            var mime = 'application/octet-stream';
            if ('mime' in file)
                mime = file.mime;
            builder.append('Content-Type: '+mime+crlf+crlf);
            builder.append(file.blob);
            builder.append(crlf);
        }

        builder.append('--'+boundary+'--'+crlf);
        return builder.getAsBlob();
    }

    this.getContentDispositionHeader = function(name, filename)
    {
        // in rfc 2388 it is stated that filename should be rfc2047-encoded, but
        // it seems that current browsers do not encode them and thus encoding
        // confuse existing server scripts, so we pass filename as-is.

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

    this.post = function(url){

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
        var boundary = '-------------------------'+randomString(24);

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
