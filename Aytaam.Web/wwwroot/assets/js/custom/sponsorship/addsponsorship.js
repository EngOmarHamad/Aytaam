"use strict";
// Class definition
var KTSponsorshipsAddSponsorship = function () {
    // Shared variables
    // Init add schedule modal
    var initAddSponsorship = () => {
        const element = document.getElementById('kt_modal_baseModel');
        const form = element.querySelector('#kt_modal_addOrUpdate_sponsorship_form');

        $("#StartDate").flatpickr({
            "locale": "ar", "static": true,
            dateFormat: "M/d/Y",
        });


        $("#EndDate").flatpickr({
            "locale": "ar", "static": true,
            dateFormat: "M/d/Y",
        });


        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'OrphanCode': {
                        validators: {
                            notEmpty: {
                                message: 'حدد اليتيم'
                            },
                            regexp: {
                                message: 'الرجاء إدخال رمز يتيم صالح (لا يجب أن يكون رقمًا)',
                                regexp: /^[^0-9]+$/
                            }
                        }
                    },
                    'SponsorName': {
                        validators: {
                            notEmpty: {
                                message: 'حدد المتكفل'
                            },
                            stringLength: {
                                min: 3,
                                message: 'اسم المتكفل يجب أن يكون على الأقل 3 أحرف'
                            },
                            regexp: {
                                message: 'الاسم لا يجب أن يحتوي على أرقام',
                                regexp: /^[^0-9]+$/
                            }
                        }
                    },
                    'Amount': {
                        validators: {
                            notEmpty: {
                                message: 'حدد المبلغ'
                            },
                            numeric: {
                                message: 'الرجاء إدخال مبلغ صحيح'
                            },
                            greaterThan: {
                                value: 0,
                                message: 'المبلغ يجب أن يكون أكبر من 0'
                            }
                        }
                    },
                    'StartDate': {
                        validators: {
                            notEmpty: {
                                message: 'حدد بدايتها'
                            },
                            date: {
                                format: 'YYYY-MM-DD',
                                message: 'الرجاء إدخال تاريخ صالح'
                            },
                            callback: {
                                message: 'تاريخ البداية يجب أن يكون قبل اليوم',
                                callback: function (input) {
                                    var startDate = new Date(input.value);
                                    var today = new Date();
                                    today.setHours(0, 0, 0, 0); // تصفير الوقت ليتم مقارنة التاريخ فقط
                                    return startDate < today; // التأكد من أن تاريخ البداية قبل اليوم
                                }
                            }
                        }
                    },
                    'EndDate': {
                        validators: {
                            notEmpty: {
                                message: 'حدد نهايتها'
                            },
                            date: {
                                format: 'YYYY-MM-DD',
                                message: 'الرجاء إدخال تاريخ صالح'
                            },
                            callback: {
                                message: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
                                callback: function (input) {
                                    var startDate = form.querySelector('[name="StartDate"]').value;
                                    var endDate = input.value;
                                    if (startDate && endDate) {
                                        return new Date(endDate) > new Date(startDate);
                                    }
                                    return true;
                                }
                            }
                        }
                    },
                    'SponsorshipType': {
                        validators: {
                            notEmpty: {
                                message: 'حدد نوع الكفالة'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                    })
                }
            }
        );

        // Submit button handler
        //const AuthorType = element.querySelector('#AuthorType');
        //AuthorType.addEventListener('select2:select', e => {


        //});


        const submitButton = element.querySelector('[data-kt-sponsorships-modal-action="submit"]');
        submitButton.addEventListener('click', e => {
            e.preventDefault();
            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        // Show loading indication
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable button to avoid multiple click 
                        submitButton.disabled = true;

                        // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/

                        var fromdata = new FormData();

                        fromdata.append("Id", $('#Id').val());
                        fromdata.append("OrphanCode", $('#OrphanCode').val());
                        fromdata.append("SponsorName", $('#SponsorName').val());
                        fromdata.append("Amount", $('#Amount').val());
                        fromdata.append("StartDate", $('#StartDate').val());
                        fromdata.append("EndDate", $('#EndDate').val());
                        fromdata.append("SponsorshipType", $('#SponsorshipType').val());
                        fromdata.append("Notes", $('#Notes').val());
                        $.ajax({
                            url: '/Admin/Sponsorship/AddOrUpdateSponsorship',
                            method: "POST",
                            data: fromdata,
                            dataType: 'json',
                            contentType: false,
                            processData: false,
                            success: function ({ msg, status }) {
                                if (status == 0) {
                                    toastr.error(msg);

                                } else {
                                    Swal.fire({
                                        text: " تم إرسال النموذج بنجاح",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "حسناً، فهمت!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    }).then(function (result) {
                                        if (result.isConfirmed) {
                                            $("#kt_modal_baseModel").modal("hide");
                                            var Table = $('#kt_table_sponsorships').dataTable();
                                            Table.fnDraw();
                                        }



                                    });
                                }
                                submitButton.removeAttribute('data-kt-indicator');
                                // Enable button
                                submitButton.disabled = false;

                                // Show popup confirmation 

                            },
                            error: function () {
                                submitButton.removeAttribute('data-kt-indicator');
                                submitButton.disabled = false;
                                toastr.error("آسف، يبدو أن هناك بعض الأخطاء التي تم اكتشافها، من فضلك حاول مرة أخرى.");
                            }
                        });


                    } else {
                        // Show popup warning. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                        toastr.error("آسف، يبدو أن هناك بعض الأخطاء التي تم اكتشافها، من فضلك حاول مرة أخرى.");

                    }
                });
            }
        });

        // Cancel button handler
        const cancelButton = element.querySelector('[data-kt-sponsorships-modal-action="cancel"]');
        cancelButton.addEventListener('click', e => {
            e.preventDefault();

            Swal.fire({
                text: "هل أنت متأكد أنك ترغب في الإلغاء ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم، ألغيه!",
                cancelButtonText: "لا، العودة",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form			
                    $("#kt_modal_baseModel").modal("hide");
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "نموذج الإرسال الخاص بك لم يتم إلغاؤه!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً، فهمت!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // Close button handler
        const closeButton = element.querySelector('[data-kt-sponsorships-modal-action="close"]');
        closeButton.addEventListener('click', e => {
            e.preventDefault();

            Swal.fire({
                text: "هل أنت متأكد أنك ترغب في الإلغاء ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم، ألغيه!",
                cancelButtonText: "لا، العودة",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form			
                    $("#kt_modal_baseModel").modal("hide");
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "نموذج الإرسال الخاص بك لم يتم إلغاؤه!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً، فهمت!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });



    }
    var initSelect2 = () => {
        var element = document.querySelector('#SponsorshipType')
        var OrphanCode = document.querySelector('#OrphanCode')
        if (element.getAttribute("data-kt-initialized") === "1") {
            return;
        }
        if (OrphanCode.getAttribute("data-kt-initialized") === "1") {
            return;
        }

        var options = {
            dir: document.body.getAttribute("direction"),
        }; var options2 = {
            dir: document.body.getAttribute("direction"),
        };


        if (element.getAttribute("data-hide-search") == "true") {
            options.minimumResultsForSearch = Infinity;
        }
        if (OrphanCode.getAttribute("data-hide-search") == "true") {
            options2.minimumResultsForSearch = Infinity;
        }

        $(element).select2(options); $(OrphanCode).select2(options2);
        element.setAttribute("data-kt-initialized", "1");
    }
    return {
        // Public functions
        init: function () {
            initAddSponsorship();
            initSelect2();
        }
    };
}();
// On document ready
//KTUtil.onDOMContentLoaded(function () {
//    KTSponsorshipsList.init();
//});



function initToggleAddOrUpdateSponsorshipModal(Id) {
    $.ajax({
        type: 'POST',
        url: '/Admin/Sponsorship/RenderAddOrUpdateSponsorship',
        data: { Id },
        success: function (layout) {
            if (layout.status == 0) toastr.error(layout.msg);
            else {
                $("#kt_modal_baseModel").html(layout);
                $("#kt_modal_baseModel").modal("show");
                KTSponsorshipsAddSponsorship.init();
            }
        },
        error: function (xhr, status, error) {
            console.log(error)
            console.log(xhr)
            console.log(status)
        }
    });
}
