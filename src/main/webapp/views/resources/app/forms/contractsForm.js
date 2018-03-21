ContractsForm ={
    create: function () {
        this.expanded = true;
        this.changed = false;
        this.changeCache = [];
        this.customerId = null;

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

        this.btnAddConatact =  createButton("Добавить", "ic_add_blue.png", "visible", 110,this.addContact);
        this.btnDelConatact =  createButton("Удалить", "ic_delete_blue.png", "visible", 110, this.deleteContact);
        this.btnEditConatact=  createButton("Изменить", "ic_edit_blue.png", "visible",110, this.editContact);

        this.btnMenu = createButton(null, "ic_menu.png", "visible",24, function(){ContractsForm.menuBar.showMenu()});
        this.btnMaximize = createButton(null, "ic_resize_max.png", "visible",24, this.setPageViewMode);
        this.btnMinimize = createButton(null, "ic_resize_min.png", "hidden",24, this.setCadViewMode);

        this.btnExpand = createButton(null,"ic_expand.png", "visible", 24, ContractsForm.cardExpand);
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
            canEdit:true,
            autoDraw: false,
            fields: [
                {name: "id",  primaryKey: true},
                {name: "title", title:"Наименование", width: 250, changed :this.fieldChanged},
                {name: "date", title:"Дата", changed :this.fieldChanged},
                {name: "date_final", title:"Окончание", changed :this.fieldChanged},
                {name: "amount", title:"Сумма", changed :this.fieldChanged},
                {name: "type", title:"Тип", changed :this.fieldChanged},
                {name: "status", title:"Состояние", changed :this.fieldChanged}
            ],
            sortField: 1,
            rowClick: this.rowClick,
            selectionChanged  : this.selectionChanged,
            cellChanged: this.contactsChanged
        });

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

    fieldChanged: function(form, item, value) {
        ContractsForm.contactsChanged(ContractsForm.listGrid.getSelectedRecord());
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
                ContractsForm.btnExpand.setIcon(imgDir+"/ic_collapse.png");
            } else {
                ContractsForm.content.members[i].show();
                ContractsForm.content.setHeight(expandedHeight);
                ContractsForm.btnExpand.setIcon(imgDir+"/ic_expand.png");
            }
        }
        ContractsForm.expanded = ! ContractsForm.expanded;
    },

    commitChanges: function () {
        ContractsForm.listGrid.endEditing();
        // Commit code
        ContractsForm.changeCache = [];
        ContractsForm.setChangeBlockState("hidden");
    },

    rollbackChanges: function () {
        ContractsForm.listGrid.endEditing();
        // Rollback code
        ContractsForm.setChangeBlockState("hidden");
    },

    contactsChanged:function(record, newValue, oldValue, rowNum, colNum, grid){
        if (!ContractsForm.changeCache.includes(record))
            ContractsForm.changeCache.push(record);
        ContractsForm.setChangeBlockState("visible");
    },

    setData: function (contacts, customerId) {
        ContractsForm.changeCache = [];
        ContractsForm.customerId = customerId;
        if (ContractsForm.customerTitle.visibility !== "hidden")
            ContractsForm.setCustomerTitle();
        ContractsForm.listGrid.setData(contacts);
        ContractsForm.setChangeBlockState("hidden");
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

    addContact: function () {
        // Add contact code
    },

    deleteContact: function () {
        var record = ContractsForm.listGrid.getSelectedRecord();
        if (record != null)
            isc.ask("Вы хотите удалить: "+record.name,
                {
                    yesClick: function() {
                        // Delete contract code
                        return this.Super('yesClick', arguments);}}
            );
    },

    editContact: function () {
        var record = ContractsForm.listGrid.getSelectedRecord();
        if (record != null) {
           // Edit contact code
        }
    },

    getRecordById: function (id) {
        var records = ContractsForm.listGrid.data;
        for (var i = 0; i < records.length; i++) {
            if (records[i].id === id) return records[i];
        }
        return false;
    },

    setCurrentRecord: function(record) {
        ContractsForm.listGrid.deselectAllRecords();
        ContractsForm.listGrid.selectRecord(record);
        // Unknown exception for the first time click on contact node
        try {
            ContractsForm.listGrid.scrollToRow(ContractsForm.listGrid.getFocusRow());
        } catch (e) {

        }
    },

    rowClick: function (record, recordNum, fieldNum) {

    },



    exportToPDF: function() {

        function formatAddress(data) {
            var result = "";
            var fields = ['post', 'district', 'region', 'city', 'street', 'building'];
            for (var i = 0; i < fields.length; i++) {
                if (typeof data[fields[i]] !== "undefined")
                    if (data[fields[i]].length > 0) {
                        result = result + data[fields[i]]+" ";
                        if (i !== fields.length) result = result+",";
                    }
            }
            return result.substring(0, result.length-1);
        }

        var customer = CustomerForm.getData();
        var docDef = {
            content: [
                {text: 'Организация', fontSize: 15,  margin: 5 },

                {table: {
                        headerRows: 1,
                        widths: [ '*', '*'],
                        body: [
                            ['Наименование', customer.title],
                            ['Полное наименование', customer.titleFull],
                            ['ИНН', customer.inn],
                            ['Адрес', formatAddress(customer)]
                        ]
                    }},
                {text: 'Контакты', fontSize: 15,  margin: 5 }

            ]

        };

        pdfMake.createPdf(docDef).open();
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
