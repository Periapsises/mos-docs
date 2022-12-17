/**
 * @param {String} category
 * @param {String} subject
 */
let onQueryChange = function (category, subject) {
    let path = `./${category.toLowerCase()}/${subject.toLowerCase().replace('.', '/')}.html`;

    fetch(path).then((response) => {
        if (response.status !== 200) {
            return new Promise((resolve) => {
                resolve('<h1>404 - Not found</h1>\n<p>Something went wrong</p>');
            });
        }

        return response.text()
    }).then((text) => {
        let content = document.querySelector('#content');
        content.innerHTML = text;
    });
}

/**
 * @param {HTMLElement} element
 * @param {String} category
 */
function generateButtonLinks(element, category) {
    let items = element.querySelectorAll('.item');
    
    for (let item of items) {
        let name = item.textContent;

        if (item.tagName === 'LI') {
            let top = item.parentElement.parentElement;
            if (top.tagName === 'DETAILS') {
                name = top.querySelector('summary').textContent + '.' + name;
            }
        }

        item.addEventListener('click', () => {
            let newUrl = `${location.protocol}//${location.host}${location.pathname}?category=${category}&subject=${name}`;
            history.pushState({ path: newUrl }, '', newUrl);

            onQueryChange(category, name);
        });
    }
}

function generateCategoryLinks() {
    let categories = document.querySelectorAll('.category');
    
    for (let category of categories) {
        let name = category.getAttribute('category');
        if (name === null) continue;

        generateButtonLinks(category, name)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    generateCategoryLinks();

    let params = new URLSearchParams(window.location.search);
    let category = params.get('category');
    let subject = params.get('subject');
    if (!category || !subject) return;

    onQueryChange(category, subject);
});