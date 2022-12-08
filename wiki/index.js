function onContentLoaded() {
    let lists = document.getElementsByTagName('ul');

    for (let list of lists) {
        let index = 0;
        for (let item of list.children) {
            if (index % 2 == 0)
                item.setAttribute('style', 'color: rgb(154, 158, 167);');
            index++;
        }
    }
}

window.addEventListener('DOMContentLoaded', onContentLoaded)