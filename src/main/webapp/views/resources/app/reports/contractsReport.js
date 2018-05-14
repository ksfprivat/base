ContractReport = {

    create: function () {
        this.currentFilter = null;
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
            shadowDepth: 10,
            valueIconSize:24,
            checkmarkImage: imgDir+"/ic_commit.png",
            data: [
                {id: "reset", title: "Сбросить", click:ContractReport.groupData},
                {id: "customerTitle",title: "по Организации", click:ContractReport.groupData},
                {id: "date",title: "по Дате", click:ContractReport.groupData},
                {id: "dateFinal",title: "по Дате окончания", click:ContractReport.groupData},
                {id: "status",title: "по Статусу", click:ContractReport.groupData},
                {id: "type",title: "по Типу", click:ContractReport.groupData}
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
        this.btnReportEdit = createToolButton("Изменить", "ic_report_edit.png", "visible", null);
        this.btnReportDelete= createToolButton("Удалить", "ic_report_delete.png", "visible", null);
        this.btnTotal = createToolButton("Итоги", "ic_report_sigma.png", "visible", null);
        this.btnExport = createToolButton("Экспорт", "ic_report_export_excel.png", "visible", null);


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
            {name: "title", title:"Наименование", minWidth:150, align:"left"},
            {name: "customerTitle", title: "Организация", minWidth: 250, align:"left"},
            {name: "date", title:"Дата", type:"date", align:"left"},

            {name: "dateFinal", title:"Окончание", type:"date", align:"left",
                formatCellValue: function (value, record) {
                    if ((new Date() >= value) && (getStatusFieldTextValue(record.status)=== "Исполнение"))
                        return "<div class='redAlertBox'>&nbsp;"+formatDateString(dateToDateString(value))+"&nbsp;</div>";
                    else return value;
                }
            },
            {name: "status", title:"Статус", align:"left", minWidth:100,
                valueMap: [
                    "Подписание", "Исполнение", "Выполнен", "Не действителен"
                ],
                formatCellValue: function(value) {
                    switch (getStatusFieldTextValue(value)) {
                        case "Исполнение":
                            return  "<div class='greenAlertBox'>&nbsp;Исполнение&nbsp;</div>";
                        case "Подписание":
                            return "<div class='orangeAlertBox'>&nbsp;Подписание&nbsp;</div>";
                        default:
                            return getStatusFieldTextValue(value);
                        }
                    }
            },
            {name: "amount", title:"Сумма", type:"float", minWidth:100, format: ",0.00;",align:"left"},
            {name: "costs", title:"Затраты", type:"float",   minWidth:100, format: ",0.00;",align:"left"},
            {name: "datePayment", title:"Дата оплаты",minWidth:90, type:"date", align:"left" },
            {name: "type", title:"Тип", align:"left", minWidth:100,
                valueMap: {
                    0:"аттестация", 1:"контроль", 2: "услуги", 3:"поставка"
                }
            }
        ];

        this.dataSource = DataSource.create({
            fields:this.fieldMap,
            clientOnly: true
        });


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
            showFilterEditor: true,
            filterOnKeypress: true,
            filterEditorProperties: {
                filterImg: null,
                actionButtonProperties:{selected: false, visibility:"hidden"}
            },
            filterEditorSubmit: function (criteria) {
                // console.log(criteria);
                if (criteria !== null)
                    if (criteria._constructor === "AdvancedCriteria") {
                        this.setCriteria(criteria);
                        return false;
                    } else ContractReport.currentFilter = criteria;
            },
            canEdit:false,
            dataFetchMode: "local",
            autoDraw: false,
            baseStyle:"cell",
            gridComponents:[ "header", "filterEditor", "body"],
            fields: this.fieldMap,
            initialSort: [
                {property: "date", direction: "descending"},
                {property: "title", direction: "descending"}
            ],
            rowClick: this.rowClick,
            groupStartOpen:"first",
            // groupByField: 'status',
            groupByMaxRecords: "10000"
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

        this.init();

        return Object.create(this);
    },

    init: function () {
       getAllContracts(function (contracts) {
           contracts.forEach(function (contract) {
               contract.date = (contract.date !== null)? new Date(contract.date): contract.date;
               contract.dateFinal = (contract.dateFinal !== null)? new Date(contract.dateFinal): contract.dateFinal;
               contract.datePayment = (contract.datePayment !== null)? new Date(contract.datePayment): contract.datePayment;
               contract.status = getStatusFieldTextValue(contract.status);
           });
           ContractReport.dataSource.setCacheData(contracts);
           ContractReport.listGrid.setDataSource(ContractReport.dataSource);
           ContractReport.listGrid.filterData(null);
       })
    },

    rowClick: function (record) {
        // console.log(record);
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
        for (var i =  0; i < ContractReport.groupMenu.data.length; i++)
            ContractReport.groupMenu.setItemChecked(ContractReport.groupMenu.data[i], false);

        if (item.id === "reset") ContractReport.listGrid.ungroup();
        else {
            ContractReport.groupMenu.setItemChecked(item);
            ContractReport.listGrid.setGroupState(item.id);
        }
    }

};