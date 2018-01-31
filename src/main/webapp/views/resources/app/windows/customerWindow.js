const TRANSACTION_INSERT = 55555;
const TRANSACTION_UPDATE = 55556;

CustomerWindow = {

    create: function (transactionType) {
        this.transactionType = transactionType;
        this.title = "Новая организация";
        if (transactionType == TRANSACTION_UPDATE) this.title = "Организация";
        this.header = HTMLFlow.create({
            width: "100%",
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td width='100%'>"+this.title+"</td>" +
            "<td><input id='cardBoxCommitChangesButton' title='Закрыть' type='image' src='"+imgDir +"/ic_close.png' class='cardBoxHeaderButton' onclick=CustomerWindow.close()></td>" +
            "</tr></table>"
        });

        this.titleBlock = DynamicForm.create({
            width: "100%",
            numCols: 2,
            colWidths: [100, "*"],
            padding: 6,
            margin: 8,
            autoDraw: false,
            fields: [
                {name: "title", title: "Сокращенное", type: "text", width: "100%"},
                {name: "titleFull", title: "Полное", type: "text", width: "100%"},
                {name: "inn", title: "ИНН", type: "text", width: "200"}
            ]
        });

        this.addressBlock = DynamicForm.create({
            titleOrientation: "top",
            colWidths: ["100", "100", "100"],
            numCols: 3,
            padding: 6,
            margin: 8,
            autoDraw: false,
            fields: [
                {name: "post", title: "Индекс", type: "text"},
                {name: "district", title: "Регион", type: "text"},
                {name: "region", title: "Область", type: "text"},
                {name: "city", title: "Город", type: "text"},
                {name: "street", title: "Улица", type: "text"},
                {name: "building", title: "Дом", type: "text"}
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


        function blockTitle(title) {
            return HTMLFlow.create({
                width: "100%",
                contents: "<div class='cardBoxSectionTitle'>" + title + "</div><div class='cardBoxSeparator'/>"
            });
        }

        this.window = isc.Window.create({
            width: 700,
            showHeaderIcon: false,
            isModal: true,
            autoCenter: true,
            autoSize: true,
            showHeader: false,
            showModalMask: true,
            canDragReposition: false,
            items: [
                this.header,
                blockTitle("Наименование"),
                this.titleBlock,
                blockTitle("Адрес"),
                this.addressBlock,
                this.controlsBlock
            ]
        });

        return Object.create(this);
    },

   save: function () {
        switch (CustomerWindow.transactionType) {
            case TRANSACTION_INSERT: CustomerWindow.insert();
                break;
            case TRANSACTION_UPDATE: CustomerWindow.update();
                break;
        }
   },

   insert: function () {
       if (CustomerWindow.validate()) {
              var customer = CustomerWindow.getData();
              insertCustomer(customer, function (newCustomerId) {
                  var node = {
                      title: customer.title,
                      name: customer.title,
                      id: newCustomerId,
                      isFolder: true,
                      type: "customer",
                      children: [
                          {
                              id: "contacts_" + newCustomerId, parentId: newCustomerId, customerId: newCustomerId,
                              title: "Контакты", name: "Контакты", icon:imgDir+"/ic_folder_contacts.png", isFolder: true, type: "contactsFolder", search: false
                          },
                          {
                              id: "contracts_" + newCustomerId, parentId: newCustomerId, customerId: newCustomerId,
                              title: "Контракты", name: "Контракты", isFolder: true, type: "contractsFolder", search: false
                          }
                      ]
                  };
                  navTreeAddCustomerNode(node);
              });
              CustomerWindow.window.close();
       }
    },

    update: function () {
        if (CustomerWindow.validate()) {
            updateCustomer(CustomerWindow.getData(), function (success) {
                if (success) {
                    refreshCustomerNode(CustomerWindow.getData());
                }
            });
            CustomerWindow.window.close();
        }
    },

    close: function () {
        CustomerWindow.window.close();
    },
    
    getData: function () {
        // Rewrite addressBlock values in titleBlock (merge values to Customer entity)
        var result = CustomerWindow.titleBlock.getValues();
        var addressBlockFields = CustomerWindow.addressBlock.getFields();
        for (var i = 0; i < addressBlockFields.length; i++) {
            result[addressBlockFields[i].name] = CustomerWindow.addressBlock.getValue(addressBlockFields[i].name);
        }
        return result;
    },

    setData: function (customer) {

        CustomerWindow.data = customer;
        CustomerWindow.titleBlock.setValues(this.data);
        CustomerWindow.addressBlock.setValues(this.data);
    },

    validate: function () {
        if (CustomerWindow.titleBlock.getValue("title") == undefined) {
            isc.warn("Необходимо ввести наименование организаци !");
            return false
        }
        else return true;
    }

};
