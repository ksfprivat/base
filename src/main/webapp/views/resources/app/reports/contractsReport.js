ContractReport = {

    create: function (config) {
        function createButton(title, icon, visible, size, event){
            return (
                IButton.create({
                    layoutAlign:"center",
                    iconAlign:"center",
                    align:"center",
                    iconSize: 24,
                    width: size,
                    height: 24,
                    visibility: "visible",
                    showDownIcon: false,
                    title:title,
                    icon: imgDir+"/"+icon,
                    showFocused: false,
                    baseStyle:"cardBoxToolButton",
                    click: event
                })
            );
        }

        function createToolButton(title, icon, visibility, event, menu) {
           return (
               HTMLFlow.create({
                   width:100,
                   visibility: visibility,
                   click: event,
                   contextMenu: (typeof menu !== "undefined") ? menu : null,
                   contents:
                   "<div align='center' class='reportToolButton'>"
                           +"<img src="+imgDir+"/"+icon+"><br>"+title+
                           ((typeof menu !== "undefined") ? "&#9662;":"&nbsp;")+
                   "</div>"
               })
           );
        }

        function separator() {
            return (VLayout.create({width:1, height: 60, margin:3, backgroundColor:"#e0e0e0"}));
        }


        this.groupMenu  = isc.Menu.create({
            autoDraw: false,
            showShadow: true,
            imageSize:24,
            shadowDepth: 0,
            valueIconSize:24,
            submenuImage:  {src:imgDir+"/ic_goto.png", height:24, width:24},
            checkmarkImage: imgDir+"/ic_commit.png",
            data: [
                {id: "customerTitle",title: "по Организации", click:ContractReport.groupData},
                {id: "date",title: "по Дате", click:ContractReport.groupData,
                    submenu: isc.Menu.create({
                        imageSize:24, valueIconSize:24, shadowDepth: 5, checkmarkImage: imgDir+"/ic_commit.png",
                        data:[
                            {id: "day", parent:"date", title: "по Дням", click:ContractReport.groupData},
                            {id: "month", parent:"date", title: "по Месяцам", click:ContractReport.groupData},
                            {id: "year", parent:"date", title: "по Году", click:ContractReport.groupData}
                        ]
                    })
                },
                {id: "dateFinal",title: "по Дате окончания", click:ContractReport.groupData,
                    submenu: isc.Menu.create({
                        imageSize:24, valueIconSize:24, shadowDepth: 5, checkmarkImage: imgDir+"/ic_commit.png",
                        data:[
                            {id: "day", parent:"dateFinal", title: "по Дням", click:ContractReport.groupData},
                            {id: "month", parent:"dateFinal", title: "по Месяцам", click:ContractReport.groupData},
                            {id: "year", parent:"dateFinal", title: "по Году", click:ContractReport.groupData}
                        ]
                    })
                },
                {id: "datePayment",title: "по Дате оплаты", click:ContractReport.groupData,
                    submenu: isc.Menu.create({
                        imageSize:24, valueIconSize:24, shadowDepth: 5, checkmarkImage: imgDir+"/ic_commit.png",
                        data:[
                            {id: "day", parent:"datePayment", title: "по Дням", click:ContractReport.groupData},
                            {id: "month", parent:"datePayment", title: "по Месяцам", click:ContractReport.groupData},
                            {id: "year", parent:"datePayment", title: "по Году", click:ContractReport.groupData}
                        ]
                    })
                },
                {id: "status",title: "по Статусу", click:ContractReport.groupData},
                {id: "type",title: "по Типу", click:ContractReport.groupData},
                {isSeparator: true},
                {id: "reset", title: "Очистить", icon:imgDir+"/ic_report_delete.png", click:ContractReport.groupData}
            ]
        });

        this.btnMenu = createButton(null, "ic_menu.png", "visible",24, null);
        this.btnResize = createButton(null, "ic_resize_max.png", "visible",24, ContractReport.resizeLayout);

        this.btnRefresh = createToolButton("Обновить", "ic_report_refresh.png", "visible", function () {
            ContractReport.init();
        });
        this.btnFilterRemove = createToolButton("Сбросить", "ic_report_filter_remove.png", "visible", function () {
            ContractReport.listGrid.clearCriteria();
        });
        this.btnGroup = createToolButton("Группировать", "ic_report_group.png", "visible", function () {
           ContractReport.btnGroup.showContextMenu();
        }, ContractReport.groupMenu);
        this.btnReportEdit = createToolButton("Изменить", "ic_report_edit.png", "visible", ContractReport.editRecord);
        this.btnReportDelete= createToolButton("Удалить", "ic_report_delete.png", "visible", ContractReport.deleteRecord);
        this.btnTotal = createToolButton("Итоги", "ic_report_sigma.png", "visible", null);
        this.btnExport = createToolButton("Экспорт", "ic_report_export_excel.png", "visible", ContractReport.exportData);


        this.toolBar = HLayout.create({
            width: "100%",
            align:"left",
            layoutLeftMargin: 6,
            height: 32,
            members:[
                this.btnRefresh,
                this.btnFilterRemove,
                this.btnGroup,
                separator(),
                this.btnReportEdit,
                this.btnReportDelete,
                separator(),
                this.btnTotal,
                this.btnExport
        ]});

        this.spacer = VLayout.create({width:"6", margin:2});

        this.header = HLayout.create({
            width:"100%",
            layoutLeftMargin:10,
            layoutTopMargin:10,
            layoutRightMargin:10,
            members: [
                HTMLFlow.create({
                    width:"100%",
                    contents:"<div class='cardBoxTitle'>Отчет по контрактам</div>"
                }),
                this.btnResize,
                this.spacer,
                this.btnMenu
            ]
        });

        this.fieldMap = [
            {name: "id",  primaryKey: true, hidden: true},
            {name: "notes", title:"<img src='"+imgDir+"/ic_comment_alert_white.png' width='18px' height='18px'>", width:22, align: "left",
                formatCellValue: function (value, record) {
                    if ( (record.note !== null) && (typeof record.note !== "undefined") && (String(record.note).length > 0) )
                        return "<img src='"+imgDir+"/ic_comment_alert_orange.png' title='"+record.note+"'>";
                    else
                        return value;
                }},
            {name: "number", title:"Контракт",type:"text", minWidth:150, align:"left", showGroupSummary:true, showGridSummary:true,  //summaryFunction:"count",
                formatGroupSummary: function () {
                  return "Итого:";
                },
                formatCellValue: function (value, record) {
                     return record.title;
                }
            },
            {name: "customerTitle", type:"text", title: "Организация", minWidth: 250, align:"left", showGridSummary:true, showGroupSummary:true,
                getGroupSummary :function (records) {
                    var prefix = "";
                    if (records.length === 1) return prefix + (records.length)+" Контракт";
                    if ((records.length  > 1) && (records.length  < 5))  return prefix + (records.length)+" Контракта";
                    if (records.length >= 5) return prefix + (records.length)+" Контрактов";
                }
            },
            {name: "date", title:"Дата", type:"date", align:"left", groupingModes: ["day", "month", "year"], defaultGroupingMode: "day",
                getGroupValue : function (value) {
                    if (!isDate(value)) return "Неизвестно";
                    switch (this.groupingMode) {
                        case "year":return value.getFullYear();
                        case "month":return (months[Number(value.getMonth())]+" "+String(value.getFullYear()));
                        case "day": return formatDateString(dateToDateString(value));
                    }
                }
            },
            {name: "dateFinal", title:"Окончание", type:"date", align:"left",
                formatCellValue: function (value, record) {
                    if ((new Date() >= value) && (getStatusFieldTextValue(record.status)=== "Исполнение"))
                        return "<div class='redAlertBox'>&nbsp;"+formatDateString(dateToDateString(value))+"&nbsp;</div>";
                    else return value;
                },
                getGroupValue : function (value) {
                    if (!isDate(value)) return "Неизвестно";
                    switch (this.groupingMode) {
                        case "year":return value.getFullYear();
                        case "month":return (months[Number(value.getMonth())]+" "+String(value.getFullYear()));
                        case "day": return formatDateString(dateToDateString(value));
                    }
                }
            },
            {name: "status", title:"Статус", align:"left", minWidth:100,
                valueMap: {
                    0: "Подписание", 1: "Исполнение", 2: "Выполнен", 3: "Недействителен"
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
            {name: "amount", title:"Сумма", type:"float", minWidth:100, format: ",0.00;",align:"left", showGroupSummary:true,
                getGroupSummary :function (records) {
                    var amount = 0;
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].status !== "3") amount += records[i].amount;
                    }
                    return  formatStringDoubleToCurrency(amount,"₽");
                }

            },
            {name: "costs", title:"Затраты", type:"float",   minWidth:100, format: ",0.00;",align:"left", showGroupSummary:true,
                getGroupSummary :function (records) {
                    var costs = 0;
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].status !== "3") costs += records[i].costs;
                    }
                    return  formatStringDoubleToCurrency(costs, "₽");
                }
            },
            {name: "payment", title:"Оплата", type:"float",   minWidth:100, format: ",0.00;",align:"left", showGroupSummary:true,
                getGroupSummary :function (records) {
                    var payments = 0;
                    for (var i = 0; i < records.length; i++) {
                        if (records[i].status !== "3") payments += records[i].payment;
                    }
                    return  formatStringDoubleToCurrency(payments, "₽");
                }
            },
            {name: "datePayment", title:"Дата оплаты",minWidth:90, type:"date", align:"left", showGroupSummary:true,
                getGroupValue : function (value) {
                    if (!isDate(value)) return "Неизвестно";
                    switch (this.groupingMode) {
                        case "year":return value.getFullYear();
                        case "month":return (months[Number(value.getMonth())]+" "+String(value.getFullYear()));
                        case "day": return formatDateString(dateToDateString(value));
                    }
                },
                formatCellValue: function(value, record) {
                    var result = value;
                    if ((record.status === "2") && (record.amount !== 0)) {
                        if ((value === null) || (typeof value === "undefined"))
                            result = "<div class='redAlertBox'>&nbsp;Нет оплаты&nbsp;</div>";
                    }
                    return result;
                }
            },
            {name: "type", title:"Тип", align:"left", minWidth:100,
                valueMap: {
                    0:"аттестация", 1:"контроль", 2: "услуги", 3:"поставка"
                }
            },
            {name: "year", title:" ",width:0, type:"text", hidden: true}

        ];


        this.dataSource = DataSource.create({
            fields:this.fieldMap,
            serverType:"sql",
            clientOnly: true
        });

        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            padding: 6,
            margin: 8,
            animateFolders:false,
            alternateRecordStyles: true,
            alternateFieldStyles: false,
            showHeaderMenuButton:false,
            showSortNumerals: false,
            showHeaderContextMenu: false,
            showFilterEditor: true,
            filterOnKeypress: true,
            showGroupSummary:true,
            canAutoFitFields: true,
            filterEditorProperties: {
                filterImg: null,
                actionButtonProperties:{selected: false, visibility:"hidden"}
            },
            // filterEditorSubmit: function (criteria) {
            //     console.log(criteria);
            //     if (criteria !== null)
            //         if (criteria._constructor === "AdvancedCriteria") {
            //             // this.setCriteria(criteria);
            //
            //             ContractReport.listGrid.setFilterEditorCriteria(criteria);
            //             return false;
            //         } else ContractReport.currentFilter = criteria;
            // },
            canEdit:false,
            // dataFetchMode: "local",
            autoDraw: false,
            baseStyle:"cell",
            gridComponents:[ "header", "filterEditor", "body"],
            fields: this.fieldMap,
            initialSort: [
                {property: "date", direction: "descending"},
                {property: "number", direction: "descending"}
            ],
            // rowClick: this.rowClick,
            recordDoubleClick: ContractReport.editRecord,
            dataPageSize: 10000,
            groupStartOpen:"first",
            // groupByField: 'status',
            groupByMaxRecords: "10000",
            showCollapsedGroupSummary: true
            // autoFetchData: true
        });

        this.content = VLayout.create({
            width: "100%",
            height: "100%",
            autoDraw: false,
            styleName: "cardBox",
            members: [
             this.header,
             this.toolBar,
             this.filterEditor,
             this.listGrid
            ]
        });

        this.init(config);

        return Object.create(this);
    },

    init: function (config) {
       getAllContracts(function (contracts) {
           contracts.forEach(function (contract) {
               contract.number = getContractNumber(contract.title);
               contract.date = (contract.date !== null)? new Date(contract.date): contract.date;
               contract.dateFinal = (contract.dateFinal !== null)? new Date(contract.dateFinal): contract.dateFinal;
               contract.datePayment = (contract.datePayment !== null)? new Date(contract.datePayment): contract.datePayment;
               // contract.status = getStatusFieldTextValue(contract.status);
               contract.status = getStatusFieldNumberValue(contract.status);

           });
           ContractReport.dataSource.setCacheData(contracts);
           ContractReport.listGrid.setDataSource(ContractReport.dataSource);
           ContractReport.listGrid.filterData(null);
           // Configure
           if (typeof config !== "undefined") {
               if (typeof config.criteria !== "undefined")
                   ContractReport.listGrid.filterData(config.criteria);

               if (typeof config.group !== "undefined")
                   if (typeof config.groupMode !== "undefined")
                       ContractReport.listGrid.getFieldByName(config.group).groupingMode = config.groupMode;
                   ContractReport.listGrid.setGroupState(config.group);
           }
       })
    },

    rowClick: function (record) {
         console.log(record);
    },

    resizeLayout: function () {
        if (reportsFrame.navReports.isVisible()) {
            reportsFrame.navReports.hide();
            ContractReport.btnResize.setIcon(imgDir+"/ic_resize_min.png");
        } else {
            reportsFrame.navReports.show();
            ContractReport.btnResize.setIcon(imgDir+"/ic_resize_max.png");
        }
    },

    groupData: function(traget, item) {
        // Uncheck all items
        for (var i =  0; i < ContractReport.groupMenu.data.length; i++) {
            if (item.parent === ContractReport.groupMenu.data[i].id)
                ContractReport.groupMenu.setItemChecked(ContractReport.groupMenu.data[i], true);
            else
                ContractReport.groupMenu.setItemChecked(ContractReport.groupMenu.data[i], false);
            if (typeof ContractReport.groupMenu.data[i].submenu !== "undefined")
                for (var j = 0; j <  ContractReport.groupMenu.data[i].submenu.data.length; j++)
                    ContractReport.groupMenu.setItemChecked(ContractReport.groupMenu.data[i].submenu.data[j], false);
        }

        if (item.id === "reset")
            ContractReport.listGrid.ungroup();


        else {
            if (typeof item.parent === "undefined") {
                ContractReport.groupMenu.setItemChecked(item);
                ContractReport.listGrid.setGroupState(item.id);
            } else {
                ContractReport.groupMenu.setItemChecked(item);
                ContractReport.listGrid.getFieldByName(item.parent).groupingMode = item.id;
                ContractReport.listGrid.setGroupState(item.parent);
            }
        }
    },

    editRecord: function () {
        var record = ContractReport.listGrid.getSelectedRecord();
        if (record != null) {
            var contractWindow = ContractWindow.create(TRANSACTION_UPDATE, record.customerTitle);
            contractWindow.setData(record, record.customerId);
        }
    },

    updateRecord: function (contract) {

        function isEmpty(value) {
            return ((value === null) || (typeof value === "undefined"));
        }

        contract.date = !isEmpty(contract.date)? new Date(contract.date): contract.date;
        contract.dateFinal = !isEmpty(contract.dateFinal)? new Date(contract.dateFinal): contract.dateFinal;
        contract.datePayment = !isEmpty(contract.datePayment)? new Date(contract.datePayment): contract.datePayment;

        ContractReport.listGrid.updateData(contract);
        ContractReport.listGrid.refreshRow(ContractReport.listGrid.getRowNum(contract));
    },

    deleteRecord: function () {
        var record = ContractReport.listGrid.getSelectedRecord();
        if (record != null)
            isc.ask("Вы хотите удалить: "+record.title,
                {
                    yesClick: function() {
                        deleteContract(record.id, function (success) {
                            if (success) {
                                ContractReport.listGrid.removeSelectedData();
                                navContractsGrid.listGrid.removeData(record);
                                deleteNode(record.id);
                            }
                        });
                        return this.Super('yesClick', arguments);}}
            );
    },

    getExportOutput: function (data) {
        var output = [];
        for (var i = 0; i < data.length; i++) {
            output[i] = {
                title:data[i].title, customer:data[i].customerTitle,
                date:formatDateString(data[i].date), dateFinal:formatDateString(data[i].dateFinal),
                status: getStatusFieldTextValue(data[i].status), type:getContractTypeWord(data[i].type),
                amount: data[i].amount, costs:data[i].costs
            }
        }
        return output;
    },

    exportData: function () {
        function parseGroupTree(tree) {
            var  data = [];
            for (var i = 0; i < tree.groupMembers.length; i++) {
                if (typeof tree.groupMembers[i].groupMembers !== "undefined")
                    for (var j = 0; j < tree.groupMembers[i].groupMembers.length; j++)
                        data.push(tree.groupMembers[i].groupMembers[j]);
            }
            return data;
        }
        
        var data = (typeof ContractReport.listGrid.groupTree === "undefined") ?
            ContractReport.listGrid.data.allRows:
            parseGroupTree(ContractReport.listGrid.groupTree.root);

        var xls = new XlsExport(ContractReport.getExportOutput(data), "String");
        xls.exportToXLS('export'+Number(new Date())+'.xls');
    }

};