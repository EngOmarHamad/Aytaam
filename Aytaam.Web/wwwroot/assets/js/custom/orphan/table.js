"use strict";

var KTOrphansList = function () {
    // Define shared variables
    var table = document.getElementById('kt_table_orphans');
    var datatable;
    var toolbarBase;
    var toolbarSelected;
    var selectedCount;


    var kt_refersh_btn = document.getElementById('kt_refersh_btn');
    var initRefershTable = function () {
        kt_refersh_btn.addEventListener('click', function () {
            var catTable = $('#kt_table_orphans').dataTable();
            catTable.fnDraw();
        })
    }

    // Private functions
    var initOrphanTable = function () {
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
                "url": "/Admin/Orphan/GetOrphans",
                "type": "POST",
                "datatype": "json",
                "data": function (d) {
                    return $.extend({}, d, {
                        "OrphanType": $("#OrphanTypeFilter").val(),
                        "AgeGroup": $("#AgeGroupFilter").val(),
                        "SponsorshipType": $("#SponsorshipTypeFilter").val(),
                    });
                }
            },
            "columnDefs": [{
                "targets": [0],
                "visible": false,
                "searchable": false
            }],
            "columns": [{
                "data": "code", "title": "Code",
                "autowidth": true
            },
            {
                data: null,
                "render": function (data, type, row) {
                    return `
                    <div class="d-flex align-items-center"><a target="_blank"  href="${row.imagePath}" class="me-4"><div class="symbol symbol-50px"><img src="${row.imagePath}"  class="object-fit-cover "/></div></a>		                <div class="d-flex flex-column">
			                <a href="../../demo1/dist/apps/user-management/users/view.html" class="text-gray-800 text-hover-primary mb-1">${row.fullName}</a>
			                <span>${row.nationalIdNumber}</span>
		                </div>
				    </div>`
                },
                "orderable": false,
                "title": "اسم اليتيم",
            },
            {
                "data": "residence", "title": "السكن",
            },
            {
                "data": null,
                "title": "حالة اليتيم",
                "render": function (data, type, row) {
                    var badgeClass = "";
                    var badgeText = "";

                    if (row.orphanType == 0) {
                        badgeClass = "badge bg-primary";  // يتيم الأب
                        badgeText = "يتيم الأب";
                    } else if (row.orphanType == 1) {
                        badgeClass = "badge bg-success";  // يتيم الأم
                        badgeText = "يتيم الأم";
                    } else if (row.orphanType == 2) {
                        badgeClass = "badge bg-warning";  // يتيم الأبوين
                        badgeText = "يتيم الأبوين";
                    }

                    return `<span class="${badgeClass}">${badgeText}</span>`;
                },
            },
            { "data": "dateOfBirth", "title": "تاريخ الميلاد" },
            {
                "data": null,
                "title": "حالة الكفالة",
                "render": function (data, type, row) {
                    var badgeClass = "";
                    var badgeText = "";

                    if (row.sponsorshipType == 0) {
                        badgeClass = "badge bg-success";
                        badgeText = "جزئية";
                    } else if (row.sponsorshipType == 1) {
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
															<a  class="menu-link px-3" href="/Admin/Orphan/AddOrphan?code=${row.code}">تعديل</a>
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
            KTMenu.createInstances();
            createSelect2()
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-orphan-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Filter Datatable
    var handleFilterDatatable = () => {

        // Select filter options
        $('#OrphanTypeFilter').on('select2:select', function (e) {
            datatable.draw();
        }); $('#OrphanTypeFilter').on('select2:clear', function (e) {
            datatable.draw();
        });
        $('#AgeGroupFilter').on('select2:select', function (e) {
            datatable.draw();
        }); $('#AgeGroupFilter').on('select2:clear', function (e) {
            datatable.draw();
        });
        $('#SponsorshipTypeFilter').on('select2:select', function (e) {
            datatable.draw();
        }); $('#SponsorshipTypeFilter').on('select2:clear', function (e) {
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


    // Toggle toolbars

    return {
        // Public functions  
        init: function () {
            if (!table) {
                return;
            }
            initOrphanTable();
            initRefershTable();
            handleSearchDatatable();
            handleFilterDatatable();

        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTOrphansList.init();
});

//function DeleteOrphan(id) {
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
//                url: '/Admin/Orphan/DeleteOrphan',
//                success: function (layout) {
//                    console.log(layout)
//                    Swal.fire('إشعار', layout.msg, 'success')
//                    var catTable = $('#kt_table_orphans').dataTable();
//                    catTable.fnDraw();
//                },
//                error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
//            });
//        }
//    })
//}

function DeleteOrphan(id) {
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
                url: '/Admin/Orphan/DeleteOrphan',
                success: function (layout) {
                    console.log(layout)
                    Swal.fire('إشعار حذف', layout.msg, 'success')
                    var catTable = $('#kt_table_orphans').dataTable();
                    catTable.fnDraw();
                },
                error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
            });
        }
    })
}
function ActivateOrphan(id) {
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
                url: '/Admin/Orphan/ActivateOrphan',
                success: function (layout) {
                    console.log(layout)
                    Swal.fire('إشعار حذف', layout.msg, 'success')
                    var catTable = $('#kt_table_orphans').dataTable();
                    catTable.fnDraw();
                },
                error: function (xhr, status, error) { toastr.error(error); console.error(error); console.log(xhr); console.log(status); }
            });
        }
    })
}