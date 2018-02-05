CustomerForm = {

    create: function () {
        this.expanded = true;
        this.changed = false;
        this.data = null;
        // this.header = HTMLFlow.create({
        //     contents: "<table class='cardBoxTitle'><tr>" +
        //     "<td><input id='cardBoxExpandButton' title='Свернуть' type='image' src='" + imgDir + "/ic_expand.png' class='cardBoxHeaderButton' onclick='CustomerForm.cardExpand()'></td>" +
        //     "<td width='100%'>Организация</td>" +
        //     "<td><input id='cardBoxCommitChangesButton' title='Сохранить' type='image' src='" + imgDir + "/ic_commit.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='CustomerForm.commitChanges()'></td>" +
        //     "<td><input id='cardBoxRollbackChangesButton' title='Отменить' type='image' src='" + imgDir + "/ic_rollback.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='CustomerForm.rollbackChanges()'></td>" +
        //     "<td><input title='Экспорт' type='image' src='" + imgDir + "/ic_menu.png' class='cardBoxHeaderButton' onclick=''></td>" +
        //     "</tr></table>"
        // });


        function createButton(icon, visible, event){
            return (
                IButton.create({
                    layoutAlign:"center",
                    iconAlign:"left",
                    iconSize: 24,
                    width: 24,
                    height: 24,
                    visibility: visible,
                    showDownIcon: false,
                    title:null,
                    icon: imgDir+"/"+icon,
                    showFocused: false,
                    baseStyle:"cardBoxToolButton",
                    click: event
            }));
        }

        this.btnExpand = createButton("ic_expand.png", "visible", CustomerForm.cardExpand);
        this.btnCommit = createButton("ic_commit.png", "hidden", CustomerForm.commitChanges);
        this.btnRollback = createButton("ic_rollback.png", "hidden", CustomerForm.rollbackChanges);
        this.btnMenu = createButton("ic_menu.png", "visible");

        this.xHeader = HLayout.create({
           width:"100%",
           padding:10,
           members: [
               this.btnExpand,
               HTMLFlow.create({
                   width:"100%",
                   contents:"<div class='cardBoxTitle'>Организация</div>"
               }),
               this.btnCommit,
               this.btnRollback,
               this.btnMenu
           ]
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
                // this.header,
                this.xHeader,
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
            if (success) {
                refreshCustomerNode(CustomerForm.data);
                navContactsGrid.updateCustomerTitles(CustomerForm.data.id, CustomerForm.data.title);
            }
        })
    },

    rollbackChanges: function () {
        CustomerForm.setData(CustomerForm.data);
    },

    cardExpand: function () {
        for (var i = 2; i < CustomerForm.content.members.length; i++) {
            if (CustomerForm.expanded) {
                CustomerForm.content.members[i].hide();
                CustomerForm.content.setHeight(30);
                // $("#cardBoxExpandButton").attr("src", imgDir + "/ic_collapse.png");
                CustomerForm.btnExpand.setIcon(imgDir+"/ic_collapse.png");
            } else {
                CustomerForm.content.members[i].show();
                CustomerForm.content.setHeight(300);
                // $("#cardBoxExpandButton").attr("src", imgDir + "/ic_expand.png");
                CustomerForm.btnExpand.setIcon(imgDir+"/ic_expand.png");
            }
        }
        CustomerForm.expanded = !CustomerForm.expanded;
    },

    setChangeBlockState: function (state) {
        if (state == "visible") {
            CustomerForm.btnCommit.show();
            CustomerForm.btnRollback.show();
        } else {
            CustomerForm.btnCommit.hide();
            CustomerForm.btnRollback.hide();
        }

        // $("#cardBoxCommitChangesButton").attr("style", "visibility:" + state);
        // $("#cardBoxRollbackChangesButton").attr("style", "visibility:" + state);
    },

    clearData: function() {
        CustomerForm.titleBlock.clearValues();
        CustomerForm.addressBlock.clearValues();
    }

};


