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
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            _form,
            {
                fields: {
                    FullName: {
                        validators: {
                            notEmpty: {
                                message: 'إسم اليتيم حقل مطلوب'
                            }
                        }
                    },

                    NationalIdNumber: {
                        validators: {
                            notEmpty: {
                                message: ' رقم هوية اليتيم مطلوب',
                            }
                        }
                    },
                    OrphanType: {
                        validators: {
                            notEmpty: {
                                message: ' حالة اليتيم حقل مطلوب'
                            }
                        }
                    },
                    SponsorshipType: {
                        validators: {
                            notEmpty: {
                                message: 'حالة الكفالة حقل مطلوب'
                            }
                        }
                    }, DateOfBirth: {
                        validators: {
                            notEmpty: {
                                message: 'تاريخ الميلاد حقل مطلوب'
                            }
                        }
                    },
                    MedicalCondition: {
                        validators: {
                            notEmpty: {
                                message: 'الحالة الصحية حقل مطلوب'
                            }
                        }
                    }, GuardianRelation: {
                        validators: {
                            notEmpty: {
                                message: ' صلة الوصي حقل مطلوب'
                            }
                        }
                    }, GuardianName: {
                        validators: {
                            notEmpty: {
                                message: 'اسم الوصي حقل مطلوب'
                            }
                        }
                    },
                    TotalFamilyMembers: {
                        validators: {
                            notEmpty: {
                                message: ' عدد الأفراد الكلي حقل مطلوب'
                            }
                        }
                    }, NumberOfSiblings: {
                        validators: {
                            notEmpty: {
                                message: 'عدد الأخوة  حقل مطلوب'
                            }
                        }
                    }, Image: {
                        validators: {
                            notEmpty: {
                                message: ' صورة اليتيم حقل مطلوب'
                            }
                        }
                    }, GuardianCertificate: {
                        validators: {
                            notEmpty: {
                                message: 'شهادة الوصي حقل مطلوب'
                            }
                        }
                    }, DeathCertificate: {
                        validators: {
                            notEmpty: {
                                message: 'شهادة الوفاة حقل مطلوب'
                            }
                        }
                    }, BirthCertificate: {
                        validators: {
                            notEmpty: {
                                message: ' شهادة الميلاد حقل مطلوب'
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
                    fromdata.append("NationalIdNumber", $('#NationalIdNumber').val());
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
                                        //window.location.href = "/Admin/Orphan/Index";
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


    return {
        init: function () {
            handleForm();
        }
    }
}();


// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTAddOrphan.init();
});