function RenderPagination(JsonData) {
    Paging.firstElementChild.innerHTML = "";

    const pervHidden = JsonData.previousPage === null ? "d-none" : "";
    const nextHidden = JsonData.nextPage === null ? "d-none" : "";
    const firstHidden = (CurPage !== 1 && JsonData.totalPages !== 0) ? "" : "d-none";
    const lastHidden = (CurPage !== JsonData.totalPages && JsonData.totalPages !== 0) ? "" : "d-none";
    const firstIndex = Math.max(CurPage - 2, 1);
    const lastIndex = Math.min(CurPage + 2, JsonData.totalPages);

    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Page navigation");

    const ul = document.createElement("ul");
    ul.className = "pagination m-0";
    nav.appendChild(ul);

    const createPageItem = (icon, classes, eventHandler) => {
        const li = document.createElement("li");
        li.className = "page-item";

        const a = document.createElement("a");
        a.className = `page-link ${classes}`;
        a.innerHTML = `<i class='bx ${icon}'></i>`;
        a.addEventListener("click", eventHandler);

        li.appendChild(a);
        return li;
    };

    const fragment = document.createDocumentFragment();

    fragment.appendChild(createPageItem("bi bi-chevron-double-right fw-bold", firstHidden, () => { CurPage = 1; getdata(null); }));
    fragment.appendChild(createPageItem("bi bi-chevron-right fw-bold", pervHidden, () => PrevPage(JsonData)));

    for (let i = firstIndex; i <= lastIndex; i++) {
        const li = document.createElement("li");
        li.className = "page-item";

        const a = document.createElement("a");
        a.className = `page-link ${i === CurPage ? "active" : ""}`;
        a.innerHTML = i;

        if (i !== CurPage) {
            a.setAttribute("data-page", i);
            a.addEventListener("click", () => GetPage(i));
        }

        li.appendChild(a);
        fragment.appendChild(li);
    }

    fragment.appendChild(createPageItem("bi bi-chevron-left fw-bold", nextHidden, () => NextPage(JsonData)));
    fragment.appendChild(createPageItem("bi bi-chevron-double-left fw-bold", lastHidden, () => { CurPage = JsonData.totalPages; getdata(null); }));

    ul.appendChild(fragment);
    Paging.firstElementChild.appendChild(nav);
}
