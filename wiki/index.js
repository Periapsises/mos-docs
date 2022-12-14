const defaultCategory = 'instructions';
const defaultSection = 'summary';

async function getContent(url) {
    let response = await fetch(url);

    if (response.status != 200)
        return '<h1>' + response.status + ' - Something went wrong!</h1>';
    
    let data = await response.text();
    return data;
}

async function setContent(category, section) {
    let html = await getContent('./' + category + '/' + section + '.html');
    document.getElementById('content').innerHTML = html;
}

function onListItemClicked(category, section) {
    let location = window.location;
    let url = location.protocol + '//' + location.host + location.pathname + '?category=' + category + '&section=' + section;
    window.history.pushState({ path: url }, '', url);

    setContent(category, section);
}

function onContentLoaded() {
    let lists = document.getElementsByTagName('ul');

    for (let list of lists) {
        let category = list.getAttribute('category');

        for (let item of list.children) {
            let section = item.innerText.toLowerCase().replace(' ', '-');
            item.onclick = () => onListItemClicked(category, section);
        }
    }

    const query = window.location.search;
    const params = new URLSearchParams(query);

    let category = params.get('category') || defaultCategory;
    let section = params.get('section') || defaultSection;

    setContent(category, section);
}

window.addEventListener('DOMContentLoaded', onContentLoaded);