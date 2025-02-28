"use strict";

var KTSponsorshipsList = function () {
    // Define shared variables
    var table = document.getElementById('kt_table_sponsorships');
    var datatable;
    var toolbarBase;
    var toolbarSelected;
    var selectedCount;


    var kt_refersh_btn = document.getElementById('kt_refersh_btn');
    var initRefershTable = function () {
        kt_refersh_btn.addEventListener('click', function () {
            var catTable = $('#kt_table_sponsorships').dataTable();
            catTable.fnDraw();
        })
    }

    // Private functions
    var initSponsorshipTable = function () {
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            "pageLength": 10,
            "lengthMenu": [10, 25, 50, 75, 100],
            "lengthChange": true,
            "processing": true,
            "serverSide": true,
            "filter": true,
            "language": {
                "emptyTable": "لا يوجد بيانات في هذا الجدول",
                "zeroRecords": "لا يوجد بيانات تتطابق مع بحثك",
                "processing": `<span class="spinner-border w-15px h-15px text-muted align-middle me-2"></span><span class="text-gray-600">جاري التحميل</span> `
            },
            "ajax": {
                "url": "/Admin/Sponsorship/GetSponsorships",
                "type": "POST",
                "datatype": "json",
                "data": function (d) {
                    return $.extend({}, d, {
                        "SponsorshipType": $("#SponsorshipTypeFilter").val(),
                        "OrphanCode": $("#OrphanNamesFilter").val(),
                    });
                }
            },
            "columnDefs": [{
                "targets": [0],
                "visible": false,
                "searchable": false
            }],
            "columns": [{
                "data": "id", "title": "Id",
                "autowidth": true
            },
            {
                "data": "sponsorName", "title": "إسم المتكفل",
            },

            { "data": "orphanName", "title": "إسم اليتيم" },
            { "data": "startDate", "title": "تاريخ البداية" },
            { "data": "endDate", "title": "تاريخ النهاية" },
            { "data": "amount", "title": "المبلغ" },
            {
                "data": null,
                "title": "حالة الكفالة",
                "render": function (data, type, row) {
                    var badgeClass = "";
                    var badgeText = "";

                    if (row.sponsorshipType == 1) {
                        badgeClass = "badge bg-success";
                        badgeText = "جزئية";
                    } else if (row.sponsorshipType == 0) {
                        badgeClass = "badge bg-danger";
                        badgeText = "كلية";
                    } else if (row.sponsorshipType == 2) {
                        badgeClass = "badge bg-secondary";
                        badgeText = "غير مكفول ";
                    }

                    return `<span class="${badgeClass}">${badgeText}</span>`;
                },
            }
                ,
            {
                data: null,
                "render": function (data, type, row) {
                    var activiateBtnText = "";
                    var btns = `
                    <a  class="btn btn-sm btn-light btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">إجراءات
															<span class="svg-icon svg-icon-5 m-0">
																<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z" fill="currentColor"></path>
																</svg>
															</span>
														</a>
                                                          <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" data-kt-menu="true">
                                                             <div class="menu-item px-3">
															<a  class="menu-link px-3" onclick="initToggleAddOrUpdateSponsorshipModal('${row.id}')">تعديل</a>
														</div>
														<div class="menu-item px-3">
															<a  class="menu-link px-3" onclick="DeleteSponsorship('${row.id}')">حذف</a>
														</div>
													</div>
                           `

                    return btns;
                },
                "orderable": false,
                "width": 150,
                "title": "إجراءات",
            }]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            initToggleToolbar();
            KTMenu.createInstances();
            createSelect2()
            toggleToolbars();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-sponsorship-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Filter Datatable
    var handleFilterDatatable = () => {
        // Select filter options
        $('#SponsorshipTypeFilter').on('select2:select', function (e) {
            datatable.draw();
        }); $('#SponsorshipTypeFilter').on('select2:clear', function (e) {
            datatable.draw();
        });
        $('#OrphanNamesFilter').on('select2:select', function (e) {
            datatable.draw();
        }); $('#OrphanNamesFilter').on('select2:clear', function (e) {
            datatable.draw();
        });
    }
    var createSelect2 = function () {
        var select2FocusFixInitialized = false;

        // Check if jQuery included
        if (typeof jQuery == "undefined") {
            return;
        }

        // Check if select2 included
        if (typeof $.fn.select2 === "undefined") {
            return;
        }

        var elements = [].slice.call(
            table.querySelectorAll(
                '[data-control="select2"], [data-kt-select2="true"]'
            )
        );
        $('#kt_table_sponsorships [data-control="select2"],#kt_table_sponsorships  [data-kt-select2="true"]').on('select2:select', function (e) {
            var id = e.target.getAttribute("data-userId")
            e.target.previousElementSibling.classList.remove("d-none")
            e.target.disabled = true;

            var fromdata = new FormData();

            fromdata.append("Id", id);
            fromdata.append("SponsorshipType", e.target.value);
            $.ajax({
                url: '/Admin/Sponsorship/ChangeSponsorshipType',
                method: "POST",
                data: fromdata,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function ({ msg, status }) {
                    if (status == 0) {
                        toastr.error(msg);

                    } else {
                        toastr.success(msg);

                    }
                    // Enable button
                    e.target.disabled = false;
                    e.target.previousElementSibling.classList.add("d-none")


                    // Show popup confirmation 

                },
                error: function () {
                    e.target.disabled = false;
                    e.target.previousElementSibling.classList.add("d-none")
                    toastr.error("آسف، يبدو أن هناك بعض الأخطاء التي تم اكتشافها، من فضلك حاول مرة أخرى.");
                }
            });



        });
        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }
            var options = {
                dir: document.body.getAttribute("direction"),
            };
            if (element.getAttribute("data-hide-search") == "true") {
                options.minimumResultsForSearch = Infinity;
            }
            $(element).select2(options);
            element.setAttribute("data-kt-initialized", "1");
            element.addEventListener('select2:select', function () {
                console.log(element.value)
            })
        });


        if (select2FocusFixInitialized === false) {
            select2FocusFixInitialized = true;

            $(document).on("select2:open", function (e) {
                var elements = document.querySelectorAll(
                    ".select2-container--open .select2-search__field"
                );
                if (elements.length > 0) {
                    elements[elements.length - 1].focus();
                }
            });
        }
    };


    // Init toggle toolbar
    var initToggleToolbar = () => {
        // Toggle selected action toolbar
        // Select all checkboxes
        const checkboxes = table.querySelectorAll('[type="checkbox"]');

        // Select elements
        toolbarBase = document.querySelector('[data-kt-sponsorship-table-toolbar="base"]');
        toolbarSelected = document.querySelector('[data-kt-sponsorship-table-toolbar="selected"]');
        selectedCount = document.querySelector('[data-kt-sponsorship-table-select="selected_count"]');
        const deleteSelected = document.querySelector('[data-kt-sponsorship-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        deleteSelected.addEventListener('click', function () {
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "هل أنت متأكد من أنك تريد حذف الحسابات المحددة ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم، تحذف!",
                cancelButtonText: "لا، ألغي",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    var listIds = [];
                    // Remove all selected customers
                    checkboxes.forEach(c => {
                        if (c.checked && c.value != "All") {
                            listIds.push(c.value);
                        }
                    });
                    console.log(listIds);
                    $.ajax({
                        type: 'POST',
                        data: { ids: listIds },
                        url: '/Admin/Sponsorship/DeleteMultiSponsorship/',
                        success: function ({ msg, status, data }) {
                            $.each(data, function (i, item) {
                                toastr.success(`لقد تم حذف الحساب صاحب البريد ${item}`);
                            })
                            Swal.fire({
                                text: msg,
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "حسناً، فهمت!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            }).then(function () {
                                toggleToolbars(); // Detect checked checkboxes
                                initToggleToolbar(); // Re-init toolbar to recalculate checkboxes
                            });
                            var catTable = $('#kt_table_sponsorships').dataTable();
                            catTable.fnDraw();
                        },
                        error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
                    });

                    // Remove header checked box
                    const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
                    headerCheckbox.checked = false;

                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "لم تحذف العناصر المختارة.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً، فهمت!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        });
    }

    // Toggle toolbars
    const toggleToolbars = () => {
        // Select refreshed checkbox DOM elements 
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }

    return {
        // Public functions  
        init: function () {
            if (!table) {
                return;
            }
            initSponsorshipTable();
            initRefershTable();
            initToggleToolbar();
            handleSearchDatatable();
            handleFilterDatatable();

        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSponsorshipsList.init();
});

//function DeleteSponsorship(id) {
//    Swal.fire({
//        title: 'هل أنت متأكد ؟',
//        text: "لن تتمكن من العودة عن هذا القرار!",
//        icon: 'warning',
//        showCancelButton: true,
//        confirmButtonColor: '#3085d6',
//        cancelButtonColor: '#d33',
//        confirmButtonText: 'نعم، حذفه!',
//        cancelButtonText: 'لا، إلغاء!'
//    }).then((result) => {
//        if (result.isConfirmed) {
//            $.ajax({
//                type: 'POST',
//                data: { id },
//                url: '/Admin/Sponsorship/DeleteSponsorship',
//                success: function (layout) {
//                    console.log(layout)
//                    Swal.fire('إشعار', layout.msg, 'success')
//                    var catTable = $('#kt_table_sponsorships').dataTable();
//                    catTable.fnDraw();
//                },
//                error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
//            });
//        }
//    })
//}

function DeleteSponsorship(id) {
    Swal.fire({
        title: 'هل أنت متأكد ؟',
        text: "لن تتمكن من العودة عن هذا القرار!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، حذفه!',
        cancelButtonText: 'لا، إلغاء!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                data: { id },
                url: '/Admin/Sponsorship/DeleteSponsorship',
                success: function (layout) {
                    console.log(layout)
                    Swal.fire('إشعار حذف', layout.msg, 'success')
                    var catTable = $('#kt_table_sponsorships').dataTable();
                    catTable.fnDraw();
                },
                error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
            });
        }
    })
}
function ActivateSponsorship(id) {
    Swal.fire({
        title: 'هل أنت متأكد ؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم!',
        cancelButtonText: 'لا، إلغاء!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                data: { id },
                url: '/Admin/Sponsorship/ActivateSponsorship',
                success: function (layout) {
                    console.log(layout)
                    Swal.fire('إشعار حذف', layout.msg, 'success')
                    var catTable = $('#kt_table_sponsorships').dataTable();
                    catTable.fnDraw();
                },
                error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
            });
        }
    })
}