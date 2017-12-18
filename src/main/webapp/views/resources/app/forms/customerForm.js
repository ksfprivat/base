var CustomerForm  = {

    setData: function () {

    },

    cardExpand: function () {
        console.log("dfd");
    },

    create: function () {
         var header = HTMLFlow.create({
            contents:
            "<table class='cardBoxTitle'><tr>"+
            "<td><input id='cardBoxExpandButton' type='image' src='"+imgDir+"/ic_expand.png' class='img' onclick=cardExpand()></td>"+
            "<td width='100%'>Организация</td>"+
            "</tr></table>"
        });

       this.titleBlock = DynamicForm.create({
           width: "100%",
           numCols: 2,
           colWidths: [100, "*"],
           padding:6,
           margin: 8,
           autoDraw:false,
           fields: [
                {name: "title", title: "Сокращенное", type: "text", width:"100%"},
                {name: "titleFull", title: "Полное", type: "text", width:"100%"},
                {name: "address", title: "ИНН", type: "text", width:"200"}
            ]
        });

       this.addressBlock = DynamicForm.create({
            titleOrientation : "top",
            width: 500,
            numCols: 3,
            padding:6,
            margin: 8,
            autoDraw:false,
            fields: [
                {name: "postIndex", title: "Индекс", type: "text"},
                {name: "district", title: "Регион", type: "text"},
                {name: "region", title: "Область", type: "text"},
                {name: "city", title: "Город", type: "text"},
                {name: "address", title: "Улица", type: "text"},
                {name: "building", title: "Дом", type: "text"}
            ]
        });


       function blockTitle(title) {
           return HTMLFlow.create({
               contents: "<div class='cardBoxSectionTitle'>"+title+"</div><div class='cardBoxSeparator'/>"
           });}

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            autoDraw: false,
            members: [
                header,
                blockTitle("Наименование"),
                this.titleBlock,
                blockTitle("Адрес"),
                this.addressBlock
            ]
        });

       this.content.setStyleName("cardBox");
       return Object.create(this);
    }
};
