
let $OrphansContainer = $("#orphans");
let $Paging = $("#Paging");
let $searchTearmInput = $("#searchTearmInput");
let $OrphanTypeSelect = $("#OrphanTypeFilter");
let $AgeGroupSelect = $("#AgeGroupFilter");
let $SponsorshipTypeSelect = $("#SponsorshipTypeFilter");
let $NoResult = $("#NoResult");

var searchTearm = "";
var OrphanTypeSelectValue = "";
var AgeGroupSelectValue = "";
var SponsorshipTypeSelectValue = "";
let CurPage = 1;

async function getdata() {
    RenderSkeletonCards();
    var formData = new FormData();
    formData.append("curPage", CurPage || 1);
    formData.append("size", 12);
    formData.append("orphanType", OrphanTypeSelectValue || "");
    formData.append("sponsorshipType", SponsorshipTypeSelectValue || "");
    formData.append("ageGroup", AgeGroupSelectValue || "");
    formData.append("searchTearm", searchTearm || "");

    console.log("FormData Object:", Object.fromEntries(formData));

    // if (navigator.onLine) {
    getOrphans(formData).done(function (lstOrphans) {
        $OrphansContainer.html("");
        if (lstOrphans.listOfData && lstOrphans.listOfData.length > 0) {
            $NoResult.html("");
            lstOrphans.listOfData.forEach((p) => RenderCards(p));
        } else if (lstOrphans.listOfData && lstOrphans.listOfData.length == 0
            && OrphanTypeSelectValue == "" && SponsorshipTypeSelectValue == "" && AgeGroupSelectValue == "" && searchTearm == ""

        ) {
            RenderNoData();
        }
        else {
            RenderNoResult();
        }
        RenderPagination(lstOrphans);
    });
    //} else {
    //    $OrphansContainer.html("");
    //    $NoResult.html(`
    //    <div class="card shadow-sm border my-5" style="max-width: 500px">
    //        <div class="card-body text-center">
    //            <i class="bx bx-error text-danger" style="font-size: 100px"></i>
    //            <h2 class="mb-4 text-danger">لا يوجد انترنت</h2>
    //            <p class="h4 mb-4">تأكد من اتصالك بالإنترنت ثم حاول مجددًا</p>           
    //        </div>
    //    </div>
    //`);
    //}
}

getdata();

$searchTearmInput.on("input", function () {
    CurPage = 1;
    searchTearm = $(this).val();
    getdata();
});

$OrphanTypeSelect.on("change", function () {
    CurPage = 1;
    OrphanTypeSelectValue = $(this).val();
    getdata();
});

$AgeGroupSelect.on("change", function () {
    CurPage = 1;
    AgeGroupSelectValue = $(this).val();
    getdata();
});

$SponsorshipTypeSelect.on("change", function () {
    CurPage = 1;
    SponsorshipTypeSelectValue = $(this).val();
    getdata();
});

function getAll() {
    CurPage = 1;
    searchTearm = "";
    getdata();
}

$(window).on("online", getAll);

function RenderNoResult() {
    $NoResult.html(`
        <div class="card shadow-sm my-5 border" style="max-width: 500px">
            <div class="card-body text-center">
                <i class="bx bx-error-circle text-main" style="font-size: 100px"></i>
                <h2 class="mb-4 text-main">لا يوجد نتائج</h2>
                <p class="h4 mb-4">حاول ضبط مرشحات البحث لمزيد من النتائج.</p>
                <button class="btn btn-success" onclick="getAll()">عرض الكل</button>
            </div>
        </div>
    `);
}

