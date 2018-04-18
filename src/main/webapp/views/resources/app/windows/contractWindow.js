ContractWindow = {

    create: function (transactionType, customerTitle) {
        this.transactionType = transactionType;
        this.title = "Новый контракт";
        if (transactionType === TRANSACTION_UPDATE) this.title = "Контакт";

        this.header = HTMLFlow.create({
            width: "100%",
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td width='100%'>"+this.title+"</td>" +
            "<td><input title='Закрыть' type='image' src='"+imgDir +"/ic_close.png' class='cardBoxHeaderButton' onclick=ContractWindow.close()></td>" +
            "</tr></table>"
        });

        this.customerTitleBlock = HTMLFlow.create({
            width: "100%",
            contents: "<div class='cardBoxSectionTitle'>" + customerTitle + "</div><div class='cardBoxSeparator'/>"
        });


        this.ContractDataBlock = DynamicForm.create({
            titleOrientation: "top",
            colWidths: ["100", "100"],
            numCols: 2,
            padding: 6,
            margin: 8,
            autoDraw: false,
            fields: [
                {name: "title", title: "Наименование", type: "text"},
                {name: "type", title: "Тип", type: "text",
                    valueMap: {
                        0:"аттестация", 1:"контроль", 2: "услуги", 3:"поставка"
                    }},
                {name: "date", title: "Дата", type: "text"},
                {name: "dateFinal", title: "Завершение", type: "text"},

                {name: "Amount", title: "Сумма", type: "text"},
                {name: "Costs", title: "Расходы", type: "text"},
                {name: "Status", title: "Статус", type: "text"}
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
                this.ContractDataBlock,
                this.controlsBlock
            ]
        });

        return Object.create(this);
    },


    save: function () {
        switch (ContractWindow.transactionType) {
            case TRANSACTION_INSERT: ContractWindow.insert();
                break;
            case TRANSACTION_UPDATE: ContractWindow.update();
                break;
        }
    },

    insert: function () {
        var Contract = ContractWindow.getData();
        if (ContractWindow.validate()) {
           // Insert block
            ContractWindow.close();
        }
    },

    update: function () {
        if (ContractWindow.validate()) {


            updateContract(ContractWindow.getData(), function (success) {
                if (success) {

                }
            });
            ContractWindow.close();
        }
    },


    validate: function () {
        return true;
    },

    getData: function () {
        // Rewrite addressBlock values in titleBlock (merge values to Customer entity)
        var result = ContractWindow.ContractDataBlock.getValues();

        return result;
    },

    setData: function (Contract, customerId) {
        ContractWindow.customerId = customerId;
        ContractWindow.ContractDataBlock.setValues(Contract);
    },

    clearData: function () {
        ContractWindow.ContractDataBlock.clearValues();
        ContractWindow.data = null;
    },

    close: function () {
        ContractWindow.window.close();
    }

};