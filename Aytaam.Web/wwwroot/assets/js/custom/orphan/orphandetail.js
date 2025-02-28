"use strict";
// Class definition
var KTOrphanDetailsorphan = function () {
    // Shared variables
    // Init Details schedule modal
    var initDetailsorphan = () => {
        const element = document.getElementById('kt_modal_baseModel');
        const cancelButton = element.querySelector('[data-kt-orphan-modal-action="cancel"]');
        cancelButton.addEventListener('click', e => {
            $("#kt_modal_baseModel").modal("hide");
        });

        // Close button handler
        const closeButton = element.querySelector('[data-kt-orphan-modal-action="close"]');
        closeButton.addEventListener('click', e => {
            $("#kt_modal_baseModel").modal("hide");

        });
    }
    return {
        // Public functions
        init: function () {
            initDetailsorphan();
        }
    };
}();

function initToggleorphanDetailsModal(code) {
    $.ajax({
        type: 'POST',
        url: '/Home/RenderOrphanDetails',
        data: { code: code },
        success: function (layout) {
            $("#kt_modal_baseModel").html(layout);
            $("#kt_modal_baseModel").modal("show");
            KTOrphanDetailsorphan.init()
        },
        error: function (xhr, status, error) {
            console.log(error)
            console.log(xhr)
            console.log(status)
        }
    });
}


function initToggleorphanDetails2Modal(code) {
    $.ajax({
        type: 'POST',
        url: '/Admin/Orphan/RenderOrphanDetails',
        data: { code: code },
        success: function (layout) {
            $("#kt_modal_baseModel").html(layout);
            $("#kt_modal_baseModel").modal("show");
            KTOrphanDetailsorphan.init()
        },
        error: function (xhr, status, error) {
            console.log(error)
            console.log(xhr)
            console.log(status)
        }
    });
}
