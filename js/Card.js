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
    removeCard: function() {
        var self = this;

        fetch(baseUrl + '/card/' + self.id, { 
            method: 'DELETE', 
            headers: myHeaders 
        })
        .then(function(resp) {
            return resp.json();
        })
        .then(function(resp) {
            self.element.parentNode.removeChild(self.element);
        })
    },
    editCard: function() {
        var self = this;

        var name = prompt('Enter a new card name') || 'default';
        var data = new FormData();

        data.append('name', name);
        data.append('bootcamp_kanban_column_id', self.element.parentElement.id);

        fetch(baseUrl + '/card/' + self.id, { 
            method: 'PUT', 
            headers: myHeaders,
            body: data
        })
        .then(function(resp) {
            return resp.json();
        })
        .then(function(resp) {
            self.name = name;
        })


    }
}