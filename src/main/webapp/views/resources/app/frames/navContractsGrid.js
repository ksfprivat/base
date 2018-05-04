NavContractsGrid = {
    create: function () {
        this.currentRecord ={};
        this.dataSource = DataSource.create({
            fields: [
                {name: "id", primaryKey: true, hidden: true},
                {name: "title"},
                {name: "date", hidden:true},
                {name: "year", hidden:true} ,
                {name: "amount", hidden:true},
                {name: "status", hidden: true},
                {name: "dateFinal", hidden:true},
                {name: "customerTitle", hidden:true}
            ],
            clientOnly: true
        });

        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            cellHeight: 76,
            // alternateRecordStyles: true,
            // alternateFieldStyles: true,
            showHeader: false,
            autoDraw: false,
            sortField: "date",
            sortDirection: "descending",
            virtualScrolling: false,
            autoFetchData:true,
            dataPageSize: 10000,
            baseStyle: 'cellContractRow',
            fields: [
                {name: "id", hidden: true },
                {name: "title"},
                {name: "date", hidden: true},
                {name: "year"},
                {name: "amount", hidden: true},
                {name: "dateFormat",hidden: true},
                {name: "status", hidden: true},
                {name: "dateFinal", hidden:true},
                {name: "customerTitle", hidden:true}
            ],
            rowClick: this.onRowClick
            // getBaseStyle:function (record, rowNum, colNum) {
            //
            //
            //     if ((record.status === "Исполнение") || (record.status === "1"))  {
            //         // if ((new Date()) > (new Date(record.dateFinal)))
            //         //     return "cellRed";
            //         // else
            //          return "cellLightGreen"
            //     }
            //     else
            //     if (record.status === "0") return "cellLightYellow";
            //     else
            //         return this.baseStyle;
            // }
        });

        this.init();

        return Object.create(this);
    },

    init: function () {

        getAllContracts(function (contracts) {
            var title = "";
            for (var i = 0; i < contracts.length; i++) {
                title = NavContractsGrid.createItemBlock(contracts[i]);
                NavContractsGrid.dataSource.addData({id: contracts[i].id, title: title,
                    date: contracts[i].date, year: contracts[i].year, status: contracts[i].status,
                    customerTitle:contracts[i].customerTitle});
            }
            NavContractsGrid.listGrid.setDataSource(NavContractsGrid.dataSource);
        });
    },

    onRowClick: function (record) {
        NavContractsGrid.currentRecord = record;
    },


    createItemBlock: function(contract) {
        var bgColor = "#757575";
        var keyWord = "Недействителен";
        switch  (contract.status) {
            case "Исполнение":
            case "1":
                bgColor = "#64DD17";
                keyWord = "Исполение";
                break;
            case "Подписание":
            case "0":
                bgColor = "#FF8F00";
                keyWord = "Подписание";
                break;
            case "Выполнено":
                bgColor = "#0288D1";
                keyWord = "Выполнено";
                break;
        }

        var block = (
            "<div>"+
            "<table class='listItem'><tr>"+
                 "<td width='22px'><img src='"+imgDir+"/ic_currency.png' width='22px'></td>"+
                 "<td >"+contract.title+"</td>" +
                 "<td align='right' style='color: #00b956'>"+formatStringDoubleToCurrency(contract.amount)+"&nbsp;₽</td>" +
            "</tr></table>" +
            "<table width='100%' style='border-bottom: 1px; border-color: #9e9e9e'><tr>" +
                 "<td align='left'><small style='color: #0D47A1'>"+contract.customerTitle+"<small/></td>" +
                 "<td align='right'><small style='color: #2962FF'>"+formatDateString(contract.date)+"<small/></td>"+
            "</tr>" +
            "<tr ><td>" +
                "<a id ='statusButton' href='#' style='text-decoration: none' onclick='NavContractsGrid.statusButtonClick()'><small " +
                    "style='color: white; " +
                    "font-family: RobotoLight; " +
                    "background-color:"+ bgColor+";"+
                    "padding: 2px; " +
                    "border-radius: 3px'>" +
                    "&nbsp;"+keyWord+"&nbsp;" +
                "</small></a>" +
            "</td></tr></table>"+
            "</div>"
        );

        return block;
    },

    setFilter: function (filter) {
       NavContractsGrid.listGrid.filterData(filter);

    },

    statusButtonClick: function (record) {
        // NavContractsGrid.listGrid.getRecord(NavContractsGrid.listGrid.getFocusRow());
        console.log(NavContractsGrid.listGrid.getFocusRow());

    },

    clearFilter: function () {
        this.listGrid.filterData(null);
    }


};