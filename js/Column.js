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

            let data = new FormData();
            data.append('name', cardName);
            data.append('bootcamp_kanban_column_id', self.id);

            fetch(baseUrl + '/card', {
                method: 'POST',
                headers: myHeaders,
                body: data
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(resp) {
                var card = new Card(resp.id, cardName);
                self.addCard(card);
            });
        }
        if(event.target.classList.contains('edit-column')) {
            event.preventDefault();
            //self.editColumnName();
            var newColumnName = prompt("Enter the new column name");

            let data = new FormData();
            //debugger;
            data.append('name', newColumnName.toString());

            
            //console.log(baseUrl + '/column/' + self.id);

            fetch((baseUrl + '/column/' + self.id), { 
                    method: 'PUT', 
                    headers: myHeaders,
                    body: data
                })
                .then(function(resp) {
                    return resp.json();
                })
                .then(function(resp) {
                    self.name = newColumnName;
                });
        }
    });
}

Column.prototype = {
    addCard: function(card) {
        this.element.querySelector('ul').appendChild(card.element);
    },
    removeColumn: function() {
        var self = this;

        fetch(baseUrl + '/column/' + self.id, { 
                method: 'DELETE', 
                headers: myHeaders 
            })
            .then(function(resp) {
                return resp.json();
            })
            .then(function(resp) {
                self.element.parentNode.removeChild(self.element);
            });
    },
    editColumnName: function() {
        var self = this;

        var newColumnName = prompt("Enter the new column name");

        let data = new FormData();
        debugger;
        data.append('bootcamp_kanban_column_id', self.id);
        data.append('name', newColumnName);
        

        fetch(baseUrl + '/column/' + self.id, { 
                method: 'PUT', 
                headers: myHeaders,
                body: data
            })
            .then(function(resp) {
                return resp.json();
            })
            .then(function(resp) {
                self.name = newColumnName;
            });
    }
};
