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
                {name: "customerTitle", hidden:true},
                {name: "contractNumber", hidden: true}
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
            // sortField: "date",
            // sortDirection: "descending",
            initialSort: [
                {property: "date", direction: "descending"},
                {property: "contractNumber", direction: "descending"}
            ],
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
                {name: "customerTitle", hidden:true},
                {name: "contractNumber", hidden: true}
            ],
            rowClick: this.onRowClick,
            rowDoubleClick: this.onRowDoubleClick
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
                    date: contracts[i].date, year: contracts[i].year, status: getStatusFieldTextValue(contracts[i].status),
                    customerTitle:contracts[i].customerTitle, customerId: contracts[i].customerId,
                    contractNumber: getContractNumber(contracts[i].title)});
            }
            NavContractsGrid.listGrid.setDataSource(NavContractsGrid.dataSource);
            afterLoad();
        });
    },

    onRowClick: function (record) {
        NavContractsGrid.currentRecord = record;
        if (!browserFrame.isVisible()) browserFrame.show();
        if (navTreeCurrentCustomerId !== record.customerId) {
            refreshBrowserFrame(record.customerId);
            //  Setup current node in navTree - Replace after implement application menu
            navTree.deselectAllRecords();
            navTree.selectRecord(navTreeData.findById(record.customerId));
            navTree.scrollToRow(navTree.getFocusRow());

            navTreeCurrentCustomerId = record.customerId;

        }
        ContractsForm.setCurrentRecord(ContractsForm.getRecordById(record.id));
    },

    onRowDoubleClick: function (record) {
        NavContractsGrid.editItem();
    },


    createItemBlock: function(contract) {
        var bgColor = "#757575";
        var keyWord = "Недействителен";
        var message = (new Date() >= new Date(contract.dateFinal) && ((contract.status === "Исполнение") || (contract.status === "1")) )?
            "<small style='background-color: #d93651; border-radius: 3px; color:white; padding: 2px'>&nbsp;Сроки!&nbsp;</small>"+
            "<td align='right'><small style='color:#d93651; padding-right: 6px'>"+formatDateString(contract.dateFinal)+"<small/></td>"
            :
            "<td align='right'><small style='color:#2962FF; padding-right: 6px'>"+formatDateString(contract.dateFinal)+"<small/></td>";

        switch  (contract.status) {
            case "Исполнение":
            case "1":
                // bgColor = "#64DD17";
                bgColor = "#47cc8a";
                keyWord = "Исполение";
                break;
            case "Подписание":
            case "0":
                bgColor = "#FF8F00";
                keyWord = "Подписание";
                break;
            case "Выполнен":
            case "Выполнено":
            case "2":
                bgColor = "#0288D1";
                keyWord = "Выполнен";
                break;
        }

        return (
            "<div>"+
            "<table class='listItem'><tr>"+
                 // "<td width='22px'><img src='"+imgDir+"/ic_currency.png' width='22px'></td>"+
                 "<td >"+contract.title+"</td>" +
                 "<td align='right' style='color: #00b956; padding-right: 6px'>"+formatStringDoubleToCurrency(contract.amount)+"&nbsp;₽</td>" +
            "</tr></table>" +
            "<table width='100%'><tr>" +
                 "<td align='left'>" +
                 "<a href='#' class='smallLink' " +
                    "data-filter='"+contract.customerTitle+"' " +
                    "onclick='NavContractsGrid.filterLinkClick(this.dataset.filter)'>" +
                    "<small style='color: #0D47A1;'>"+contract.customerTitle+"<small/></a></td>" +
                 "<td align='right'><small style='color: #2962FF; padding-right: 6px'>"+formatDateString(contract.date)+"<small/></td>"+
            "</tr>" +
            "<tr ><td>" +
                "<a  href='#' style='text-decoration: none' " +
                    "data-filter='"+keyWord+"' "+
                    "onclick='NavContractsGrid.filterLinkClick(this.dataset.filter)'>"+
                "<small " +
                    "style='color: white; " +
                    "font-family: RobotoLight; " +
                    "background-color:"+ bgColor+";"+
                    "padding: 2px; " +
                    "border-radius: 3px'> "+
                    "&nbsp;"+keyWord+"&nbsp;" +
                "</small></a>" +"&nbsp;"+ message +
            "</td></tr></table>"+
            "</div>"
        );
    },

    setFilter: function (filter) {
        var criterion = {
            _constructor:"AdvancedCriteria",
            operator:"or",
            criteria:[
                { fieldName:"customerTitle", operator:"iContains", value:filter.title },
                { fieldName:"status", operator:"iContains", value:filter.title },
                { fieldName:"contractNumber", operator:"iContains", value:filter.title },
                { fieldName:"year", operator:"iContains", value:filter.title }
            ]
        };
       NavContractsGrid.listGrid.filterData(criterion);
    },

    filterLinkClick: function (filter) {
        $("#searchText").val(filter);
        $("#navBarSearchTextClearButton").attr("style", "visibility:visible");
        NavContractsGrid.listGrid.filterData({title:filter});
    },

    clearFilter: function () {
        this.listGrid.filterData(null);
    },


    getItemById: function (id) {
        return $.grep(NavContractsGrid.listGrid.dataSource.cacheData, function(item) { return item.id === id })[0];
    },

    updateItem: function (contract) {
        var record   = NavContractsGrid.getItemById(contract.id);

        if (typeof record !== "undefined") {
            record.id = contract.id;
            record.customerId = contract.customerId;
            if (typeof contract.customerTitle === "undefined")
                contract.customerTitle = customerCard.getData().title;
            record.customerTitle = contract.customerTitle;
            record.status = contract.status;
            record.date = contract.date;
            record.year = contract.year;
            record.title = NavContractsGrid.createItemBlock(contract);
            NavContractsGrid.listGrid.updateData(record);
            NavContractsGrid.listGrid.refreshRow(NavContractsGrid.listGrid.getRowNum(record));
        }
    },

    editItem: function () {
        if (NavContractsGrid.currentRecord != null) {
            var contractWindow = ContractWindow.create(TRANSACTION_UPDATE, customerCard.getData().title);
            getContractById(NavContractsGrid.currentRecord.id, function (contact) {
                contractWindow.setData(contact, NavContractsGrid.currentRecord.customerId);
            });
        }
    },

    insertItem: function(contract) {
        contract.customerTitle = customerCard.getData().title;
        navContractsGrid.listGrid.addData(
            {
                id: contract.id,
                title: NavContractsGrid.createItemBlock(contract),
                date: contract.date,
                year: contract.year,
                status: contract.status,
                customerTitle:  contract.customerTitle,
                customerId: contract.customerId,
                contractNumber: getContractNumber(contract.title)
            },
            function () {
                contractsCard.setCurrentRecord(contractsCard.getRecordById(contract.id));
                contractsCard.rowClick(contractsCard.getRecordById(contract.id), null, null);


        });
    },

    deleteItem: function() {
        var record = NavContractsGrid.listGrid.getSelectedRecord();
        if (record != null) {
            isc.ask("Вы хотите удалить: "+record.title,
                {
                    yesClick: function() {
                        deleteContract(record.id, function (success) {
                            if (success) {
                                deleteNode(record.id);
                                NavContractsGrid.listGrid.removeData(record);
                                ContractsForm.listGrid.removeData(ContractsForm.getRecordById(record.id));
                            }
                        });
                        return this.Super('yesClick', arguments);}
                }
            );
        } else isc.warn("Необходимо выбрать данные");
    },

    deleteItemById: function (id) {
        var record = NavContractsGrid.getItemById(id);
        if (typeof record !== "undefined")
            NavContractsGrid.listGrid.dataSource.removeData(record);
    }

};