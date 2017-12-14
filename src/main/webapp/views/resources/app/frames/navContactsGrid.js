
var NavContactsGrid =  {

     create: function () {
        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            alternateRecordStyles: true,
            alternateFieldStyles: true,
            showHeader: false,
            autoDraw: false,
            sortField: 1,
            fields: [
                {name: "id"},
                {name: "title", title:"Контакты"}
            ]});
        this.init();
        return Object.create(this);
    },

    init: function () {
       var listGrid = this.listGrid;
        getNavContactsGridData(function (contacts) {
            this.dataSource = DataSource.create({
                fields: [
                    {name: "id", primaryKey: true},
                    {name: "title", title:"Контакты"}
                ],
                clientOnly: true
            });

            for (var i = 0; i < contacts.length; i++) {
                var row =
                    "<table class='listItem'><tr>"+
                        "<td><img src='"+imgDir+"/ic_contact.png'></td>"+
                        "<td width='100%'>"+contacts[i].title+"" +
                        "<br><small style='color: #0D47A1'>"+contacts[i].customerTitle+"<small/></td>"+
                    "</tr></table>";
                this.dataSource.addData({id:contacts[i].id, title: row});

            }
            listGrid.setDataSource(this.dataSource);
            listGrid.hideFields(["id"]);
            listGrid.clearCriteria();
        });
    },

    setFilter: function (filter) {
        this.listGrid.filterData(filter);
    },

    clearFilter: function () {
        this.listGrid.filterData(null);
    }
};

function getNavContactsGridData(callback) {
    getAllContactsNodes(function (contacts) {
        callback(contacts);
    });
}













