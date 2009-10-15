window.addEvent('domready', function() {

    if (!window.google || !google.gears)
        return;

    if (google.gears.factory.version < '0.5.21')
        return;


    if ($('upload-one-image') || $('upload-images'))
    {
        $$('.standard-upload').setStyle('display','none');
        $$('.gears-upload').setStyle('display', 'block');

        var pb = new ProgressBar({
            container:'progress-bar',
            displayText: true,
            speed: 100
        });

        if ($('upload-one-image')) {
            var uploader = new GearsSingleImageUploader({
                statusElement: 'upload-status',
                previewsElement: 'thumb',
                fileElementName: 'img',
                maxWidth: 200,
                progressBar: pb
            });
        }
        else {
            var uploader = new DjangoImageUploader({
                statusElement: 'upload-status',
                previewsElement: 'thumbs',
                fileElementName: 'img',
                progressBar: pb
            });
        }
    }
});
