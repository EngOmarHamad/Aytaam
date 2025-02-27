"use strict";


var KTUploadFile = function () {
    // Define shared variables
    // Define template element variables
    var id = 1;
    const handleUploads = () => {
        // set the dropzone container id
        const dropzone = document.querySelector(".dropzone");
        const ktupload_Btn = document.querySelector("#kt_upload_Btn");
        const pdfFormFile = document.querySelector("#PDfFormFile");
        var dropzoneItems = dropzone.querySelector(".dropzone-items");
        const dt = new DataTransfer()
        let files = [];
        files = [];
        function DeleteFile(fileName) {
            dt.items.clear();
            files.splice(files.indexOf(files.find(file => file.name === fileName)), 1);
            files.forEach(item => { dt.items.add(item); })
            pdfFormFile.files = dt.files;
        }
        var removeBtns = dropzoneItems.querySelectorAll('[data-dz-remove="remove"]');
        ktupload_Btn.addEventListener('click', function () {
            pdfFormFile.click();
        })
        var previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        var nodeClone = previewNode.cloneNode(true)
        console.log(nodeClone)
        dropzoneItems.removeChild(previewNode);
        pdfFormFile.addEventListener('change', function () {
            console.log(pdfFormFile.files.length)
            dropzoneItems.innerHTML = '';
            for (var i = 0; i < pdfFormFile.files.length; i++) {
                files.push(pdfFormFile.files[i]);
                console.log(pdfFormFile.files[i].name);
                id++;
                var node = nodeClone.cloneNode(true)
                var fileName = node.querySelector('[data-dz-name="fileName"]');
                var fileSize = node.querySelector('[data-dz-size="fileSize"]');
                var removeBtn = node.querySelector('[data-dz-remove="remove"]');
                fileName.innerHTML = pdfFormFile.files[i].name;
                fileSize.innerHTML = `<strong>${(pdfFormFile.files[i].size / (1024 * 1024)).toFixed(3)}</strong> MB`;
                node.id = "dropzoneItem" + id;
                removeBtn.setAttribute('data-id', "dropzoneItem" + id)
                removeBtn.setAttribute('data-filename', pdfFormFile.files[i].name)
                if (pdfFormFile.getAttribute('data-max-size') != 'null') {
                    if ((pdfFormFile.files[i].size / (1024 * 1024)).toFixed(3) > pdfFormFile.getAttribute('data-max-size')) {
                        var errorMessage = node.querySelector('[data-dz-errormessage="errorMessage"]');
                        errorMessage.innerHTML = "max file size is" + pdfFormFile.getAttribute('data-max-size') + "MB";
                        DeleteFile(pdfFormFile.files[i].name);
                    }
                }
                const progressBar = node.querySelector('.progress-bar');
                progressBar.style.opacity = "1";
                var width = 1;
                var timer = setInterval(function () {
                    if (width >= 100) {
                        progressBar.style.width = width + '%';
                        clearInterval(timer);
                    } else {
                        width++;
                        progressBar.style.width = width + '%';
                    }
                }, 20);
                dropzoneItems.appendChild(node);

            }
            removeBtns = dropzoneItems.querySelectorAll('[data-dz-remove="remove"]');
            removeBtns.forEach(i => {
                i.addEventListener('click', () => { RemoveItem(i) })
            })
        })
        function RemoveItem(target) {
            var el = dropzoneItems.querySelector("#" + target.getAttribute('data-id'));
            var filename = target.getAttribute('data-filename');
            dropzoneItems.removeChild(el)
            DeleteFile(filename)
            console.log(pdfFormFile.files)
        }

        // set the preview element template

        //myDropzone.on("addedfile", function (file) {
        //    // Hook each start button
        //    // myDropzone.enqueueFile(file); -- default dropzone function

        //    // Process simulation for demo only
        //    const progressBar = file.previewElement.querySelector('.progress-bar');
        //    progressBar.style.opacity = "1";
        //    var width = 1;
        //    var timer = setInterval(function () {
        //        if (width >= 100) {
        //            myDropzone.emit("success", file);
        //            myDropzone.emit("complete", file);
        //            clearInterval(timer);
        //        } else {
        //            width++;
        //            progressBar.style.width = width + '%';
        //        }
        //    }, 20);


        //    const dropzoneItems = dropzone.querySelectorAll('.upload-zone-item');
        //    dropzoneItems.forEach(dropzoneItem => {
        //        dropzoneItem.style.display = '';
        //    });

        //});

        //// Hide the total progress bar when nothing's uploading anymore
        //myDropzone.on("complete", function (file) {
        //    const progressBars = dropzone.querySelectorAll('.dz-complete');
        //    setTimeout(function () {
        //        progressBars.forEach(progressBar => {
        //            progressBar.querySelector('.progress-bar').style.opacity = "0";
        //            progressBar.querySelector('.progress').style.opacity = "0";
        //            progressBar.querySelector('.upload-zone-start').style.opacity = "0";
        //        });
        //    }, 300);
        //});

        //// Setup the button for remove all files
        //// On all files completed upload
        //myDropzone.on("queuecomplete", function (progress) {
        //    const uploadIcons = dropzone.querySelectorAll('.upload-zone-upload');
        //    uploadIcons.forEach(uploadIcon => {
        //        uploadIcon.style.display = "none";
        //    });
        //});

        //// On all files removed
        //myDropzone.on("removedfile", function (file) {

        //});
    }
    // Public methods
    return {
        init: function () {
            handleUploads();
        }
    }
}();

// On document ready
//KTUtil.onDOMContentLoaded(function () {

//});