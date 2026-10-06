export function renderWithTemplate(template, parentElement, data, callback) {
    parentElement.innerHTML = template;

    if (callback) {
        callback(data);
    }
}

export async function loadTemplate(path) {
    const res = await fetch(path);

    const template = await res.text();

    return template;
}

export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);

    function setActiveNavLink() {
        const current = window.location.pathname === "/" ? "/index.html" : window.location.pathname;

        document.querySelectorAll(".nav-links a").forEach((link) => {
            if (link.pathname === current) {
                link.classList.add("active");
            }
        });
    }
    setActiveNavLink();

    const navbutton = document.querySelector(".ham-btn");
    const navBar = document.querySelector(".nav-links");

    navbutton.addEventListener("click", () => {
        navbutton.classList.toggle("show");
        navBar.classList.toggle("show");
    });
}

export function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

