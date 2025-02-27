"use strict";

// Class definition
var KTAddOrphan = function () {

    // Private functions
    var handleForm = function () {
        // Init Datepicker --- For more info, please check Flatpickr's official documentation: https://flatpickr.js.org/

        $("#DateOfBirth").flatpickr({
            "locale": "ar", "static": true,
            dateFormat: "M/d/Y",
        });


        // Form validation
        var validation;
        var _form = document.getElementById('kt_add_orphan_form');
        var submitButton = _form.querySelector('#kt_add_orphan_submit');

        const imageInput = element.querySelector('.image-input');
        const Orphan2IdValidators = {
            validators: {
                notEmpty: {
                    message: 'خطيب المجلس الثاني حقل مطلوب'
                },
            },
        };
        const Board2DateTimeValidators = {
            validators: {
                notEmpty: {
                    message: 'تاريخ ووقت المجلس الثاني مطلوب',
                },
            },
        };
        const OwnerIdValidators = {
            validators: {
                notEmpty: {
                    message: 'صاحب المجلس حقل مطلوب'
                },
            },
        };


        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            _form,
            {
                fields: {
                    Title: {
                        validators: {
                            notEmpty: {
                                message: 'عنوان المجلس حقل مطلوب'
                            }
                        }
                    },

                    OrphanId: {
                        validators: {
                            notEmpty: {
                                message: 'الخطيب  حقل مطلوب'
                            }
                        }
                    },
                    BoardDateTime: {
                        validators: {
                            notEmpty: {
                                message: 'تاريخ ووقت المجلس  حقل مطلوب'
                            }
                        }
                    }, LiveBroadcastLink: {
                        validators: {
                            //notEmpty: {
                            //    message: 'رابط البث المباشر للمجلس  حقل مطلوب'
                            //},
                            uri: {
                                message: 'ادخل رابط صحيح'

                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );
        console.log(validation)

        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            validation.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');
                    // Disable button to avoid multiple click 
                    submitButton.disabled = true;
                    // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    var fromdata = new FormData();

                    fromdata.append("Code", $('#Code').val());
                    fromdata.append("FullName", $('#FullName').val());
                    fromdata.append("OrphanType", $('#OrphanType').val());
                    fromdata.append("SponsorshipType", $('#SponsorshipType').val());
                    fromdata.append("DateOfBirth", $('#DateOfBirth').val());
                    fromdata.append("Notes", $('#Notes').val());
                    fromdata.append("MedicalCondition", $('#MedicalCondition').val());
                    fromdata.append("GuardianRelation", $('#GuardianRelation').val());
                    fromdata.append("GuardianName", $('#GuardianName').val());
                    fromdata.append("TotalFamilyMembers", $('#TotalFamilyMembers').val());
                    fromdata.append("NumberOfSiblings", $('#NumberOfSiblings').val());
                    fromdata.append("Image", $('#Image')[0].files[0]);
                    fromdata.append("GuardianCertificate", $('#GuardianCertificate')[0].files[0]);
                    fromdata.append("DeathCertificate", $('#DeathCertificate')[0].files[0]);
                    fromdata.append("BirthCertificate", $('#BirthCertificate')[0].files[0]);
                    $.ajax({
                        url: '/Admin/Orphan/AddOrUpdateOrphan',
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
                                        toastr.success(msg);
                                        window.location.href = "/Admin/Orphan/Index";
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
                    swal.fire({
                        text: "آسف، يبدو أن هناك بعض الأخطاء التي تم اكتشافها، من فضلك حاول مرة أخرى.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسنا",
                        customClass: {
                            confirmButton: "btn fw-bold btn-light-warning"
                        }
                    });
                }
            });
        });
    }

    //const initToggleOwnerSelect = () => {
    //    $('#AmITheOwner').on('select2:select', function (e) {
    //        Toggle()
    //    });
    //    $('#AmITheOwner').on('select2:clear', function (e) {
    //        Toggle();
    //    });
    //    function Toggle() {
    //        if ($('#AmITheOwner').val() == "true") {
    //            $("#selectOwner").addClass("d-none");
    //            validation.removeField("OwnerId");

    //        } else if ($('#AmITheOwner').val() == "false") {
    //            $("#selectOwner").removeClass("d-none");
    //            validation.addField("OwnerId", OwnerIdValidators);
    //        }

    //    }

    //}
    // Public methods
    return {
        init: function () {
            handleForm();
            initSelect2Flags();
            //initToggleOwnerSelect();
        }
    }
}();


// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAddOrphan.init();
});