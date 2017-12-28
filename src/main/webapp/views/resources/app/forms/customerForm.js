var CustomerForm;
CustomerForm = {

    create: function () {
        this.expanded = true;
        this.changed = false;
        this.data = null;
        this.header = HTMLFlow.create({
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td><input id='cardBoxExpandButton' title='Свернуть' type='image' src='" + imgDir + "/ic_expand.png' class='cardBoxHeaderButton' onclick='CustomerForm.cardExpand()'></td>" +
            "<td width='100%'>Организация</td>" +
            "<td><input id='cardBoxCommitChangesButton' title='Сохранить' type='image' src='" + imgDir + "/ic_commit.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='CustomerForm.commitChanges()'></td>" +
            "<td><input id='cardBoxRollbackChangesButton' title='Отменить' type='image' src='" + imgDir + "/ic_rollback.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='CustomerForm.rollbackChanges()'></td>" +
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
            ],

            itemChanged: this.fieldsChanged
        });

        this.addressBlock = DynamicForm.create({
            titleOrientation: "top",
            width: 500,
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
            ],

            itemChanged: this.fieldsChanged

        });


        function blockTitle(title) {
            return HTMLFlow.create({
                contents: "<div class='cardBoxSectionTitle'>" + title + "</div><div class='cardBoxSeparator'/>"
            });
        }

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            autoDraw: false,
            members: [
                this.header,
                blockTitle("Наименование"),
                this.titleBlock,
                blockTitle("Адрес"),
                this.addressBlock
            ]
        });

        this.content.setStyleName("cardBox");

        return Object.create(this);
    },

    setData: function (customer) {
        CustomerForm.changed = false;
        CustomerForm.data = customer;
        CustomerForm.titleBlock.setValues(this.data);
        CustomerForm.addressBlock.setValues(this.data);
        CustomerForm.setChangeBlockState("hidden");
    },

    getData: function () {
      // Rewrite addressBlock values in titleBlock (merge values to Customer entity)
      var result = CustomerForm.titleBlock.getValues();
      var addressBlockFields = CustomerForm.addressBlock.getFields();
      for (var i = 0; i < addressBlockFields.length; i++) {
          result[addressBlockFields[i].name] = CustomerForm.addressBlock.getValue(addressBlockFields[i].name);
      }
      return result;
    },

    fieldsChanged: function () {
        CustomerForm.changed = true;
        CustomerForm.setChangeBlockState("visible");
    },

    commitChanges: function () {
        CustomerForm.changed = false;
        CustomerForm.setChangeBlockState("hidden");
        CustomerForm.data = CustomerForm.getData();
        updateCustomer(CustomerForm.data, function (success) {
            if (success) refreshSelectedNode();
        })
    },

    rollbackChanges: function () {
        CustomerForm.setData(this.data);
    },

    cardExpand: function () {
        for (var i = 1; i < this.content.members.length; i++) {
            if (this.expanded) {
                this.content.members[i].hide();
                this.content.setHeight(30);
                $("#cardBoxExpandButton").attr("src", imgDir + "/ic_collapse.png");
            } else {
                this.content.members[i].show();
                this.content.setHeight(300);
                $("#cardBoxExpandButton").attr("src", imgDir + "/ic_expand.png");
            }
        }
        this.expanded = !this.expanded;
    },

    setChangeBlockState: function (state) {
        $("#cardBoxCommitChangesButton").attr("style", "visibility:" + state);
        $("#cardBoxRollbackChangesButton").attr("style", "visibility:" + state);
    }
};


