NavContractsGrid = {
    create: function () {

        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            cellHeight: 44,
            alternateRecordStyles: false,
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
                {name: "amount", hidden: true}
            ],
            // data:[
            //     {id:"1", title:"1", date:"2017.12.31", year:"2017", amount:"1"},
            //     {id:"2", title:"1", date:"2017.12.31", year:"2016", amount:"1"},
            //     {id:"3", title:"1", date:"2017.12.31", year:"2016", amount:"1"},
            //     {id:"4", title:"1", date:"2017.12.31", year:"2015", amount:"1"},
            //     {id:"5", title:"1", date:"2017.12.31", year:"2015", amount:"1"},
            //     {id:"6", title:"1", date:"2017.12.31", year:"2014", amount:"1"}
            // ],
            groupStartOpen:"all",
            groupByField: "year",
            rowClick: this.onRowClick
        });

        this.init();

        return Object.create(this);
    },

    init: function () {

        getAllContracts(function (contracts) {
            var dataSource = DataSource.create({
                fields: [
                    {name: "id", primaryKey: true, hidden: true},
                    {name: "title"},
                    {name: "date", hidden:true},
                    {name: "year", hidden:false} ,
                    {name: "amount", hidden:true}
                ],
                clientOnly: true
            });
            dataSource.setCacheData(contracts);
            NavContractsGrid.listGrid.setDataSource(dataSource);
            NavContractsGrid.listGrid.regroup();
            NavContractsGrid.listGrid.setGroupState("year");
            NavContractsGrid.listGrid.groupBy(["year"]);
        });
    },

    onRowClick: function (record, recordNum, fieldNum) {
        console.log(record);

    },


    createItemBlock: function(contract, customerTitle) {
        return (
            "<table class='listItem'><tr>"+
            "<td colspan='2'><img src='"+imgDir+"/ic_contract.png'></td>"+
            "<td width='100%'>"+contract.title+"" +
            "<br><small style='color: #0D47A1'>"+customerTitle+"<small/></td>"+
            "</tr></table>"
        );
    }


};