ContactsForm ={
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


        this.contextMenu  = isc.Menu.create({
            autoDraw: false,
            showShadow: false,
            shadowDepth: 10,
            data: [
                {title: "Экспорт в PDF", icon:imgDir+"/ic_export.png", click:this.exportToPDF},
                {title: "Составить сообщение", icon:imgDir+"/ic_email.png", click:this.exportToPDF}

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

        this.btnExpand = createButton(null,"ic_expand.png", "visible", 24, ContactsForm.cardExpand);
        this.btnCommit = createButton(null,"ic_commit.png", "hidden", 24,ContactsForm.commitChanges);
        this.btnRollback = createButton(null,"ic_rollback.png", "hidden",24, ContactsForm.rollbackChanges);


        this.header = HLayout.create({
            width:"100%",
            padding:10,
            members: [
                this.btnExpand,
                HTMLFlow.create({
                    width:"100%",
                    contents:"<div class='cardBoxTitle'>Контакты</div>"
                }),
                this.btnCommit,
                this.btnRollback,
                this.btnMenu,
                this.menuBar
            ]
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
            alternateRecordStyles: true,
            alternateFieldStyles: false,
            showHeaderMenuButton:false,
            showSortNumerals: false,
            canEdit:true,
            autoDraw: false,
            fields: [
                {name: "id",  primaryKey: true},
                {name: "name", title:"Имя", width: 250},
                {name: "position", title:"Должность"},
                {name: "phone", title:"Телефон"},
                {name: "mobile", title:"Мобильный"},
                {name: "email", title:"E-mail"},
                {name: "fax", title:"Факс"}
            ],
            sortField: 1,
            rowClick: this.rowClick,
            cellChanged: this.contactsChanged
        });

        this.contactsGrid.hideFields(["id"]);

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            minWidth: 680,
            autoDraw: false,
            members: [
                this.header,
                this.toolBarBlock,
                this.contactsGrid
            ]
        });

        this.content.setStyleName("cardBox");

        return Object.create(this);
    },

    cardExpand: function () {
        for (var i = 1; i < ContactsForm.content.members.length; i++) {
            if (ContactsForm.expanded) {
                ContactsForm.content.members[i].hide();
                ContactsForm.content.setHeight(30);
                ContactsForm.btnExpand.setIcon(imgDir+"/ic_collapse.png");
            } else {
                ContactsForm.content.members[i].show();
                ContactsForm.content.setHeight(300);
                ContactsForm.btnExpand.setIcon(imgDir+"/ic_expand.png");
            }
        }
        ContactsForm.expanded = ! ContactsForm.expanded;
    },

    commitChanges: function () {
        for (var i = 0; i < ContactsForm.changeCache.length; i++) {

            var contact = {};

            contact.id = ContactsForm.changeCache[i].id;
            contact.name = ContactsForm.changeCache[i].name;
            contact.position = ContactsForm.changeCache[i].position;
            contact.phone = ContactsForm.changeCache[i].phone;
            contact.mobile = ContactsForm.changeCache[i].mobile;
            contact.email = ContactsForm.changeCache[i].email;
            contact.fax = ContactsForm.changeCache[i].fax;
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
        ContactsForm.changeCache = [];
        ContactsForm.customerId = customerId;
        ContactsForm.contactsGrid.setData(contacts);
    },

    setChangeBlockState: function (state) {
        if(state == "visible") {
            ContactsForm.btnCommit.show();
            ContactsForm.btnRollback.show();
        } else {
            ContactsForm.btnCommit.hide();
            ContactsForm.btnRollback.hide();
        }
    },

    addContact: function () {
       var contactWindow = ContactWindow.create(TRANSACTION_INSERT, customerCard.getData().title);
       contactWindow.setData({}, ContactsForm.customerId )
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
                                deleteContactNode(record.id);
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
            if (records[i].id == id) return records[i];
        }
        return false;
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

         if (getNavigationFrameMode() == VM_CONTACTS) {
             var navContactsGridItem = navContactsGrid.getItemById(record.id);
             navContactsGrid.listGrid.deselectAllRecords();
             navContactsGrid.listGrid.selectRecord(navContactsGridItem);
             var index =  navContactsGrid.listGrid.getRecordIndex(navContactsGridItem);
             navContactsGrid.listGrid.scrollToRow(index);
         }
    },

    exportToPDF: function() {

        function formatAddress(data) {
            var result = "";
            var fields = ['post', 'district', 'region', 'city', 'street', 'building'];
            for (var i = 0; i < fields.length; i++) {
              if (typeof data[fields[i]] != "undefined")
                if (data[fields[i]].length > 0) {
                    result = result + data[fields[i]]+" ";
                    if (i != fields.length) result = result+",";
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
    }
};
