let ts = ''
let apikey = ''
let hash = ''

window.onload = initialize()
let lastIndex = 0

var list = []

function initialize() {
    ts = '2252'
    apikey = '8716d55e5f2a7e55fa1cbac2844da65b'
    hash = '1323104678c6c56c59d001e561561c74'

    starter()
}

async function starter() {
    setFirstButton()

    let counter = 0
    let counterAux = 0
    let i = 0

    while (i < 3) {
        const results = await executeQuery(i)
        while (counter < 10) {
            if (results[counterAux].description != '') {
                list.push({
                    name: results[counterAux].name,
                    id: results[counterAux].id,
                    description: results[counterAux].description,
                    image: results[counterAux].thumbnail.path,
                    media: results[counterAux].comics.items
                })
                counter++
            }
            counterAux++
        }
        i++
        counter = 0
        counterAux = 0
    }
}

async function executeQuery(offset) {
    const response = await fetch('https://gateway.marvel.com:443/v1/public/' +
        'characters?ts=' + ts + '&apikey=' + apikey + '&hash=' + hash
        + '&orderBy=modified&limit=100&offset=' + (100 * offset));
    const jsonBody = await response.json()
    results = jsonBody.data.results
    return results
}

async function executeQuerySearch(offset, name) {
    const response = await fetch('https://gateway.marvel.com:443/v1/public/' +
        'characters?ts=2252&apikey=' + apikey + '&hash=' + hash
        + '&orderBy=modified&limit=100&offset=' + (100 * offset)
        + '&nameStartsWith=' + name);
    const jsonBody = await response.json()
    results = jsonBody.data.results
    return results
}

async function getListOfMedias(id) {
    const response = await fetch('https://gateway.marvel.com:443/v1/public/characters/'
        + id + '/comics?ts=2252&apikey=8716d55e5f2a7e55fa1cbac2844da65b'
        + '&hash=1323104678c6c56c59d001e561561c74&limit=5');
    const jsonBody = await response.json()
    results = jsonBody.data.results
    return results
}

async function createPage(results, end) {
    let counter = 0
    let counterAux = 0

    var body = document.getElementById('table-body');
    body.innerHTML = ''

    while (counter < end) {
        if (results[counterAux].description != '') {
            addItems(results[counterAux].thumbnail.path,
                results[counterAux].thumbnail.extension,
                results[counterAux].name,
                results[counterAux].description)
            counter++
        }
        counterAux++

        if (counterAux == 99)
            break
    }

    return true
}

function addItems(image, extension, name, description) {
    const row = '<tr class="custom-row" onclick="openModal(this)"> '
        + ' <td class="custom-row-centering">'
        + ' <img style="vertical-align:middle; border-radius: 50%;" src="' + image + '.' + extension + '" width="58" height="58">'
        + ' <span class="custom-hero-name">' + name + '</span> </td> '
        + '<td class="custom-row-centering">' + description + '</td>'
        + '</tr>'
    var body = document.getElementById('table-body');
    body.insertAdjacentHTML('beforeend', row);
}

function unsetFirstButton() {
    document.getElementById("first-button").className = "custom-button";
    document.getElementById("first-span").className = "custom-button-font";
}

async function setFirstButton() {
    document.getElementById("first-button").className = "custom-button-clicked";
    document.getElementById("first-span").className = "custom-button-font-clicked";

    document.getElementById("search-input").value = ''
    const result = await executeQuery(0)
    const val = await createPage(result, 10)
}

function unsetSecondButton() {
    document.getElementById("second-button").className = "custom-button";
    document.getElementById("second-span").className = "custom-button-font";
}

async function setSecondButton() {
    document.getElementById("second-button").className = "custom-button-clicked";
    document.getElementById("second-span").className = "custom-button-font-clicked";

    document.getElementById("search-input").value = ''
    const result = await executeQuery(1)
    const val = await createPage(result, 10)
}

function unsetThirdButton() {
    document.getElementById("third-button").className = "custom-button";
    document.getElementById("third-span").className = "custom-button-font";
}

async function setThirdButton() {
    document.getElementById("third-button").className = "custom-button-clicked";
    document.getElementById("third-span").className = "custom-button-font-clicked";

    document.getElementById("search-input").value = ''
    const result = await executeQuery(2)
    const val = await createPage(result, 10)
}

document.getElementById("first-button").addEventListener("click", function () {
    setFirstButton();
    unsetSecondButton();
    unsetThirdButton();
});

document.getElementById("second-button").addEventListener("click", function () {
    unsetFirstButton();
    setSecondButton();
    unsetThirdButton();
});

document.getElementById("third-button").addEventListener("click", function () {
    unsetFirstButton();
    unsetSecondButton();
    setThirdButton();
});

document.getElementById("arrow-left").addEventListener("click", function () {

    if (document.getElementById("second-button").className == 'custom-button-clicked') {
        setFirstButton();
        unsetSecondButton();
        unsetThirdButton();
    } else if (document.getElementById("third-button").className == 'custom-button-clicked') {
        unsetFirstButton();
        setSecondButton();
        unsetThirdButton();
    }
});

document.getElementById("arrow-right").addEventListener("click", function () {
    if (document.getElementById("first-button").className == 'custom-button-clicked') {
        unsetFirstButton();
        setSecondButton();
        unsetThirdButton();
    } else if (document.getElementById("second-button").className == 'custom-button-clicked') {
        unsetFirstButton();
        unsetSecondButton();
        setThirdButton();
    }
});

async function filterByName() {
    const name = document.getElementById("search-input").value
    let i = 0
    if (name != '') {
        document.getElementById("buttons").display = 'none'
        while (i < 3) {
            const results = await executeQuerySearch(i, name)
            if (results && results[0] && results[0].description != '') {
                const val = await createPage(results, 1)
                break;
            }
        }
    } else {
        setFirstButton()
    }
}

async function openModal(object) {
    document.getElementById("custom-pop").style.display = 'block'

    var body = document.getElementById('comics');
    body.innerHTML = ''
    let charId = -1
    let counter = 0
    let comic = ''
    while (charId == -1) {
        charId = getCharacterId(object.childNodes[1].children[1].innerText)
        counter++

        if (counter == 10000) {
            comic = '<div class="custom-comic-issue-error">'
                + '<span class="custom-subtitle">'
                + 'Oops, parece que não exitem '
                + 'registros para este personagem!'
                + '</span>' + '</div > '
            break
        }
    }

    const result = await getListOfMedias(charId)

    for (let key in result) {
        comic += '<div class="custom-comic-issue">'
            + ' <img width = "128px" height = "128px" style = "text-align: center;"'
            + 'src = "' + result[key].thumbnail.path + '.' + result[key].thumbnail.extension + '">'
            + '<span class="custom-subtitle-name"> ' + result[key].title + '</span>'
            + '</div > '
    }

    body.insertAdjacentHTML('beforeend', comic);
}

function getCharacterId(name) {
    for (let key in list)
        if (list[key].name == name)
            return list[key].id

    return -1
}

var span = document.getElementsByClassName("custom-close")[0];

span.onclick = function () {
    document.getElementById("custom-pop").style.display = "none";
}