/**
 * English localization for uploader classes.
 *
 * Include it after other uploader files and statuses becomes English.
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 */

if (window.GearsUploader) {
    GearsUploader.implement('options', {
        statuses: {
            'noFiles': 'Please select some files to upload.',
            'alreadyUploaded': 'Files was already uploaded.',
            'processing': 'Processing files..',
            'selected': 'Files are selected.',

            'stateUninitialized': 'Initializing..',
            'stateOpen': 'Uploading files..',
            'stateSent': 'Files are uploaded, waiting for server response..',
            'stateInteractive': 'Reading server response..',
            'stateComplete': 'Files are uploaded.'
        }
    });
}

if (window.GearsSingleFileUploader) {
    GearsSingleFileUploader.implement('options', {
        statuses: {
            'noFiles': 'Please select file to upload.',
            'alreadyUploaded': 'File was already uploaded.',
            'processing': 'Processing file..',
            'selected': 'File is selected.',

            'stateUninitialized': 'Initializing..',
            'stateOpen': 'File is being uploaded..',
            'stateSent': 'File is uploaded, waiting for server response..',
            'stateInteractive': 'Reading server response..',
            'stateComplete': 'File is uploaded.'
        }
    });
}

if (window.GearsImageUploader) {
    GearsImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Please select some files to upload.',
            'alreadyUploaded': 'Images was already uploaded.',
            'processing': 'Processing images..',
            'selected': 'Images are selected.',

            'stateUninitialized': 'Initializing..',
            'stateOpen': 'Uploading images..',
            'stateSent': 'Images are uploaded, waiting for server response..',
            'stateInteractive': 'Reading server response..',
            'stateComplete': 'Images are uploaded.'
        }
    });
}

if (window.GearsSingleImageUploader) {
    GearsSingleImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Image is not selected.',
            'alreadyUploaded': 'This image is already uploaded.',
            'processing': 'Processing an image..',
            'selected': 'Image is selected.',

            'stateUninitialized': 'Initializing..',
            'stateOpen': 'Uploading image..',
            'stateSent': 'Waiting for server response..',
            'stateInteractive': 'Reading server response..',
            'stateComplete': 'Image is uploaded.'
        }
    });
}