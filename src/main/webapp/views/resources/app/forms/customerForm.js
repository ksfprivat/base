CustomerForm = {

    create: function () {
        this.expanded = true;
        this.changed = false;
        this.data = null;


        this.contextMenu  = isc.Menu.create({
            ID: "menu",
            autoDraw: false,
            showShadow: true,
            imageSize:24,
            shadowDepth: 10,
            valueIconSize:24,
            data: [
                {title: "Экспорт в PDF", icon:imgDir+"/ic_export.png", click:CustomerForm.exportToPDF}
            ]
        });

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

        this.btnMenu = createButton("ic_menu.png", "visible", function(){CustomerForm.menuBar.showMenu()});

        this.menuBar = MenuButton.create({
            title:"",
            width:1,
            height:24,
            menu:CustomerForm.contextMenu,
            baseStyle:"cardBoxToolButton"
        });


        this.header = HLayout.create({
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
               this.btnMenu,
               this.menuBar
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
        for (var i = 1; i < CustomerForm.content.members.length; i++) {
            if (CustomerForm.expanded) {
                CustomerForm.content.members[i].hide();
                CustomerForm.content.setHeight(30);
                CustomerForm.btnExpand.setIcon(imgDir+"/ic_collapse.png");
            } else {
                CustomerForm.content.members[i].show();
                CustomerForm.content.setHeight(300);
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
     },

    clearData: function() {
        CustomerForm.titleBlock.clearValues();
        CustomerForm.addressBlock.clearValues();
    },

    exportToPDF:function() {

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
                }}
                ]};

        pdfMake.createPdf(docDef).open();
    }

};


