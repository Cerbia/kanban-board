var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
  'X-Client-Id': 3243, 
  'X-Auth-Token': '08d43a9fcf4a5a4a94680312d70c5419'
  //'Content-Type': 'application/json; charset=utf-8'
};

fetch(baseUrl + '/board', {
    method: 'GET',
    headers: myHeaders })
.then(function(resp) {
    return resp.json();
})
.then(function(resp) {
    console.log(resp);
    setupColumns(resp.columns);
});

function setupColumns(columns) {
    columns.forEach(function (column) {
        var col = new Column(column.id, column.name);
        board.addColumn(col);
        setupCards(col, column.cards);
    });
}

function setupCards(col, cards) {
    cards.forEach(function (card) {
        //console.log(card);
        var cardObj = new Card(card.id, card.name);
        col.addCard(cardObj);
    });
}

function generateTemplate(name, data, basicElement) {
    var template = document.getElementById(name).innerHTML;
    var element = document.createElement(basicElement || 'div');

    Mustache.parse(template);
    element.innerHTML = Mustache.render(template, data);

    return element;
}



