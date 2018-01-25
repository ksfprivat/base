ContactsForm ={
    create: function () {
        this.expanded = true;
        this.changed = false;
        this.changeCache = [];
        this.customerId = null;
        this.header = HTMLFlow.create({
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td><input id='contactsCardExpandButton' title='Свернуть' type='image' src='" + imgDir + "/ic_expand.png' class='cardBoxHeaderButton' onclick='ContactsForm.cardExpand()'></td>" +
            "<td width='100%'>Контакты</td>" +
            "<td><input id='contactsCardBoxCommitChangesButton' title='Сохранить' type='image' src='" + imgDir + "/ic_commit.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='ContactsForm.commitChanges()'></td>" +
            "<td><input id='contactsCardBoxRollbackChangesButton' title='Отменить' type='image' src='" + imgDir + "/ic_rollback.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='ContactsForm.rollbackChanges()'></td>" +
            "</tr></table>"
        });

        this.btnAddConatact =  IButton.create({
            iconSize: 24,
            showDownIcon: false,
            title:"Добавить",
            icon: imgDir+"/ic_add_blue.png",
            showFocused: false,
            baseStyle:"cardBoxToolButton",
            click: this.addContact
        });


        this.btnDelConatact = IButton.create({
            iconSize: 24,
            showDownIcon: false,
            title:"Удалить",
            icon: imgDir+"/ic_delete_blue.png",
            showFocused: false,
            baseStyle:"cardBoxToolButton",
            click: this.deleteContact
        });


        this.btnEditConatact = IButton.create({
            iconSize: 24,
            showDownIcon: false,
            title:"Изменить",
            icon: imgDir+"/ic_edit_blue.png",
            showFocused: false,
            baseStyle:"cardBoxToolButton",
            click: this.editContact
        });


        this.toolBarBlock = HLayout.create({
            width: "100%",
            margin:4,
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
                {name: "id"},
                {name: "name", title:"Имя", width: 250},
                {name: "position", title:"Должность"},
                {name: "phone", title:"Телефон"},
                {name: "mobile", title:"Мобильный"},
                {name: "email", title:"E-mail"},
                {name: "fax", title:"Факс"}
            ],
            sortField: "name",
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
        for (var i = 1; i < this.content.members.length; i++) {
            if (this.expanded) {
                this.content.members[i].hide();
                this.content.setHeight(30);
                $("#contactsCardExpandButton").attr("src", imgDir + "/ic_collapse.png");
            } else {
                this.content.members[i].show();
                this.content.setHeight(300);
                $("#contactsCardExpandButton").attr("src", imgDir + "/ic_expand.png");
            }
        }
        this.expanded = !this.expanded;
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
        $("#contactsCardBoxCommitChangesButton").attr("style", "visibility:" + state);
        $("#contactsCardBoxRollbackChangesButton").attr("style", "visibility:" + state);
    },

    addContact: function () {
       var contactWindow = ContactWindow.create(TRANSACTION_INSERT);
       contactWindow.setData({}, ContactsForm.customerId )
    },

    deleteContact: function () {
        var record = ContactsForm.contactsGrid.getSelectedRecord();
        console.log(record);
        if (record != null)
            isc.ask("Вы хотите удалить: "+record.name,
                {
                    yesClick: function() {
                        deleteContact(record.id, function (success) {
                            if (success) {
                                ContactsForm.contactsGrid.removeSelectedData();
                                deleteContactNode(record.id)
                            }
                        });
                        return this.Super('yesClick', arguments);}}
            );
    },

    editContact: function () {
        var record = ContactsForm.contactsGrid.getSelectedRecord();
        if (record != null) {
            var contactWindow = ContactWindow.create(TRANSACTION_UPDATE);
            contactWindow.setData(record, ContactsForm.customerId)
        }
    }
};
