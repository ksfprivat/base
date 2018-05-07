ContractReport = {

    create: function () {

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

        this.btnMenu = createButton(null, "ic_menu.png", "visible",24, null);
        this.btnResize = createButton(null, "ic_resize_max.png", "visible",24, ContractReport.resizeLayout);

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
            {name: "status", title:"Статус", align:"left", minWidth:100, changed :this.fieldChanged,
                valueMap: {
                    0:"Подписание", 1:"Исполнение", 2: "Выполнен", 3:"Не действителен"
                }
            },
            {name: "amount", title:"Сумма", type:"float", minWidth:100, format: ",0.00;",align:"left", changed :this.fieldChanged},
            {name: "costs", title:"Затраты", type:"float", minWidth: 100, format: ",0.00;",align:"left", changed :this.fieldChanged},
            {name: "datePayment", title:"Дата оплаты", minWidth:90, type:"date", align:"left", changed :this.fieldChanged,
                formatCellValue: function (value) {
                    return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                },
                formatEditorValue: function (value) {
                    return ((isDate(value)) || (value == null) ? value : formatDateString(value));
                }
            },
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
                 // filterImg: imgDir+"/ic_star.png"
                filterImg: null,
                actionButtonProperties:{selected: false, visibility:"hidden"}

                // baseStyle:"filterEditor"
            },
            canEdit:false,
            autoDraw: false,
            // canAutoFitFields:false,
            baseStyle:"cell",
            fields: this.fieldMap,
            initialSort: [
                {property: "date", direction: "descending"},
                {property: "title", direction: "descending"}
            ],

            rowClick: this.rowClick,

            getBaseStyle:function (record, rowNum, colNum) {
                if (typeof record === "undefined") return this.baseStyle;
                if ((record.status === "Исполнение") || (record.status === "1"))  {
                    if ((new Date()) > (new Date(record.dateFinal)))
                        return "cellRed";
                    else return "cellGreen"
                }
                else
                if (record.status === "0") return "cellAmber";
                else
                    return this.baseStyle;
            }
        });

        this.content = VLayout.create({
            width: "100%",
            height: "100%",
            autoDraw: false,
            styleName: "cardBox",
            members: [
             this.header, this.listGrid
            ]
        });

        this.init();

        return Object.create(this);
    },

    init: function () {
       getAllContracts(function (contracts) {
           ContractReport.dataSource.setCacheData(contracts);
           ContractReport.listGrid.setDataSource(ContractReport.dataSource);
           ContractReport.listGrid.filterData(null);
       })
    },

    rowClick: function (record) {
        console.log(record)
    },

    resizeLayout: function () {
        if (reportsFrame.navReports.isVisible()) {
            reportsFrame.navReports.hide();
            ContractReport.btnResize.setIcon(imgDir+"/ic_resize_min.png");
        } else {
            reportsFrame.navReports.show();
            ContractReport.btnResize.setIcon(imgDir+"/ic_resize_max.png");
        }
    }
};