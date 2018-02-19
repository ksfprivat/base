CustomerForm = {

    create: function () {
        this.expanded = true;
        this.changed = false;
        this.data = null;
        this.viewMode = "card";

        this.contextMenu  = isc.Menu.create({
            ID: "menu",
            autoDraw: false,
            showShadow: true,
            imageSize:24,
            shadowDepth: 10,
            valueIconSize:24,
            data: [
                {title: "Экспорт в PDF", icon:imgDir+"/ic_pdf.png", click:CustomerForm.exportToPDF}
            ]
        });

        function createButton(icon, visible, title, event){
            return (
                IButton.create({
                    layoutAlign:"center",
                    iconAlign:"left",
                    iconSize: 24,
                    width: 24,
                    height: 24,
                    visibility: visible,
                    showDownIcon: false,
                    title:title,
                    icon: imgDir+"/"+icon,
                    showFocused: false,
                    baseStyle:"cardBoxToolButton",
                    click: event
            }));
        }

        this.btnExpand = createButton("ic_expand.png", "visible", null, CustomerForm.cardExpand);
        this.btnCommit = createButton("ic_commit.png", "hidden", null, CustomerForm.commitChanges);
        this.btnRollback = createButton("ic_rollback.png", "hidden", null, CustomerForm.rollbackChanges);

        this.btnMenu = createButton("ic_menu.png", "visible", null, function(){CustomerForm.menuBar.showMenu()});
        this.btnHideNotes = createButton("ic_expand.png", "hidden", null, CustomerForm.showNotes);
        this.btnNotesAlert = createButton("ic_info.png", "hidden", null, CustomerForm.showNotes);
        this.btnMaximize = createButton("ic_resize_max.png", "visible", null, CustomerForm.setPageViewMode);
        this.btnMinimize = createButton("ic_resize_min.png", "hidden", null,  CustomerForm.setCardViewMode);

        this.menuBar = MenuButton.create({
            title:"",
            width:1,
            height:24,
            menu:CustomerForm.contextMenu,
            baseStyle:"cardBoxToolButton"
        });

        this.spacer = VLayout.create({width:"6"});

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
               this.spacer,
               this.btnRollback,
               this.spacer,
               this.btnMaximize,
               this.btnMinimize,
               this.spacer,
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

       this.btnShowNotes =  IButton.create({
            layoutAlign:"left",
            iconAlign:"left",
            align:"left",
            iconSize: 24,
            padding:4,
            width: 150,
            showDownIcon: false,
            title:"Коментарии<img src='"+imgDir+"/ic_goto.png' style='vertical-align:middle'>",
            icon: imgDir+"/ic_note.png",
            showFocused: false,
            baseStyle:"cardBoxToolButton",
            click: CustomerForm.showNotes
        });

       this.notesBlockHeader = HLayout.create({
           width:"100%",
           members:[
                HLayout.create({width:"14"}),
                this.btnShowNotes,
                HLayout.create({width:"100%"}),
                this.btnNotesAlert,
                HLayout.create({width:"6"}),
                this.btnHideNotes,
                HLayout.create({width:"12"})
           ]
       });

        this.notesBlock = DynamicForm.create({
            colWidths: [1, "*"],
            numCols: 2,
            height: 120,
            padding: 6,
            margin: 8,
            cellPadding:0,
            length: 5000,
            showTitle: false,
            titleSuffix: null,
            colSpan: 2,
            autoDraw: false,
            visibility: "hidden",
            fields: [
                {name: "note", title: null, type:"textArea", width:"100%", height:"*"}
            ],
            itemChanged: this.fieldsChanged
        });

        function blockTitle(title) {
            return HTMLFlow.create({
                contents: "<div class='cardBoxSectionTitle'>" + title + "</div><div class='cardBoxSeparator'/>"
            });
        }

        this.footer = VLayout.create({height:"12"});

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            autoDraw: false,
            members: [
                this.header,
                blockTitle("Наименование"),
                this.titleBlock,
                blockTitle("Адрес"),
                this.addressBlock,
                this.notesBlockHeader,
                this.notesBlock,
                this.footer
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
        CustomerForm.notesBlock.setValue("note", this.data.note);
        CustomerForm.setChangeBlockState("hidden");
        if (this.data.note != null) { CustomerForm.btnNotesAlert.show();}
        else {CustomerForm.btnNotesAlert.hide();}
    },

    getData: function () {
      // Rewrite addressBlock values in titleBlock (merge values to Customer entity)
      var result = CustomerForm.titleBlock.getValues();
      var addressBlockFields = CustomerForm.addressBlock.getFields();
      for (var i = 0; i < addressBlockFields.length; i++) {
          result[addressBlockFields[i].name] = CustomerForm.addressBlock.getValue(addressBlockFields[i].name);
      }
      result["note"] = CustomerForm.notesBlock.getValue("note");
      return result;
    },

    fieldsChanged: function (item, newValue, oldValue) {
        if (newValue != oldValue) {
            CustomerForm.changed = true;
            CustomerForm.setChangeBlockState("visible");
        }
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
    },

    showNotes: function () {
        if (CustomerForm.notesBlock.visibility != "inherit") {
            CustomerForm.btnHideNotes.show();
            CustomerForm.notesBlock.show();
            CustomerForm.btnShowNotes.setTitle("Коментарии");
            CustomerForm.btnShowNotes.setWidth("130");
        } else {
            CustomerForm.btnHideNotes.hide();
            CustomerForm.notesBlock.hide();
            CustomerForm.btnShowNotes.setTitle("Коментарии<img src='" + imgDir + "/ic_goto.png' style='vertical-align:middle'>");
            CustomerForm.btnShowNotes.setWidth("150");
            if (CustomerForm.viewMode == "page") {
                console.log("gfgdf");
                CustomerForm.footer.setHeight("100%");
            } else CustomerForm.footer.setHeight("12");
        }
    },

     setPageViewMode: function () {
         CustomerForm.viewMode = "page";
         CustomerForm.btnMaximize.hide();
         CustomerForm.btnMinimize.show();
         if (!CustomerForm.expanded)
             CustomerForm.cardExpand();
         CustomerForm.btnExpand.hide();
         browserFrame.members.forEach(function (member) {
             if (member !=  CustomerForm.content) {
                 member.hide();
             }
         });
         CustomerForm.content.setHeight("100%");
         CustomerForm.notesBlock.setHeight("100%");
         CustomerForm.notesBlock.show();
     },

    setCardViewMode: function () {
        CustomerForm.viewMode = "card";
        CustomerForm.btnMaximize.show();
        CustomerForm.btnMinimize.hide();
        if (!CustomerForm.expanded)
            CustomerForm.cardExpand();
        CustomerForm.btnExpand.show();
        browserFrame.members.forEach(function (member) {
            if (member !=  CustomerForm.content) {
                member.show();
            }
        });
        CustomerForm.content.setHeight(300);
        CustomerForm.notesBlock.setHeight(120);
        CustomerForm.notesBlock.show();
    }
};