function RenderNoData() {
    $NoResult.html(`
        <div class="card shadow-sm my-5 border" style="max-width: 500px">
            <div class="card-body text-center">
                <i class="bx bx-error-circle text-main" style="font-size: 100px"></i>
                <h2 class="mb-4 text-">لا يوجد بيانات حاليا</h2>
            </div>
        </div>
    `);
}
$(window).on("offline", function () {
    $OrphansContainer.html("");
    $NoResult.html(`
        <div class="card shadow-sm border my-5" style="max-width: 500px">
            <div class="card-body text-center">
                <i class="bx bx-error text-danger" style="font-size: 100px"></i>
                <h2 class="mb-4 text-danger">لا يوجد انترنت</h2>
                <p class="h4 mb-4">تأكد من اتصالك بالإنترنت ثم حاول مجددًا</p>
            </div>
        </div>
    `);
});

function RenderCards(Orphan) {
    const formatter = new Intl.NumberFormat("ar-PS", {
        style: "currency",
        currency: "ILS",
        minimumFractionDigits: 2
    });
    let card = $(`
        <div class="col p-2">
            <div class="card text-center mt-5">
                <div class="position-relative" style="height: 250px;">
                    <img src="${Orphan.imagePath}" class="card-img-top" alt="صورة الطفل" style="height: 250px; object-fit: cover;">
                    <span class="position-absolute bg-dark text-white p-1 rounded" style="top:10px;right:10px">
                        تكلفة الكفالة: ${formatter.format(Orphan.amount)} 
                    </span>
                </div>
                <div class="card-body p-3">
                    <div class="progress mb-3">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${Orphan.progressPercentage}%;" aria-valuenow="${Orphan.progressPercentage}" aria-valuemin="0" aria-valuemax="100">
                            ${Orphan.progressPercentage}%
                        </div>
                    </div>
                    <h5 class="card-title">أهلًا، أنا ${Orphan.fullName} وعمري ${Orphan.age} سنوات</h5>
                    <div class="d-flex justify-content-between p-2 bg-warning-light">
                        <div class="text-center">
                            <p class="mb-1 text-warning fw-bold">الفترة المكفولة</p>
                            <strong>${Orphan.numberOfSponsorShipMonths ?? 0} أشهر</strong>
                        </div>
                        <div class="text-center">
                            <p class="mb-1 text-warning fw-bold">فترة الكفالة المتبقية</p>
                            <strong>${Orphan.numberOfRemainderSponsorShipMonths ?? 0} أشهر</strong>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <button class="btn more" onclick="initToggleorphanDetailsModal('${Orphan.code}')">مزيد من التفاصيل</button>
<a class="btn btn-success " href="https://wa.me/+970567092465" target="_blank">
                                    تبرع الآن
                                </a>
                </div>
            </div>
        </div>
    `);

    $OrphansContainer.append(card);
}

function RenderSkeletonCards(count = 12) {
    $OrphansContainer.html(""); // Clear previous content
    for (let i = 0; i < count; i++) {
        let card = $(`
            <div class="col p-2">
                <div class="card text-center mx-auto mt-5 placeholder-wave" style="width: 22rem;">
                    <div class="position-relative" style="height: 250px;">
                        <div class="card-img-top bg-secondary placeholder" style="height: 250px;"></div>
                        <span class="position-absolute bg-dark text-white p-1 rounded placeholder col-4" 
                            style="top:10px; right:10px; height: 20px;"></span>
                    </div>
                    <div class="card-body p-3">
                        <div class="progress mb-3">
                            <div class="progress-bar bg-success placeholder" style="width: 100%; height: 20px;"></div>
                        </div>
                        <h5 class="card-title placeholder col-8 mx-auto"></h5>
                        <button class="btn placeholder col-4"></button>
                    </div>
                </div>
            </div>
        `);
        $OrphansContainer.append(card);
    }
}

function NextPage(JsonData) {
    if (CurPage < JsonData.totalPages) {
        CurPage++;
        getdata();
    }
}

function PrevPage() {
    if (CurPage > 1) {
        CurPage--;
        getdata();
    }
}

function GetPage(index) {
    CurPage = parseInt(index);
    getdata();
}
