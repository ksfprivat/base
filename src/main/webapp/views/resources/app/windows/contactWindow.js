ContactWindow = {

    create: function (transactionType) {
        this.transactionType = transactionType;
        // this.customerId = customerId;
        this.title = "Новый контакт";
        if (transactionType == TRANSACTION_UPDATE) this.title = "Реактировать контакт";

        this.header = HTMLFlow.create({
            width: "100%",
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td width='100%'>"+this.title+"</td>" +
            "<td><input title='Закрыть' type='image' src='"+imgDir +"/ic_close.png' class='cardBoxHeaderButton' onclick=ContactWindow.close()></td>" +
            "</tr></table>"
        });


        this.nameBlock = DynamicForm.create({
            width: "100%",
            titleOrientation: "top",
            numCols: 1,
            colWidths: ["*"],
            padding: 6,
            margin: 8,
            autoDraw: false,
            fields: [
                {name: "name", title: "Имя", type: "text", width: "100%"},
                {name: "position", title: "Должность", type: "text", width: "100%"}
            ]
        });

        this.contactDataBlock = DynamicForm.create({
            titleOrientation: "top",
            colWidths: ["100", "100"],
            numCols: 2,
            padding: 6,
            margin: 8,
            autoDraw: false,
            fields: [
                {name: "phone", title: "Телефон", type: "text"},
                {name: "mobile", title: "Мобильный", type: "text"},
                {name: "email", title: "E-mail", type: "text"},
                {name: "fax", title: "Факс", type: "text"}
            ]
        });

        this.controlsBlock = HLayout.create({
            width: "100%",
            height: 36,
            padding: 6,
            margin: 6,
            membersMargin: 8,
            align: "right",
            members: [
                Button.create({title: "OK", baseStyle:"toolStripButton", click: this.save}),
                Button.create({title: "Отмена", baseStyle:"toolStripButton", click: this.close})
            ]
        });


        this.window = isc.Window.create({
            width: 475,
            showHeaderIcon: false,
            isModal: true,
            autoCenter: true,
            autoSize: true,
            showHeader: false,
            showModalMask: true,
            canDragReposition: false,
            items: [
                this.header,
                this.nameBlock,
                this.contactDataBlock,
                this.controlsBlock
            ]
        });

        return Object.create(this);
    },


    save: function () {
        switch (ContactWindow.transactionType) {
            case TRANSACTION_INSERT: ContactWindow.insert();
                break;
            case TRANSACTION_UPDATE: ContactWindow.update();
                break;
        }
    },

    insert: function () {
        var contact = ContactWindow.getData();
        if (ContactWindow.validate()) {
            insertContact(contact, function (newContactId) {
                    contact.id = newContactId;
                    contactsCard.contactsGrid.addData(contact);
                    addContactNode(contact.customerId, contact);
                    ContactWindow.close();
            });
        }
    },

    update: function () {
        if (ContactWindow.validate()) {
            // Prepare contact entity for transfer into REST controller (remove "customer" property)
            var contact = ContactWindow.getData();
            delete contact["customer"];
            // Update record in contactsGrid of contactsCard
            var currentRecord  = contactsCard.contactsGrid.getSelectedRecord();
            currentRecord.name = ContactWindow.nameBlock.getValue("name");
            currentRecord.postion = ContactWindow.nameBlock.getValue("position");
            currentRecord.phone = ContactWindow.contactDataBlock.getValue("phone");
            currentRecord.mobile = ContactWindow.contactDataBlock.getValue("mobile");
            currentRecord.email = ContactWindow.contactDataBlock.getValue("email");
            currentRecord.fax = ContactWindow.contactDataBlock.getValue("fax");
            updateContact(ContactWindow.getData(), function (success) {
                if (success) {
                    contactsCard.contactsGrid.refreshRow(contactsCard.contactsGrid.getRowNum(currentRecord));
                    changeNodeTitle(currentRecord.id, currentRecord.name);
                    ContactWindow.close();
                }
            });
        }
    },


    validate: function () {
        if (ContactWindow.nameBlock.getValue("name") == undefined) {
            isc.warn("Необходимо ввести имя контакта !");
            return false
        }
        else return true;
    },

    getData: function () {
        // Rewrite addressBlock values in titleBlock (merge values to Customer entity)
        var result = ContactWindow.nameBlock.getValues();
        var contactDataBlock = ContactWindow.contactDataBlock.getFields();
        for (var i = 0; i < contactDataBlock.length; i++) {
            result[contactDataBlock[i].name] = ContactWindow.contactDataBlock.getValue(contactDataBlock[i].name);
        }
        result.customerId = ContactWindow.customerId;
        return result;
    },

    setData: function (contact, customerId) {
      ContactWindow.customerId = customerId;
      ContactWindow.nameBlock.setValues(contact);
      ContactWindow.contactDataBlock.setValues(contact);
    },

    close: function () {
        ContactWindow.window.close();
    }

};