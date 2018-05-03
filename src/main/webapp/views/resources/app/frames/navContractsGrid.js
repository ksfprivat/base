NavContractsGrid = {
    create: function () {

        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            cellHeight: 44,
            alternateRecordStyles: true,
            alternateFieldStyles: true,
            showHeader: false,
            autoDraw: false,
            sortField: "date",
            sortDirection: "descending",
            virtualScrolling: false,
            autoFetchData:true,
            dataPageSize: 10000,
            fields: [
                {name: "id", hidden: true },
                {name: "title"},
                {name: "date", hidden: true},
                {name: "year"},
                {name: "amount", hidden: true},
                {name: "dateFormat",hidden: true},
                {name: "customerTitle", hidden:true}
            ],
            rowClick: this.onRowClick
        });

        this.init();

        return Object.create(this);
    },

    init: function () {

        getAllContracts(function (contracts, success) {
            var dataSource = DataSource.create({
                fields: [
                    {name: "id", primaryKey: true, hidden: true},
                    {name: "title"},
                    {name: "date", hidden:true},
                    {name: "year", hidden:true} ,
                    {name: "amount", hidden:true},
                    {name: "customerTitle", hidden:true}
                ],
                clientOnly: true
            });
            // dataSource.setCacheData(contracts);

            for (var i = 0; i < contracts.length; i++) {
                var title = NavContractsGrid.createItemBlock(contracts[i]);
                dataSource.addData({id: contracts[i].id, title: title,
                    date: contracts[i].date, year: contracts[i].year, amount: contracts[i].amount,
                    customerTitle:contracts[i].customerTitle});
            }
            NavContractsGrid.listGrid.setDataSource(dataSource);
        });
    },

    onRowClick: function (record, recordNum, fieldNum) {
        // console.log(record);

    },

    createItemBlock: function(contract) {
        return (
            "<table class='listItem'><tr>"+
                 "<td><img src='"+imgDir+"/ic_currency.png'></td>"+
                 "<td >"+contract.title+"</td>" +
                 "<td align='right' style='color: #009688' >"+formatStringDoubleToCurrency(contract.amount)+"&nbsp;₽</td>" +
            "</tr></table>" +
            "<table width='100%'><tr>" +
                 "<td align='left'><small style='color: #0D47A1'>"+contract.customerTitle+"<small/></td>" +
                 "<td align='right'><small style='color: #2962FF'>"+formatDateString(contract.date)+"<small/></td>"+
            "</tr></table>"
        );
    },

    setFilter: function (filter) {
        this.listGrid.filterData([filter]);
    },

    clearFilter: function () {
        this.listGrid.filterData(null);
    }


};