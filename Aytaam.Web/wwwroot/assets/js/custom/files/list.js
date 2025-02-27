"use strict";


var KTFileManagerList = function () {
    // Define shared variables
    // Define template element variables

    // Init dropzone
    const initDropzone = () => {
        // set the dropzone container id
        const id = "#kt_upload_zone";
        const dropzone = document.querySelector(id);

        // set the preview element template
        var previewNode = dropzone.querySelector(".upload-zone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
            url: "path/to/your/server", // Set the url for your upload script location
            parallelUploads: 1,
            previewTemplate: previewTemplate,
            maxFilesize: 2, // Max filesize in MB
            autoProcessQueue: false, // Stop auto upload
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: id + " .upload-zone-items", // Define the container to display the previews
            clickable: id + " .upload-zone-select" // Define the element that should be used as click trigger to select files.
        });

        myDropzone.on("addedfile", function (file) {
            // Hook each start button
            // myDropzone.enqueueFile(file); -- default dropzone function

            // Process simulation for demo only
            const progressBar = file.previewElement.querySelector('.progress-bar');
            progressBar.style.opacity = "1";
            var width = 1;
            var timer = setInterval(function () {
                if (width >= 100) {
                    myDropzone.emit("success", file);
                    myDropzone.emit("complete", file);
                    clearInterval(timer);
                } else {
                    width++;
                    progressBar.style.width = width + '%';
                }
            }, 20);


            const dropzoneItems = dropzone.querySelectorAll('.upload-zone-item');
            dropzoneItems.forEach(dropzoneItem => {
                dropzoneItem.style.display = '';
            });

        });

        // Hide the total progress bar when nothing's uploading anymore
        myDropzone.on("complete", function (file) {
            const progressBars = dropzone.querySelectorAll('.dz-complete');
            setTimeout(function () {
                progressBars.forEach(progressBar => {
                    progressBar.querySelector('.progress-bar').style.opacity = "0";
                    progressBar.querySelector('.progress').style.opacity = "0";
                    progressBar.querySelector('.upload-zone-start').style.opacity = "0";
                });
            }, 300);
        });

        // Setup the button for remove all files
        // On all files completed upload
        myDropzone.on("queuecomplete", function (progress) {
            const uploadIcons = dropzone.querySelectorAll('.upload-zone-upload');
            uploadIcons.forEach(uploadIcon => {
                uploadIcon.style.display = "none";
            });
        });

        // On all files removed
        myDropzone.on("removedfile", function (file) {

        });
    }
    // Public methods
    return {
        init: function () {
            initTemplates();
            initDropzone();
        }
    }
}();

// On document ready
//KTUtil.onDOMContentLoaded(function () {

//});