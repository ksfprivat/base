ContractWindow = {

    create: function (transactionType, customerTitle, customerId) {
        this.transactionType = transactionType;
        this.title = "Новый контракт";
        if (transactionType === TRANSACTION_UPDATE) this.title = "Контракт";

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

        this.contractDataBlock = DynamicForm.create({
            titleOrientation: "top",
            colWidths: ["100", "100"],
            numCols: 2,
            padding: 6,
            margin: 8,
            autoDraw: false,
            fields: [
                {name: "title", title: "Наименование", editorType:"ComboBoxItem"},

                {name: "type", title: "Тип", editorType:"ComboBoxItem",
                    valueMap: {
                        0:"аттестация", 1:"контроль", 2: "услуги", 3:"поставка"
                    }},
                {name: "date", title: "Дата", type: "date",  editorType: "DateItem", useTextField: true, textAlign:"left"},
                {name: "dateFinal", title: "Завершение", type: "date",  editorType: "DateItem", useTextField: true, textAlign:"left"},

                {name: "amount", title: "Сумма", type:"float", format:",0.00;", defaultValue: 0},
                {name: "costs", title: "Расходы", type:"float", format:",0.00;", defaultValue: 0},
                {name: "payment", title: "Оплата", type:"float", format:",0.00;"},
                {name: "datePayment", title: "Дата оплаты", type: "date",  editorType: "DateItem", useTextField: true, textAlign:"left"},
                {name: "status", title: "Статус", type: "text",editorType:"ComboBoxItem",
                    valueMap: {
                        0:"Подписание", 1:"Исполнение", 2: "Выполнен", 3:"Не действителен"
                    }},
                {name: "note", title: "Коментарии", type:"textArea", width:"100%", height:"120", colSpan:5}
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
            modalMaskOpacity:60,
            canDragReposition: false,
            items: [
                this.header,
                this.customerTitleBlock,
                this.contractDataBlock,
                this.controlsBlock
            ]
        });

        this.init();

        return Object.create(this);
    },

    init:function () {
        var contractSuffix = [
            "ВТ", "ВП", "ОИ",
            "К/ВТ", "К/ВП", "К/ОИ",
            "П/ВТ", "П/ВП", "П/ОИ",
            "У/ВТ", "У/ВП", "У/ОИ"
        ];
        var valueMap = [];
        var year = (((new Date()).getFullYear()).toString());

        getNewContractNumber(year, function (number) {
            for (var i = 0; i < contractSuffix.length; i++)
                valueMap[i] = (number+" "+contractSuffix[i]+"/"+year.substr(2,2));
            if (ContractWindow.transactionType === TRANSACTION_INSERT) {
                ContractWindow.contractDataBlock.setValue("title", valueMap[0]);
                ContractWindow.contractDataBlock.setValueMap("title", valueMap);
            }
        });
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
        if (ContractWindow.validate()) {
            var contract = ContractWindow.getData();
            contract.date = isDate(contract.date) ?
                dateToDateString(contract.date) : contract.date;
            contract.dateFinal = isDate(contract.dateFinal) ?
                dateToDateString(contract.dateFinal) : contract.dateFinal;
            contract.datePayment = isDate(contract.datePayment) ?
                dateToDateString(contract.datePayment) : contract.datePayment;


            contract.customerId = ContractWindow.customerId;
            console.log(contract);
            insertContract(contract, function (newContractId) {
                contract.id = newContractId;
                contractsCard.listGrid.addData(contract);
                contractsCard.setCurrentRecord(contract);
                navContractsGrid.insertItem(contract);
                addContractNode(contract);
                contractsCard.listGrid.setSort(contractsCard.listGrid.getSort());
            });
            ContractWindow.close();
        }
    },

    update: function () {
        if (ContractWindow.validate()) {
            // Prepare contract entity
            var contract = ContractWindow.contractDataBlock.getValues();
            contract.customerId = ContractWindow.customerId;
            contract.date =  isDate(contract.date) ?
                    dateToDateString(contract.date) : contract.date;
            contract.dateFinal = isDate(contract.dateFinal) ?
                    dateToDateString(contract.dateFinal) : contract.dateFinal;
            contract.datePayment = isDate(contract.datePayment) ?
                dateToDateString(contract.datePayment) : contract.datePayment;
            contract.department = null;
            contract.object = null;
            delete contract["customerByCustomerId"];

            // Update current record of listGrid
            var currentRecord = contractsCard.getRecordById(contract.id);
            Object.assign(currentRecord,  contract);

            updateContract(contract, function (success) {
                if (success) {
                    if (crmFrame.content.isVisible()) {
                        var rowNum = contractsCard.listGrid.getRowNum(contractsCard.listGrid.getSelectedRecord());
                        contractsCard.listGrid.setEditValues(rowNum, contract);
                        contractsCard.listGrid.refreshRow(rowNum);
                        navContractsGrid.updateItem(contract);
                    }
                    if (reportsFrame.content.isVisible())
                        ContractReport.updateRecord(contract);
                }
            });
            ContractWindow.close();
        }
    },

    validate: function () {
        var  requiredFields = ["title", "type", "date", "dateFinal", "amount", "status"];

        for (var i = 0; i < requiredFields.length; i++) {
            if (ContractWindow.contractDataBlock.getValue(requiredFields[i]) === undefined) {
                isc.warn("Необходимо заполнить поле: <b>" +ContractWindow.contractDataBlock.getField(requiredFields[i]).title+"</b>");
                return false;
            }
        }

        if (ContractWindow.contractDataBlock.getValue("date") > ContractWindow.contractDataBlock.getValue("dateFinal")) {
            isc.warn("Значение поля <b>Дата</b> должно быть раньше чем значение поля <b>Дата окончания</b>");
            return false;
        }
        if (!isDigit(ContractWindow.contractDataBlock.getValue("amount"))) {
            isc.warn("Не корректное значение полля <b>Сумма</b>");
            return false;
        }

        if (!isDigit(ContractWindow.contractDataBlock.getValue("costs"))) {
            isc.warn("Не корректное значение полля <b>Расходы</b>");
            return false;
        }

        if (typeof  ContractWindow.contractDataBlock.getValue("payment") !== "undefined")
            if (!isDigit(ContractWindow.contractDataBlock.getValue("payment"))) {
                isc.warn("Не корректное значение полля <b>Оплата</b>");
                return false;
            }

        return true;
    },

    getData: function () {
        return ContractWindow.contractDataBlock.getValues();
    },

    setData: function (contract, customerId) {
        ContractWindow.customerId = customerId;
        ContractWindow.contractDataBlock.setValues(contract);
        ContractWindow.contractDataBlock.setValue("date", new Date(contract.date));
        ContractWindow.contractDataBlock.setValue("dateFinal", new Date(contract.dateFinal));
        ContractWindow.contractDataBlock.setValue(null);
    },

    clearData: function () {
        ContractWindow.contractDataBlock.clearValues();
        ContractWindow.data = null;
    },

    close: function () {
        ContractWindow.window.close();
    }

};