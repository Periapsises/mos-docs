const defaultCategory = 'instructions';
const defaultSection = 'summary';

async function setContent(url) {
    let response = await fetch(url);

    if (response.status != 200)
        return '<h1>' + response.status + ' - Something went wrong!</h1>';
    
    let data = await response.text();
    return data;
}

function onListItemClicked(category, section) {
    let location = window.location;
    let url = location.protocol + '//' + location.host + location.pathname + '?category=' + category + '&section=' + section;
    window.history.pushState({ path: url }, '', url);
}

async function onContentLoaded() {
    let lists = document.getElementsByTagName('ul');

    for (let list of lists) {
        let category = list.getAttribute('category');
        let index = 0;

        for (let item of list.children) {
            let section = item.innerText.toLowerCase().replace(' ', '-');
            item.onclick = () => onListItemClicked(category, section);

            item.className = (index % 2 == 0) ? 'list even' : 'list odd';
            index++;
        }
    }

    const query = window.location.search;
    const params = new URLSearchParams(query);

    let category = params.get('category') || defaultCategory;
    let section = params.get('section') || defaultSection;

    let html = await setContent('./' + category + '/' + section + '.html');
    document.getElementById('content').innerHTML = html;
}

window.addEventListener('DOMContentLoaded', onContentLoaded);