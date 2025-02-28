"use strict";

// Class definition
var KTAddOrphan = function () {

    // Private functions
    var handleForm = function () {
        // Init Datepicker --- For more info, please check Flatpickr's official documentation: https://flatpickr.js.org/

        $("#DateOfBirth").flatpickr({
            "locale": "ar", "static": true,
            dateFormat: "Y-m-d",
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
                            },
                            stringLength: {
                                min: 3,
                                max: 50,
                                message: 'يجب أن يكون الاسم بين 3 و 50 حرفًا'
                            },
                            regexp: {
                                regexp: /^[\u0600-\u06FF\sA-Za-z]+$/,
                                message: 'يجب ألا يحتوي الاسم على أرقام أو رموز خاصة'
                            }
                        }
                    },
                    NationalIdNumber: {
                        validators: {
                            notEmpty: {
                                message: 'رقم هوية اليتيم مطلوب',
                            },
                            regexp: {
                                regexp: /^[0-9]{9}$/,
                                message: 'يجب أن يكون رقم الهوية مكونًا من 9 أرقام فقط'
                            }
                        }
                    },
                    OrphanType: {
                        validators: {
                            notEmpty: {
                                message: 'حالة اليتيم حقل مطلوب'
                            }
                        }
                    },
                    Residence: {
                        validators: {
                            notEmpty: {
                                message: 'السكن حقل مطلوب'
                            }, regexp: {
                                regexp: /^[\u0600-\u06FF\sA-Za-z]+$/,
                                message: 'يجب ألا يحتوي السكن على أرقام أو رموز خاصة'
                            }
                        }
                    },
                    DateOfBirth: {
                        validators: {
                            notEmpty: {
                                message: 'تاريخ الميلاد حقل مطلوب'
                            },
                            date: {
                                format: 'YYYY-MM-DD',
                                message: 'تأكد من إدخال تاريخ صحيح قبل تاريخ اليوم',
                                max: new Date().toISOString().split('T')[0] // لا يسمح بالتواريخ المستقبلية
                            }
                        }
                    },
                    MedicalCondition: {
                        validators: {
                            notEmpty: {
                                message: 'الحالة الصحية حقل مطلوب'
                            }
                        }
                    },
                    GuardianRelation: {
                        validators: {
                            notEmpty: {
                                message: 'صلة الوصي حقل مطلوب'
                            },
                            regexp: {
                                regexp: /^[\u0600-\u06FF\sA-Za-z]+$/,
                                message: 'يجب ألا تحتوي صلة الوصي على أرقام أو رموز خاصة'
                            }
                        }
                    },
                    GuardianName: {
                        validators: {
                            notEmpty: {
                                message: 'اسم الوصي حقل مطلوب'
                            },
                            stringLength: {
                                min: 3,
                                max: 50,
                                message: 'يجب أن يكون الاسم بين 3 و 50 حرفًا'
                            },
                            regexp: {
                                regexp: /^[\u0600-\u06FF\sA-Za-z]+$/,
                                message: 'يجب ألا يحتوي اسم الوصي على أرقام أو رموز خاصة'
                            }
                        }
                    },
                    TotalFamilyMembers: {
                        validators: {
                            notEmpty: {
                                message: 'عدد الأفراد الكلي حقل مطلوب'
                            },
                            numeric: {
                                message: 'يجب أن يكون عدد الأفراد رقمًا صحيحًا'
                            }
                        }
                    },
                    NumberOfSiblings: {
                        validators: {
                            notEmpty: {
                                message: 'عدد الأخوة حقل مطلوب'
                            },
                            numeric: {
                                message: 'يجب أن يكون عدد الأخوة رقمًا صحيحًا'
                            }
                        }
                    },
                    Image: {
                        validators: {
                            notEmpty: {
                                message: 'صورة اليتيم حقل مطلوب'
                            },
                            file: {
                                extension: 'jpg,jpeg,png',
                                type: 'image/jpeg,image/png',
                                message: 'يجب أن يكون الملف صورة بصيغة JPG أو PNG'
                            }
                        }
                    },
                    GuardianCertificate: {
                        validators: {
                            notEmpty: {
                                message: 'شهادة الوصي حقل مطلوب'
                            },
                            file: {
                                extension: 'pdf,jpg,jpeg,png',
                                type: 'application/pdf,image/jpeg,image/png',
                                message: 'يجب أن يكون الملف بصيغة PDF أو صورة (JPG, PNG)'
                            }
                        }
                    },
                    DeathCertificate: {
                        validators: {
                            notEmpty: {
                                message: 'شهادة الوفاة حقل مطلوب'
                            },
                            file: {
                                extension: 'pdf,jpg,jpeg,png',
                                type: 'application/pdf,image/jpeg,image/png',
                                message: 'يجب أن يكون الملف بصيغة PDF أو صورة (JPG, PNG)'
                            }
                        }
                    },
                    BirthCertificate: {
                        validators: {
                            notEmpty: {
                                message: 'شهادة الميلاد حقل مطلوب'
                            },
                            file: {
                                extension: 'pdf,jpg,jpeg,png',
                                type: 'application/pdf,image/jpeg,image/png',
                                message: 'يجب أن يكون الملف بصيغة PDF أو صورة (JPG, PNG)'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
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
                    console.log($('#OrphanType').val())

                    fromdata.append("Code", $('#Code').val());
                    fromdata.append("NationalIdNumber", $('#NationalIdNumber').val());
                    fromdata.append("FullName", $('#FullName').val());
                    fromdata.append("OrphanType", $('#OrphanType').val());
                    fromdata.append("Residence", $('#Residence').val());
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