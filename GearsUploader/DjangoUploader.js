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
