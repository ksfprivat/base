ContractsForm ={
    create: function () {
        this.expanded = true;
        this.changed = false;
        this.changeCache = [];
        this.customerId = null;
        this.sortState = [];

        function createButton(title, icon, visible, size, event){
            return (
                IButton.create({
                    layoutAlign:"center",
                    iconAlign:"left",
                    align:"left",
                    iconSize: 24,
                    width: size,
                    height: 24,
                    visibility: visible,
                    showDownIcon: false,
                    title:title,
                    icon: imgDir+"/"+icon,
                    showFocused: false,
                    baseStyle:"cardBoxToolButton",
                    click: event
                }));
        }

        this.contextMenu  = Menu.create({
            autoDraw: false,
            showShadow: false,
            imageSize: 24,
            shadowDepth: 10,
            data: [
                {title: "Экспорт в PDF", icon:imgDir+"/ic_pdf.png", click:this.exportToPDF}
            ]
        });

        this.menuBar = MenuButton.create({
            title:"",
            width:1,
            height:24,
            menu:this.contextMenu,
            baseStyle:"cardBoxToolButton"
        });

        this.btnAddConatact =  createButton("Добавить", "ic_add_blue.png", "visible", 110,this.addContract);
        this.btnDelConatact =  createButton("Удалить", "ic_delete_blue.png", "visible", 110, this.deleteContract);
        this.btnEditConatact=  createButton("Изменить", "ic_edit_blue.png", "visible",110, this.editContract);

        this.btnMenu = createButton(null, "ic_menu.png", "visible",24, function(){ContractsForm.menuBar.showMenu()});
        this.btnMaximize = createButton(null, "ic_resize_max.png", "visible",24, this.setPageViewMode);
        this.btnMinimize = createButton(null, "ic_resize_min.png", "hidden",24, this.setCadViewMode);

        this.btnExpand = createButton(null,"ic_collapse.png", "visible", 24, ContractsForm.cardExpand);
        this.btnCommit = createButton(null,"ic_commit.png", "hidden", 24,ContractsForm.commitChanges);
        this.btnRollback = createButton(null,"ic_rollback.png", "hidden",24, ContractsForm.rollbackChanges);


        this.spacer = VLayout.create({width:"6"});

        this.header = HLayout.create({
            width:"100%",
            padding:10,
            members: [
                this.btnExpand,
                HTMLFlow.create({
                    width:"100%",
                    contents:"<div class='cardBoxTitle'>Контракты</div>"
                }),
                this.btnCommit,
                this.spacer,
                this.btnRollback,
                this.spacer,
                this.btnMaximize,
                this.btnMinimize,
                this.spacer,
                this.btnMenu,
                this.menuBar
            ]
        });

        this.customerTitle = HTMLFlow.create({
            width: "100%", visibility: "hidden"
        });

        this.toolBarBlock = HLayout.create({
            width: "100%",
            margin:6,
            height: 32,
            members:[
                this.btnAddConatact,
                this.btnDelConatact,
                this.btnEditConatact
            ]});

        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            padding: 6,
            margin: 8,
            alternateRecordStyles: true,
            alternateFieldStyles: false,
            showHeaderMenuButton:false,
            showSortNumerals: false,
            showHeaderContextMenu: false,
            canEdit:true,
            autoDraw: false,
            canAutoFitFields:false,
            showRecordComponents: true,
            showRecordComponentsByCell: true,
            showAllRecords:true,
            baseStyle:"cell",
            fields: [
                {name: "id",  primaryKey: true},
                {name: "notes", title:"<img src='"+imgDir+"/ic_comment_alert_white.png' height='18px' width='18px'>", width:22, align: "left"},
                {name: "title", title:"Наименование", minWidth:150, align:"left", changed :this.fieldChanged},
                {name: "date", title:"Дата", type:"date", align:"left", changed :this.fieldChanged,
                    formatCellValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    },
                    formatEditorValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    }
                },
                {name: "dateFinal", title:"Окончание", type:"date", align:"left", changed :this.fieldChanged,
                    formatCellValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    },
                    formatEditorValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    }
                },
                {name: "status", title:"Состояние", align:"left", minWidth:100, changed :this.fieldChanged,
                    valueMap: {
                        0:"Подписание", 1:"Исполнение", 2: "Выполнен", 3:"Не действителен"
                    },
                    formatCellValue: function(value) {
                        switch (getStatusFieldTextValue(value)) {
                            case "Исполнение":
                                return  "<div class='greenAlertBox'>&nbsp;Исполнение&nbsp;</div>";
                            case "Подписание":
                                return "<div class='orangeAlertBox'>&nbsp;Подписание&nbsp;</div>";

                            case "Недействителен":
                                return "<div class='grayAlertBox'>&nbsp;Недействителен&nbsp;</div>";

                            default:
                                return getStatusFieldTextValue(value);
                        }
                    }
                },
                {name: "amount", title:"Сумма", type:"float", minWidth:100, format: ",0.00;",align:"left", changed :this.fieldChanged},
                {name: "costs", title:"Затраты", type:"float", minWidth: 100, format: ",0.00;",align:"left", changed :this.fieldChanged},
                {name: "payment", title:"Оплата", type:"float", minWidth: 100, format: ",0.00;",align:"left", changed :this.fieldChanged,
                    formatCellValue: function (value, record) {
                        var result = ( (stringNumberToCurrency(value) !== "null")
                            && (stringNumberToCurrency(value) !== "undefined" ) ) ? stringNumberToCurrency(value)+",00": "";
                        if ((getStatusFieldTextValue(record.status) === "Выполнен") && (record.amount !== 0)) {
                            if ((typeof value === "undefined") || (value === null))
                                result = "<div class='redAlertBox'>&nbsp;Нет оплаты&nbsp;</div>";
                            else if (value < record.amount) {
                                result = "<div class='redAlertBox'>&nbsp;" + stringNumberToCurrency(value)+",00" + "&nbsp;</div>";
                            }
                        }
                        return result;
                    }
                },

                {name: "datePayment", title:"Дата оплаты", type:"date", align:"left", changed :this.fieldChanged,
                    formatCellValue: function (value, record) {
                        var result = ((isDate(value)) || (value == null) ? value : formatDateString(value));
                        if ((getStatusFieldTextValue(record.status) === "Выполнен") && (record.amount !== 0)) {
                            if ((value === null) || (typeof value === "undefined"))
                                result = "<div class='redAlertBox'>&nbsp;Нет оплаты&nbsp;</div>";
                            else if (new Date() < new Date(value) || (record.amount > record.payment) )
                                result = "<div class='redAlertBox'>&nbsp;"+formatDateString(value)+"&nbsp;</div>";
                        }
                        return result;

                    },
                    formatEditorValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    }
                },
                {name: "type", title:"Тип", align:"left", minWidth:100,changed :this.fieldChanged,
                    valueMap: {
                        0:"аттестация", 1:"контроль", 2: "услуги", 3:"поставка"
                    }
                },
                {name: "dateWorkBegin", title:"Начало работ", type:"date", align:"left", changed :this.fieldChanged,
                    formatCellValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    },
                    formatEditorValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    }
                },
                {name: "dateWorkEnd", title:"Завершение работ", type:"date", align:"left", changed :this.fieldChanged,
                    formatCellValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    },
                    formatEditorValue: function (value) {
                        return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                    }
                }                
            ],
            // sortField: 2,
            // sortDirection:"descending",
            initialSort: [
                {property: "date", direction: "descending"},
                {property: "title", direction: "descending"}
            ],
            // rowClick: this.rowClick,
            selectionChanged  : this.selectionChanged,
            cellChanged: this.ContractsChanged,
            createRecordComponent : function (record, colNum)  {
                var fieldName = this.getFieldName(colNum);

                if (fieldName === "notes") {
                    var recordCanvas = HLayout.create({
                        height: 22,
                        width: "100%",
                        align: "center"
                    });
                    var notesBtn = isc.ImgButton.create({
                        showDown: false,
                        showRollOver: false,
                        layoutAlign: "center",
                        src: ( (record.note !== null) &&
                            (typeof record.note !== "undefined") &&
                            (String(record.note).length > 0) )? (imgDir+"/ic_comment_alert_orange.png"):(imgDir+"/ic_comment_gray.png"),
                        prompt: ( (record.note !== null) && (typeof record.note !== "undefined") && (String(record.note).length > 0) )? record.note: "Добавить коментарии",
                        height: 18,
                        width: 18,
                        grid: this,
                        click : function () {
                            if (record != null) {
                                ContractsForm.setCurrentRecord(record);
                                var contractWindow = ContractWindow.create(TRANSACTION_UPDATE, customerCard.getData().title);
                                contractWindow.setData(record, ContractsForm.customerId);
                            }
                        }
                    });
                    recordCanvas.addMember(notesBtn);
                    return recordCanvas;
                } else  return null;
            }
        });

        this.sortState = this.listGrid.getSort();

        this.listGrid.hideFields(["id"]);

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            minWidth: 680,
            autoDraw: false,
            members: [
                this.header,
                this.customerTitle,
                this.toolBarBlock,
                this.listGrid
            ]
        });

        this.content.setStyleName("cardBox");

        return Object.create(this);
    },

    fieldChanged: function() {
        ContractsForm.ContractsChanged(ContractsForm.listGrid.getSelectedRecord());
    },

    selectionChanged: function() {
        ContractsForm.listGrid.endEditing();
    },

    cardExpand: function () {
        var expandedHeight = (ContractsForm.customerTitle.visibility !== "hidden") ? "100%":"300";
        for (var i = 2; i < ContractsForm.content.members.length; i++) {
            if (ContractsForm.expanded) {
                ContractsForm.content.members[i].hide();
                ContractsForm.content.setHeight(30);
                ContractsForm.btnExpand.setIcon(imgDir+"/ic_goto.png");
            } else {
                ContractsForm.content.members[i].show();
                ContractsForm.content.setHeight(expandedHeight);
                ContractsForm.btnExpand.setIcon(imgDir+"/ic_collapse.png");
            }
        }
        ContractsForm.expanded = ! ContractsForm.expanded;
    },

    commitChanges: function () {
        ContractsForm.listGrid.endEditing();
        for (var i = 0; i < ContractsForm.changeCache.length; i++) {
                var contract = {};

                contract.id = ContractsForm.changeCache[i].id;
                contract.customerId = ContractsForm.changeCache[i].customerId;
                contract.title = ContractsForm.changeCache[i].title;
                contract.date = isDate(ContractsForm.changeCache[i].date) ?
                    dateToDateString(ContractsForm.changeCache[i].date) : ContractsForm.changeCache[i].date;
                contract.dateFinal = isDate(ContractsForm.changeCache[i].dateFinal) ?
                    dateToDateString(ContractsForm.changeCache[i].dateFinal) : ContractsForm.changeCache[i].dateFinal;
                contract.status = ContractsForm.changeCache[i].status;
                contract.amount = ContractsForm.changeCache[i].amount;
                contract.costs= ContractsForm.changeCache[i].costs;
                contract.type = ContractsForm.changeCache[i].type;
                contract.department = ContractsForm.changeCache[i].department;
                contract.object = 0;
                // contract.department = ContractsForm.changeCache[i].customerId;
                contract.payment = ContractsForm.changeCache[i].payment;
                contract.datePayment = isDate(ContractsForm.changeCache[i].datePayment) ?
                    dateToDateString(ContractsForm.changeCache[i].datePayment) : ContractsForm.changeCache[i].datePayment;
                contract.dateWorkBegin = isDate(ContractsForm.changeCache[i].dateWorkBegin) ?
                    dateToDateString(ContractsForm.changeCache[i].dateWorkBegin) : ContractsForm.changeCache[i].dateWorkBegin;
                contract.dateWorkEnd = isDate(ContractsForm.changeCache[i].dateWorkEnd) ?
                    dateToDateString(ContractsForm.changeCache[i].dateWorkEnd) : ContractsForm.changeCache[i].dateWorkEnd;
                
                
            updateContract(contract, function(success) { });

            changeNodeTitle(contract.id, contract.title);
            navContractsGrid.updateItem(contract);
        }


        ContractsForm.changeCache = [];
        ContractsForm.setChangeBlockState("hidden");
    },

    rollbackChanges: function () {
        ContractsForm.listGrid.endEditing();
        // Rollback code
        getContractsByCustomerId(ContractsForm.changeCache[0].customerId, function(contracts){
            ContractsForm.setData(contracts);
        });

        ContractsForm.setChangeBlockState("hidden");
    },

    ContractsChanged:function(record){
        if (!ContractsForm.changeCache.includes(record))
            ContractsForm.changeCache.push(record);
        ContractsForm.setChangeBlockState("visible");
    },

    setData: function (contracts, customerId) {
        ContractsForm.changeCache = [];
        ContractsForm.customerId = customerId;
        if (ContractsForm.customerTitle.visibility !== "hidden")
            ContractsForm.setCustomerTitle();
        ContractsForm.listGrid.setData(contracts);
        ContractsForm.setChangeBlockState("hidden");
        ContractsForm.listGrid.setSort(ContractsForm.sortState);
    },

    setChangeBlockState: function (state) {
        if(state === "visible") {
            ContractsForm.btnCommit.show();
            ContractsForm.btnRollback.show();
        } else {
            ContractsForm.btnCommit.hide();
            ContractsForm.btnRollback.hide();
        }
    },

    addContract: function () {
        var contractWindow = ContractWindow.create(TRANSACTION_INSERT, customerCard.getData().title);
        contractWindow.setData({date:new Date(), dateFinal: new Date()}, ContractsForm.customerId );
    },

    deleteContract: function () {
        var record = ContractsForm.listGrid.getSelectedRecord();
        if (record != null)
            isc.ask("Вы хотите удалить: "+record.title,
                {
                    yesClick: function() {
                        deleteContract(record.id, function (success) {
                            if (success) {
                                ContractsForm.listGrid.removeSelectedData();
                                // Another operation
                                navContractsGrid.listGrid.removeData(navContractsGrid.getItemById(record.id));
                                deleteNode(record.id);
                            }
                        });
                        return this.Super('yesClick', arguments);}}
            );
    },

    editContract: function () {
        var record = ContractsForm.listGrid.getSelectedRecord();
        if (record != null) {
            var contractWindow = ContractWindow.create(TRANSACTION_UPDATE, customerCard.getData().title);

            record.date = (record.date !== null)? formatDateString(record.date): record.date;
            record.dateFinal = (record.dateFinal !== null)? formatDateString(record.dateFinal): record.dateFinal;
            record.datePayment = (record.datePayment !== null)? formatDateString(record.datePayment): record.datePayment;

            contractWindow.setData(record, ContractsForm.customerId)
        }
    },

    getRecordById: function (id) {
        var records = ContractsForm.listGrid.data;
        for (var i = 0; i < records.length; i++) {
            if (records[i].id === id) return records[i];
        }
        return false;
        // return $.grep(ContractsForm.listGrid.data, function(item) { return item.id === id })[0];
    },

    setCurrentRecord: function(record) {
        ContractsForm.listGrid.deselectAllRecords();
        ContractsForm.listGrid.selectRecord(record);
        // Unknown exception for the first time click on Contract node
        try {
            ContractsForm.listGrid.scrollToRow(ContractsForm.listGrid.getFocusRow());
        } catch (e) {

        }
    },

    rowClick: function (record) {
        selectNode(record.id);
        if (getNavigationFrameMode() === VM_CONTRACTS) {
            var item = navContractsGrid.getItemById(record.id);
            navContractsGrid.listGrid.deselectAllRecords();
            navContractsGrid.listGrid.selectRecord(item);
            navContractsGrid.listGrid.scrollToRow(navContractsGrid.listGrid.getRecordIndex(item));
        }
    },

    exportToPDF: function() {

    },

    setPageViewMode: function () {
        ContractsForm.btnMaximize.hide();
        ContractsForm.btnMinimize.show();
        if (!ContractsForm.expanded)
            ContractsForm.cardExpand();
        ContractsForm.btnExpand.hide();
        ContractsForm.setCustomerTitle();
        ContractsForm.customerTitle.show();
        browserFrame.members.forEach(function (member) {
            if (member !==  ContractsForm.content) {
                member.hide();
            }
        });
        ContractsForm.content.setHeight("100%");
    },

    setCadViewMode: function () {
        ContractsForm.btnMaximize.show();
        ContractsForm.btnMinimize.hide();
        ContractsForm.btnExpand.show();
        ContractsForm.customerTitle.hide();
        browserFrame.members.forEach(function (member) {
            if (member !==  ContractsForm.content) {
                member.show();
            }
        });
        ContractsForm.content.setHeight("300");
    },

    setCustomerTitle: function() {
        ContractsForm.customerTitle.setContents(
            "<div class='cardBoxSectionTitle'>" +
            customerCard.getData().title +
            "</div><div class='cardBoxSeparator'/>"
        );
    }
};
