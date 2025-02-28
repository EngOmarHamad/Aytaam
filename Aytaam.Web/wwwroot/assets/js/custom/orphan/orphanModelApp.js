
let OrphansContainer = document.querySelector("#orphans");
let Paging = document.querySelector("#Paging");
let searchTearmInput = document.querySelector("#searchTearm");
let OrphanTypeSelect = document.querySelector("#OrphanTypeFilter");
let AgeGroupSelect = document.querySelector("#AgeGroupFilter");
let SponsorshipTypeSelect = document.querySelector("#SponsorshipTypeFilter");
let NoResult = document.querySelector("#NoResult");
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
    formData.append("searchTerm", searchTearm || "");

    console.log("FormData Object:", Object.fromEntries(formData));
    if (navigator.onLine) {
        var lstOrphans;
        getOrphans(formData).done(function (listofOrphans) {
            lstOrphans = listofOrphans;
            OrphansContainer.innerHTML = "";
            if (lstOrphans.listOfData && lstOrphans.listOfData.length > 0) {
                NoResult.innerHTML = "";
                lstOrphans.listOfData.forEach((p) => RenderCards(p));
            } else {
                RenderNoResult()
            }
            //lstOrphans.listOfData.forEach((p) => RenderCards(p));
            RenderPagination(lstOrphans);
        });;

    } else {
        OrphansContainer.innerHTML = "";

        NoResult.innerHTML = ` 
            <div class="card shadow-sm border my-5" style="max-width: 500px">
        <div class="card-body">
          <div class="d-flex justify-content-center align-items-center flex-column">
            <i class="bx bx-error text-danger" style="font-size: 100px"></i>
            <h2 class="mb-4 text-danger">لا يوجد انترنت</h2>
            <p class="h4 text-center mb-4">تغقد اتصالك بالإنترنت ثم حاول مجددا</p>           
          </div>
        </div>
      </div>
         `

    }

}
getdata();



searchTearmInput.addEventListener("change", (e) => {
    CurPage = 1;
    searchTearm = searchTearmInput.value;
    getdata();
})

$(OrphanTypeSelect).on('change', function () {
    CurPage = 1;
    OrphanTypeSelectValue = OrphanTypeSelect.value;
    getdata();
});
$(AgeGroupSelect).on('change', function () {
    CurPage = 1;
    AgeGroupSelectValue = AgeGroupSelect.value;
    getdata();
});
$(SponsorshipTypeSelect).on('change', function () {
    CurPage = 1;
    SponsorshipTypeSelectValue = SponsorshipTypeSelect.value;
    getdata();
});
function getAll() {
    CurPage = 1;
    searchTearm = "";
    getdata();

}

window.addEventListener('online', () => {
    getAll()
})
function RenderNoResult() {
    NoResult.innerHTML = "";
    let card = document.createElement("div");
    card.className = "card shadow-sm my-5 border";
    card.style.maxWidth = 500;
    card.innerHTML = ` 
        <div class="card-body ">
          <div
            class="d-flex justify-content-center align-items-center flex-column"
          >
            <i
              class="bx bx-error-circle text-main"
              style="font-size: 100px"
            ></i>
            <h2 class="mb-4 text-main">لا يوجد نتائج</h2>
            <p class="h4 text-center mb-4">
              حاول ضبط مرشحات البحث لمزيد من النتائج.
            </p>
            <div><a class="btn btn-main text-white" onclick="getAll()">عرض الكل</a></div>
          </div>
      </div>
                              `;
    NoResult.appendChild(card);

}
window.addEventListener('offline', () => {
    OrphansContainer.innerHTML = "";
    NoResult.innerHTML = ` 
      <div class="card shadow-sm border my-5" style="max-width: 500px">
        <div class="card-body">
          <div class="d-flex justify-content-center align-items-center flex-column">
            <i class="bx bx-error text-danger" style="font-size: 100px"></i>
            <h2 class="mb-4 text-danger">لا يوجد انترنت</h2>
            <p class="h4 text-center mb-4">تغقد اتصالك بالإنترنت ثم حاول مجددا</p>
          </div>
        </div>
      </div>
         `

})
function RenderCards(Orphan) {
    //console.log(`${Orphan.code}`, Orphan)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD',
        minimumFractionDigits: 2
    })

    let card = document.createElement("div");
    card.className = "col p2";
    card.innerHTML = `<div class="card text-center  mt-5">
                <div class="position-relative"style="height: 250px;">
                    <img src="${Orphan.imagePath}" class="card-img-top" alt="صورة الطفل" style="height: 250px; object-fit: cover;">
                    <span class="position-absolute bg-dark text-white p-1 rounded" style="top:10px;right:10px">تكلفة الكفالة: ${formatter.format(Orphan.amount)} ريال</span>
                </div>
                <div class="card-body p-3">
                    <div class="progress   mb-3">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${Orphan.progressPercentage}%;" aria-valuenow="${Orphan.progressPercentage}" aria-valuemin="0" aria-valuemax="100">${Orphan.progressPercentage}%</div>
                    </div>
                    <h5 class="card-title">أهلًا، أنا ${Orphan.fullName} وعمري 10 سنوات</h5>
                    <div class="d-flex justify-content-between  p-2" style="background:#fff9eb">
                        <div class="text-center ">
                            <p class="mb-1 text-warning fw-bold">الفترة المكفولة</p>
                            <strong>${Orphan.numberOfSponsorShipMonths} أشهر</strong>
                        </div>
                        <div class="text-center">
                            <p class="mb-1 text-warning fw-bold">فترة الكفالة المتبقية</p>
                            <strong>${Orphan.numberOfRemainderSponsorShipMonths} أشهر</strong>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <button class="btn more">مزيد من التفاصيل</button>
                        <button class="btn btn-success">تبرع الآن</button>
                    </div>
                </div>
            </div>`;
    OrphansContainer.appendChild(card);
}

function RenderSkeletonCards(count = 6) {
    OrphansContainer.innerHTML = ""; // Clear previous content
    for (let i = 0; i < count; i++) {
        let card = document.createElement("div");
        card.className = "col p-2";
        card.innerHTML = `
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
                <div class="d-flex justify-content-between p-2">
                    <div class="text-center">
                        <p class="mb-1 text-warning fw-bold placeholder col-6"></p>
                        <strong class="placeholder col-4"></strong>
                    </div>
                    <div class="text-center">
                        <p class="mb-1 text-warning fw-bold placeholder col-6"></p>
                        <strong class="placeholder col-4"></strong>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <button class="btn placeholder col-4"></button>
                    <button class="btn btn-success placeholder col-4"></button>
                </div>
            </div>
        </div>`;
        OrphansContainer.appendChild(card);
    }
}

function NextPage(JsonData) {
    //alert(CurPage);
    //alert(JsonData);
    //alert(CurPage > JsonData.totalPages);
    if (CurPage < JsonData.totalPages) {
        CurPage++;
        getdata();
        //    alert(CurPage);
    }
}

function PrevPage() {
    if (CurPage > 1) {
        CurPage--;
        getdata();
        //alert(CurPage);

    }
}

function GetPage(index) {
    CurPage = parseInt(index);
    //alert(CurPage);

    getdata();
}
