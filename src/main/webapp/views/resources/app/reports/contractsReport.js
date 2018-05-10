ContractReport = {

    create: function () {

        function createButton(title, icon, visible, size, event){
            return (
                IButton.create({
                    layoutAlign:"center",
                    iconAlign:"center",
                    align:"center",
                    iconSize: 24,
                    width: size,
                    height: 48,
                    visibility: visible,
                    showDownIcon: false,
                    title:"<br>"+title,
                    icon: imgDir+"/"+icon,
                    showFocused: false,
                    baseStyle:"reportToolButton",
                    click: event
                })
            );
        }

        function createToolButton(title, icon, event) {
           return (
               HTMLFlow.create({
                   width:100,
                   contents: "<div align='center' class='reportToolButton'>"
                   +"<img src="+imgDir+"/"+icon+"><br>"+title+
                   "</div>"
               })
           );
        }

        this.btnMenu = createButton(null, "ic_menu.png", "visible",24, null);
        this.btnResize = createButton(null, "ic_resize_max.png", "visible",24, ContractReport.resizeLayout);


        this.separator = HTMLFlow.create({width:1, backgroundColor: "#757575", contents:"<div>&nbsp;</div>"});
        this.btnRefresh = createToolButton("Обновить", "ic_report_refresh.png", "visible",130, null);
        this.btnFilterRemove = createToolButton("Сбросить", "ic_report_filter_remove.png", "visible",130, null);
        this.btnGroup = createToolButton("Группировать", "ic_report_group.png", "visible",130, null);
        this.btnReportEdit = createToolButton("Изменить", "ic_report_edit.png", "visible",130, null);
        this.btnReportDelete= createToolButton("Удалить", "ic_report_delete.png", "visible",130, null);
        this.btnTotal = createToolButton("Итоги", "ic_report_sigma.png", "visible",130, null);
        this.btnExport = createToolButton("Экспорт", "ic_report_export_excel.png", "visible",130, null);




        this.toolBar = HLayout.create({
            width: "100%",
            align:"left",
            layoutLeftMargin: 6,
            height: 32,
            members:[
                this.btnRefresh,
                this.btnFilterRemove,
                this.btnGroup,
                this.separator,
                this.btnReportEdit,
                this.btnReportDelete,
                this.separator,
                this.btnTotal,
                this.btnExport
        ]});


        this.spacer = VLayout.create({width:"6"});

        this.header = HLayout.create({
            width:"100%",
            padding:10,
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
            {name: "title", title:"Наименование", minWidth:150, align:"left", changed :this.fieldChanged},
            {name: "customerTitle", title: "Организация", minWidth: 250, align:"left", changed: this.fieldChanged},
            {name: "date", title:"Дата", type:"date", align:"left", changed :this.fieldChanged},

            {name: "dateFinal", title:"Окончание", type:"date", align:"left", changed :this.fieldChanged,
                formatCellValue: function (value, record) {
                    if ((new Date() >= value) && (getStatusFieldTextValue(record.status)=== "Исполнение"))
                        return "<div class='redAlertBox'>&nbsp;"+formatDateString(dateToDateString(value))+"&nbsp;</div>";
                    else return value;
                    // return value;
                }
            },
            {name: "status", title:"Статус", align:"left", minWidth:100, changed :this.fieldChanged,
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
            {name: "amount", title:"Сумма", type:"float", minWidth:100, format: ",0.00;",align:"left", changed :this.fieldChanged},
            {name: "costs", title:"Затраты", type:"float", minWidth: 100, format: ",0.00;",align:"left", changed :this.fieldChanged},
            {name: "datePayment", title:"Дата оплаты", minWidth:90, type:"date", align:"left", changed :this.fieldChanged },
            {name: "type", title:"Тип", align:"left", minWidth:100,changed :this.fieldChanged,
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
                console.log(criteria);
                this.filterData(this.getFilterEditorCriteria(),
                    null, {textMatchStyle:this.autoFetchTextMatchStyle});
            },
            canEdit:false,
            dataFetchMode: "local",
            autoDraw: false,
            canAutoFitFields:true,
            baseStyle:"cell",
            fields: this.fieldMap,
            initialSort: [
                {property: "date", direction: "descending"},
                {property: "title", direction: "descending"}
            ],
            rowClick: this.rowClick
            // groupStartOpen:"all",
            // groupByField: 'date',
            // groupByMaxRecords: "10000",
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
             this.listGrid,
             Button.create({title:"Test", click:ContractReport.resetFilter})
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

    resetFilter: function () {
        var greater = new Date("2018.01.01");
        var less = new Date("2018.05.30");
        console.log(greater+"\n"+less);
        var criterion = {
            _constructor:"AdvancedCriteria",
            operator:"and",
            criteria:[
                { fieldName:"date", operator:"greaterOrEqual", value:greater },
                { fieldName:"date", operator:"lessOrEqual", value: less }
            ]
        };
        ContractReport.listGrid.filterData(criterion);
    }
};