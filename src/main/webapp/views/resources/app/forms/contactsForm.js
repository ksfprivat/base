ContactsForm ={
    create: function () {
        this.expanded = true;
        this.changed = false;
        this.changeCache = [];
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
            sortField: 1,
            fields: [
                {name: "id"},
                {name: "name", title:"Имя", width: 250},
                {name: "position", title:"Должность"},
                {name: "phone", title:"Телефон"},
                {name: "mobile", title:"Мобильный"},
                {name: "email", title:"E-mail"},
                {name: "fax", title:"Факс"}
            ],
            cellChanged: this.contactsChanged
        });

        this.contactsGrid .hideFields(["id"]);

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
        for (var i = 0; i < contactsCard.changeCache.length; i++) {

            var contact = {};

            contact.id = contactsCard.changeCache[i].id;
            contact.name = contactsCard.changeCache[i].name;
            contact.position = contactsCard.changeCache[i].position;
            contact.phone = contactsCard.changeCache[i].phone;
            contact.mobile = contactsCard.changeCache[i].mobile;
            contact.email = contactsCard.changeCache[i].email;
            contact.fax = contactsCard.changeCache[i].fax;
            contact.customerId = contactsCard.changeCache[i].customerId;

            updateContact(contact, function(success) {

            });
        }

        contactsCard.changeCache = [];
        contactsCard.setChangeBlockState("hidden");
    },


    rollbackChanges: function () {
        getContactsByCustomerId(contactsCard.changeCache[0].customerId, function(contacts){
            contactsCard.setData(contacts);
        });
        contactsCard.setChangeBlockState("hidden");
    },

    contactsChanged:function(record, newValue, oldValue, rowNum, colNum, grid){
        if (!contactsCard.changeCache.includes(record))
            contactsCard.changeCache.push(record);
        contactsCard.setChangeBlockState("visible");
    },

    setData: function (contacts) {
        contactsCard.changeCache = [];
        contactsCard.contactsGrid.setData(contacts);
    },


    setChangeBlockState: function (state) {
        $("#contactsCardBoxCommitChangesButton").attr("style", "visibility:" + state);
        $("#contactsCardBoxRollbackChangesButton").attr("style", "visibility:" + state);
    },

    addContact: function () {
       console.log("ADD CONTACT");
       ContactWindow.create(TRANSACTION_INSERT);
    },

    deleteContact: function () {
        console.log(contactsCard.contactsGrid.getSelectedRecord());
        isc.ask("Вы хотите удалить: "+navTreeSelectedNode.title,
            {
                yesClick: function() {
                    deleteContact(contactsCard.contactsGrid.getSelectedRecord().id, function (success) {
                        if (success) {
                            contactsCard.contactsGrid.removeSelectedData();
                        }
                    });
                    return this.Super('yesClick', arguments);}}
        );
    },

    editContact: function () {
        console.log("EDIT CONTACT");
    }


};
