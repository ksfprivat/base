ContactWindow = {

    create: function (transactionType, customerTitle) {
        this.transactionType = transactionType;
        this.title = "Новый контакт";
        if (transactionType == TRANSACTION_UPDATE) this.title = "Контакт";

        this.header = HTMLFlow.create({
            width: "100%",
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td width='100%'>"+this.title+"</td>" +
            "<td><input title='Закрыть' type='image' src='"+imgDir +"/ic_close.png' class='cardBoxHeaderButton' onclick=ContactWindow.close()></td>" +
            "</tr></table>"
        });

        this.customerTitleBlock = HTMLFlow.create({
            width: "100%",
            contents: "<div class='cardBoxSectionTitle'>" + customerTitle + "</div><div class='cardBoxSeparator'/>"
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
                this.customerTitleBlock,
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
                    navContactsGrid.insertItem(contact, customerCard.getData().title);
            });
            ContactWindow.close();
        }
    },

    update: function () {
        if (ContactWindow.validate()) {
            var contact = ContactWindow.getData();
            var customerTitle = contact.customer.title;
            // Prepare contact entity for transfer into REST controller (remove "customer" property)
            delete contact["customer"];

            // Update record in contactsGrid of contactsCard
            var currentRecord  = ContactsForm.getRecordById(contact.id);
            currentRecord.name = contact.name;
            currentRecord.position = contact.position;
            currentRecord.phone = contact.phone;
            currentRecord.mobile = contact.mobile;
            currentRecord.email = contact.email;
            currentRecord.fax = contact.fax;

            updateContact(ContactWindow.getData(), function (success) {
                if (success) {
                    contactsCard.contactsGrid.refreshRow(contactsCard.contactsGrid.getRowNum(currentRecord));
                    changeNodeTitle(contact.id, contact.name);
                    navContactsGrid.updateItem(contact.id, contact.name, customerTitle);
                }
            });
            ContactWindow.close();
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

    clearData: function () {
        ContactWindow.nameBlock.clearValues();
        ContactWindow.contactDataBlock.clearValues();
        ContactWindow.data = null;
    },

    close: function () {
        ContactWindow.window.close();
    }

};