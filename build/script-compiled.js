'use strict';

var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
    'X-Client-Id': 3243,
    'X-Auth-Token': '08d43a9fcf4a5a4a94680312d70c5419'
    //'Content-Type': 'application/json; charset=utf-8'
};

fetch(baseUrl + '/board', {
    method: 'GET',
    headers: myHeaders }).then(function (resp) {
    return resp.json();
}).then(function (resp) {
    //console.log(resp);
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
'use strict';

var board = {
    name: 'Kanban Board',
    addColumn: function addColumn(column) {
        this.element.appendChild(column.element);
        initSortable(column.id); //About this feature we will tell later
    },
    element: document.querySelector('#board .scrolling-wrapper-flexbox') //replace .column-container
};
function initSortable(id) {
    var el = document.getElementById(id);
    var sortable = Sortable.create(el, {
        group: 'kanban',
        sort: true
    });
}

document.querySelector('#board .create-column').addEventListener('click', function () {
    var name = prompt('Enter a column name');
    var data = new FormData();

    data.append('name', name);

    fetch(baseUrl + '/column', {
        method: 'POST',
        headers: myHeaders,
        body: data
    }).then(function (resp) {
        return resp.json();
    }).then(function (resp) {
        var column = new Column(resp.id, name);
        board.addColumn(column);
    });
});
'use strict';

function Card(id, name) {
    var self = this;

    this.id = id;
    this.name = name || 'No name given';

    this.element = generateTemplate('card-template', { description: this.name }, 'li');

    this.element.querySelector('.card').addEventListener('click', function (event) {
        event.stopPropagation();

        if (event.target.classList.contains('btn-delete')) {
            self.removeCard();
        }
        if (event.target.classList.contains('btn-edit')) {
            event.preventDefault();
            //debugger;
            self.editCard();
        }
    });
}

Card.prototype = {
    removeCard: function removeCard() {
        var self = this;

        fetch(baseUrl + '/card/' + self.id, {
            method: 'DELETE',
            headers: myHeaders
        }).then(function (resp) {
            return resp.json();
        }).then(function (resp) {
            self.element.parentNode.removeChild(self.element);
        });
    },
    editCard: function editCard() {
        var self = this;

        var name = prompt('Enter a new card name') || 'default';
        var data = new FormData();

        data.append('name', name);
        data.append('bootcamp_kanban_column_id', self.element.parentElement.id);

        fetch(baseUrl + '/card/' + self.id, {
            method: 'PUT',
            headers: myHeaders,
            body: data
        }).then(function (resp) {
            return resp.json();
        }).then(function (resp) {
            self.name = name;
        });
    }
};
'use strict';

function Column(id, name) {
    var self = this;

    this.id = id;
    this.name = name || 'No name given';

    this.element = generateTemplate('column-template', { name: self.name, id: self.id });

    this.element.querySelector('.column').addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-delete')) {
            self.removeColumn();
        }

        if (event.target.classList.contains('add-card')) {
            var cardName = prompt("Enter the name of the card");
            event.preventDefault();

            var data = new FormData();
            data.append('name', cardName);
            data.append('bootcamp_kanban_column_id', self.id);

            fetch(baseUrl + '/card', {
                method: 'POST',
                headers: myHeaders,
                body: data
            }).then(function (res) {
                return res.json();
            }).then(function (resp) {
                var card = new Card(resp.id, cardName);
                self.addCard(card);
            });
        }
        if (event.target.classList.contains('edit-column')) {
            event.preventDefault();
            //self.editColumnName();
            var newColumnName = prompt("Enter the new column name");

            var _data = new FormData();
            //debugger;
            _data.append('name', newColumnName.toString());

            //console.log(baseUrl + '/column/' + self.id);

            fetch(baseUrl + '/column/' + self.id, {
                method: 'PUT',
                headers: myHeaders,
                body: _data
            }).then(function (resp) {
                return resp.json();
            }).then(function (resp) {
                self.name = newColumnName;
            });
        }
    });
}

Column.prototype = {
    addCard: function addCard(card) {
        this.element.querySelector('ul').appendChild(card.element);
    },
    removeColumn: function removeColumn() {
        var self = this;

        fetch(baseUrl + '/column/' + self.id, {
            method: 'DELETE',
            headers: myHeaders
        }).then(function (resp) {
            return resp.json();
        }).then(function (resp) {
            self.element.parentNode.removeChild(self.element);
        });
    },
    editColumnName: function editColumnName() {
        var self = this;

        var newColumnName = prompt("Enter the new column name");

        var data = new FormData();
        debugger;
        data.append('bootcamp_kanban_column_id', self.id);
        data.append('name', newColumnName);

        fetch(baseUrl + '/column/' + self.id, {
            method: 'PUT',
            headers: myHeaders,
            body: data
        }).then(function (resp) {
            return resp.json();
        }).then(function (resp) {
            self.name = newColumnName;
        });
    }
};
