/*
* Página de busca de super heróis da marvel - Teste de front end
*
* Minhas considerações:   
* Tomei a liberdade de mudar a língua das labels listadas na documentação
* para deixar a visualização da página mais coerente com o que a API utilizada
* retorna pra mim.
*
* A rota citada na especificação não foi utilizada devido a escacez de dados
* de personagens da Marvel a partir dos filtros pelos quais minerei. Portanto,
* decidi utilizar a API da Marvel para pegar os personagens e as edições dos
* quadrinhos no qual eles apareceram.
*
* Luan Bodner do Rosário 03/02/2020
*/
let ts = ''
let apikey = ''
let secret = ''
let hash = ''

window.onload = initialize()
let lastIndex = 0

var list = []

/*
* Inicia a chain de funções que vão buscar e organizar os dados
*/
function initialize() {
    // API Keys disponibilizadas em https://developer.marvel.com/
    ts = '3000'
    apikey = 'eef6dd27c84eccc603feed5d673a2111'
    secret = 'a7a188dbc0daed1fe169fa685e28be2ec18ac266'
    hash = 'cfd07329555ccbcc8399c02541cfc33b'

    starter()
}

/*
* Função responsável por inicializar a primeira pagina da aplicação
* e guardar algumas informações dentro da aplicação para que a 
* quantidade de requests da API possa ser diminuida
*/
async function starter() {
    // Vou para a primeira página
    setFirstButton()

    let counter = 0
    let counterAux = 0
    let i = 0

    /* 
    * Realizo a busca das três páginas para guardar informações do id do
    * personagem para realizar a busca dos detalhes, junto com algumas outras
    * informações para fácil acesso
    */
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

/*
* Chama a API e transforma em json com base no OFFSET (pagina 0,1 e 2)
*/
async function executeQuery(offset) {


    const response = await fetch('https://gateway.marvel.com:443/v1/public/' +
        'characters?ts=' + ts + '&apikey=' + apikey + '&hash=' + hash
        + '&orderBy=modified&limit=100&offset=' + (100 * offset));
    const jsonBody = await response.json()
    results = jsonBody.data.results
    return results
}

/*
 * Chama a rota que filtra os personagens com base no nome
 */
async function executeQuerySearch(offset, name) {
    const response = await fetch('https://gateway.marvel.com:443/v1/public/' +
        'characters?ts=2252&apikey=' + apikey + '&hash=' + hash
        + '&orderBy=modified&limit=100&offset=' + (100 * offset)
        + '&nameStartsWith=' + name);
    const jsonBody = await response.json()
    results = jsonBody.data.results
    return results
}

/*
* Chama a rota que retorna as 5 primeiras mídias com base no id do personagem
*/
async function getListOfMedias(id) {
    const response = await fetch('https://gateway.marvel.com:443/v1/public/characters/'
        + id + '/comics?ts=' + ts + '&apikey=' + apikey
        + '&hash=' + hash + '&limit=5');
    const jsonBody = await response.json()
    results = jsonBody.data.results
    return results
}

/*
* Adiciona os 10 personagens na tabela da página
*/
async function createPage(results, end) {
    let counter = 0
    let counterAux = 0

    // Pega o elemento da tabela e o limpa
    var body = document.getElementById('table-body');
    body.innerHTML = ''

    while (counter < end) {
        if (results[counterAux].description != '') {
            // 'Append' os itens dentro da tabela
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

/*
* Adiciono os itens com as classes corretas em uma string e insiro-a no html da pagina
*/
function addItems(image, extension, name, description) {
    const row = '<tr class="custom-row" onclick="openModal(this)"> '
        + ' <td class="custom-row-centering">'
        + ' <img style="vertical-align:middle; border-radius: 50%;" src="' + image
        + '.' + extension + '" width="58" height="58">'
        + ' <span class="custom-hero-name">' + name + '</span> </td> '
        + '<td class="custom-row-centering">' + description + '</td>'
        + '</tr>'
    var body = document.getElementById('table-body');
    body.insertAdjacentHTML('beforeend', row);
}

/* 
* Desmarca o primeiro botão
*/
function unsetFirstButton() {
    document.getElementById("first-button").className = "custom-button";
    document.getElementById("first-span").className = "custom-button-font";
}

/* 
* Marca o primeiro botão como selecionado e busca os primeiros 10 elementos
* disponíveis
*/
async function setFirstButton() {
    document.getElementById("first-button").className = "custom-button-clicked";
    document.getElementById("first-span").className = "custom-button-font-clicked";

    document.getElementById("search-input").value = ''
    const result = await executeQuery(0)
    const val = await createPage(result, 10)
}

/* 
* Desmarca o segundo botão
*/
function unsetSecondButton() {
    document.getElementById("second-button").className = "custom-button";
    document.getElementById("second-span").className = "custom-button-font";
}

/* 
* Marca o segundo botão como selecionado e busca os próximos 10 elementos 
* a partir do offset
*/
async function setSecondButton() {
    document.getElementById("second-button").className = "custom-button-clicked";
    document.getElementById("second-span").className = "custom-button-font-clicked";

    document.getElementById("search-input").value = ''
    const result = await executeQuery(1)
    const val = await createPage(result, 10)
}

/* 
* Desmarca o terceiro botão
*/
function unsetThirdButton() {
    document.getElementById("third-button").className = "custom-button";
    document.getElementById("third-span").className = "custom-button-font";
}

/* 
* Marca o terceiro botão como selecionado e busca os próximos 10 elementos 
* a partir do offset
*/
async function setThirdButton() {
    document.getElementById("third-button").className = "custom-button-clicked";
    document.getElementById("third-span").className = "custom-button-font-clicked";

    document.getElementById("search-input").value = ''
    const result = await executeQuery(2)
    const val = await createPage(result, 10)
}


/* 
* Adiciono as funções de paginação que fazem as buscas na api como evento
* de cada um dos três botões, que aguardam o evento click
*/
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

/*
* As setas funcionam igualmente aos botões mas incrementando ou decrementando o indice
*/
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

/*
* Wrapper da função que faz o chamado à api com base no nome que é digitado
* no campo de busca, sendo que cada mudança equivale a 3 buscas distintas
*/
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

/*
* Função que preenche o modal de mídias de um personagem
*/
async function openModal(object) {
    document.getElementById("custom-pop").style.display = 'block'

    var body = document.getElementById('comics');
    body.innerHTML = ''
    let charId = -1
    let counter = 0
    let comic = ''
    while (charId == -1) {
        // Pego o id do personagem com base no nome listado em tr => DOM
        charId = getCharacterId(object.childNodes[1].children[1].innerText)
        counter++

        // Se demorar demais, encerro o request
        if (counter == 10000) {
            comic = '<div class="custom-comic-issue-error">'
                + '<span class="custom-subtitle">'
                + 'Oops, seems like there are no '
                + 'additional information available for this character!'
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

/*
* Pego o ID do personagem com base na lista preenchida na primeira função
*/
function getCharacterId(name) {
    for (let key in list)
        if (list[key].name == name)
            return list[key].id

    return -1
}

var span = document.getElementsByClassName("custom-close")[0];

// Configuro o botão de fechar do modal
span.onclick = function () {
    document.getElementById("custom-pop").style.display = "none";
}