ContactsForm ={
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
                {title: "Экспорт в PDF", icon:imgDir+"/ic_pdf.png", click:this.exportToPDF},
                {title: "Составить сообщение...", icon:imgDir+"/ic_send.png", click:this.mailTo}
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

        this.btnMenu = createButton(null, "ic_menu.png", "visible",24, function(){ContactsForm.menuBar.showMenu()});
        this.btnMaximize = createButton(null, "ic_resize_max.png", "visible",24, this.setPageViewMode);
        this.btnMinimize = createButton(null, "ic_resize_min.png", "hidden",24, this.setCadViewMode);

        this.btnExpand = createButton(null,"ic_collapse.png", "visible", 24, ContactsForm.cardExpand);
        this.btnCommit = createButton(null,"ic_commit.png", "hidden", 24,ContactsForm.commitChanges);
        this.btnRollback = createButton(null,"ic_rollback.png", "hidden",24, ContactsForm.rollbackChanges);


        this.spacer = VLayout.create({width:"6"});

        this.headerTitle = HTMLFlow.create({
            width:"100%",
            contents:"<div class='cardBoxTitle'>Контакты</div>"
        });

        this.header = HLayout.create({
            width:"100%",
            padding:10,
            members: [
                this.btnExpand,
                this.headerTitle,
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

        this.contactsGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            padding: 6,
            margin: 8,
            // autoFetchData:true,
            // dataPageSize: 100,
            showAllRecords:true,
            alternateRecordStyles: true,
            alternateFieldStyles: false,
            showHeaderMenuButton:false,
            showHeaderContextMenu: false,
            showSortNumerals: false,
            showRecordComponents: true,
            showRecordComponentsByCell: true,
            canEdit:true,
            autoDraw: false,
            fields: [
                {name: "id",  primaryKey: true, hidden :true},
                {name: "favorite", hidden: true},
                {name:"fav", title:"<img src='"+imgDir+"/ic_star_white_fill.png' height='18px' width='18px'>", width:22, align: "left"},
                {name: "name", title:"Имя", width: 250, changed :this.fieldChanged},
                {name: "position", title:"Должность", changed :this.fieldChanged},
                {name: "phone", title:"Телефон", changed :this.fieldChanged},
                {name: "mobile", title:"Мобильный", changed :this.fieldChanged},
                {name: "email", title:"E-mail", changed :this.fieldChanged},
                {name: "fax", title:"Факс", changed :this.fieldChanged}
            ],
            canMultiSort: true,
            initialSort: [
                {property: "favorite", direction: "descending"},
                {property: "name", direction: "ascending"}
            ],
            rowClick: this.rowClick,
            selectionChanged  : this.selectionChanged,
            cellChanged: this.contactsChanged,
            createRecordComponent : function (record, colNum)  {
                var fieldName = this.getFieldName(colNum);

                if (fieldName === "fav") {
                    var recordCanvas = HLayout.create({
                        height: 22,
                        width: "100%",
                        align: "center"
                    });
                    var favBtn = isc.ImgButton.create({
                        showDown: false,
                        showRollOver: false,
                        layoutAlign: "center",
                        src: (record.favorite === 0) ? (imgDir+"/ic_star_gray.png"): (imgDir+"/ic_star.png"),
                        prompt: "Фаворит",
                        height: 18,
                        width: 18,
                        grid: this,
                        click : function () {
                            if ( record.favorite === 1) {
                                this.setSrc(imgDir+"/ic_star_gray.png");
                                record.favorite = 0;
                            }
                            else {
                                this.setSrc(imgDir+"/ic_star.png");
                                record.favorite = 1;
                            }
                            ContactsForm.contactsChanged(record);
                        }});
                    recordCanvas.addMember(favBtn);
                    return recordCanvas;
                } else  return null;
            }
        });

        this.sortState = this.contactsGrid.getSort();

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            minWidth: 680,
            autoDraw: false,
            members: [
                this.header,
                this.customerTitle,
                this.toolBarBlock,
                this.contactsGrid
            ]
        });

        this.content.setStyleName("cardBox");

        return Object.create(this);
    },

    fieldChanged: function(form, item, value) {
        ContactsForm.contactsChanged(ContactsForm.contactsGrid.getSelectedRecord());
    },

    selectionChanged: function() {
        ContactsForm.contactsGrid.endEditing();
    },

    cardExpand: function () {
        var expandedHeight = (ContactsForm.customerTitle.visibility !== "hidden") ? "100%":"300";
        for (var i = 2; i < ContactsForm.content.members.length; i++) {
            if (ContactsForm.expanded) {
                ContactsForm.content.members[i].hide();
                ContactsForm.content.setHeight(30);
                ContactsForm.btnExpand.setIcon(imgDir+"/ic_goto.png");
            } else {
                ContactsForm.content.members[i].show();
                ContactsForm.content.setHeight(expandedHeight);
                ContactsForm.btnExpand.setIcon(imgDir+"/ic_collapse.png");
            }
        }
        ContactsForm.expanded = ! ContactsForm.expanded;
    },

    commitChanges: function () {
        ContactsForm.contactsGrid.endEditing();
        for (var i = 0; i < ContactsForm.changeCache.length; i++) {

            var contact = {};

            contact.id = ContactsForm.changeCache[i].id;
            contact.name = ContactsForm.changeCache[i].name;
            contact.position = ContactsForm.changeCache[i].position;
            contact.phone = ContactsForm.changeCache[i].phone;
            contact.mobile = ContactsForm.changeCache[i].mobile;
            contact.email = ContactsForm.changeCache[i].email;
            contact.fax = ContactsForm.changeCache[i].fax;
            contact.favorite = ContactsForm.changeCache[i].favorite;
            contact.customerId = ContactsForm.changeCache[i].customerId;

            updateContact(contact, function(success) {
                // if (success) changeNodeTitle(contact.id, contact.name);
            });
            changeNodeTitle(contact.id, contact.name);
            navContactsGrid.updateItem(contact.id, contact.name, customerCard.getData().title);
        }
        ContactsForm.changeCache = [];
        ContactsForm.setChangeBlockState("hidden");
    },

    rollbackChanges: function () {
        ContactsForm.contactsGrid.endEditing();
        getContactsByCustomerId(ContactsForm.changeCache[0].customerId, function(contacts){
            ContactsForm.setData(contacts);
        });
        ContactsForm.setChangeBlockState("hidden");
    },

    contactsChanged:function(record, newValue, oldValue, rowNum, colNum, grid){
        if (!ContactsForm.changeCache.includes(record))
            ContactsForm.changeCache.push(record);
        ContactsForm.setChangeBlockState("visible");
    },

    setData: function (contacts, customerId) {
        var sortState = ContactsForm.contactsGrid.getSort();
        ContactsForm.changeCache = [];
        ContactsForm.customerId = customerId;
        if (ContactsForm.customerTitle.visibility !== "hidden")
            ContactsForm.setCustomerTitle();
        ContactsForm.contactsGrid.setData(contacts);
        ContactsForm.contactsGrid.setSort(sortState);
        ContactsForm.setChangeBlockState("hidden");
        ContactsForm.contactsGrid.setSort(ContactsForm.sortState);
    },

    setChangeBlockState: function (state) {
        if(state === "visible") {
            ContactsForm.btnCommit.show();
            ContactsForm.btnRollback.show();
        } else {
            ContactsForm.btnCommit.hide();
            ContactsForm.btnRollback.hide();
        }
    },

    addContact: function () {
        var contactWindow = ContactWindow.create(TRANSACTION_INSERT, customerCard.getData().title);
        contactWindow.setData({}, ContactsForm.customerId );
    },

    deleteContact: function () {
        var record = ContactsForm.contactsGrid.getSelectedRecord();
        if (record != null)
            isc.ask("Вы хотите удалить: "+record.name,
                {
                    yesClick: function() {
                        deleteContact(record.id, function (success) {
                            if (success) {
                                ContactsForm.contactsGrid.removeSelectedData();
                                deleteNode(record.id);
                                navContactsGrid.deleteItemById(record.id);
                            }
                        });
                        return this.Super('yesClick', arguments);}}
            );
    },

    editContact: function () {
        var record = ContactsForm.contactsGrid.getSelectedRecord();
        if (record != null) {
            var contactWindow = ContactWindow.create(TRANSACTION_UPDATE,customerCard.getData().title);
            contactWindow.setData(record, ContactsForm.customerId)
        }
    },

    getRecordById: function (id) {
        var records = ContactsForm.contactsGrid.data;
        for (var i = 0; i < records.length; i++) {
            if (records[i].id === id) return records[i];
        }
        return false;
        // return $.grep(ContactsForm.contactsGrid.data, function(item) { return item.id === id })[0];
    },

    setCurrentRecord: function(record) {
        ContactsForm.contactsGrid.deselectAllRecords();
        ContactsForm.contactsGrid.selectRecord(record);
        // Unknown exception for the first time click on contact node
        try {
            ContactsForm.contactsGrid.scrollToRow(ContactsForm.contactsGrid.getFocusRow());
        } catch (e) {

        }
    },

    rowClick: function (record, recordNum, fieldNum) {
        // ==================================================================================================
        // WARNING ! This is experimental feature
        // Change navContactsGrid.listGrid record when select contactsGrid in contactsForm
        // Required navContactsGrid.listGrid.showAllRecords: true. ! NO USE because this decrease performance
        // ==================================================================================================
        selectNode(record.id);

        if (getNavigationFrameMode() === VM_CONTACTS) {
            var navContactsGridItem = navContactsGrid.getItemById(record.id);
            navContactsGrid.listGrid.deselectAllRecords();
            navContactsGrid.listGrid.selectRecord(navContactsGridItem);
            var index =  navContactsGrid.listGrid.getRecordIndex(navContactsGridItem);
            navContactsGrid.listGrid.scrollToRow(index);
        }
    },

    setHeaderTitle: function (title) {
        ContactsForm.headerTitle.setContents("<div class='cardBoxTitle'>"+title+"</div>");
    },

    mailTo: function () {
        var record= ContactsForm.contactsGrid.getSelectedRecord();
        if (record == null || (record.email.length === 0) || (typeof record.email === "undefined") ) {
            isc.warn("Невозможно оставить сообщение для адресата - нет корректного адреса email");
        } else {
            window.location.href = "mailto:"+record.email;
        }
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
                {text: 'Контакты', fontSize: 15,  margin: 5 },

                {table: {
                        headerRows: 1,
                        widths: [ 110, 90, 90, 90, 90],
                        body: [
                            ['Имя', "Должность", "Телефон", "Мобильный", "E-mail"]
                        ]
                    }}
            ]

        };

        for (var i = 0; i < ContactsForm.contactsGrid.data.length; i++) {
            docDef.content[3].table.body.push([
                ContactsForm.contactsGrid.data[i].name,
                ContactsForm.contactsGrid.data[i].position,
                ContactsForm.contactsGrid.data[i].phone,
                ContactsForm.contactsGrid.data[i].mobile,
                ContactsForm.contactsGrid.data[i].email]);
        }

        pdfMake.createPdf(docDef).open();
    },

    setPageViewMode: function () {
        ContactsForm.btnMaximize.hide();
        ContactsForm.btnMinimize.show();
        if (!ContactsForm.expanded)
            ContactsForm.cardExpand();
        ContactsForm.btnExpand.hide();
        ContactsForm.setCustomerTitle();
        ContactsForm.customerTitle.show();
        browserFrame.members.forEach(function (member) {
            if (member !==  ContactsForm.content) {
                member.hide();
            }
        });
        ContactsForm.content.setHeight("100%");
    },

    setCadViewMode: function () {
        ContactsForm.btnMaximize.show();
        ContactsForm.btnMinimize.hide();
        ContactsForm.btnExpand.show();
        ContactsForm.customerTitle.hide();
        browserFrame.members.forEach(function (member) {
            if (member !==  ContactsForm.content) {
                member.show();
            }
        });
        ContactsForm.content.setHeight("300");
    },

    setCustomerTitle: function() {
        ContactsForm.customerTitle.setContents(
            "<div class='cardBoxSectionTitle'>" +
            customerCard.getData().title +
            "</div><div class='cardBoxSeparator'/>"
        );
    }
};
