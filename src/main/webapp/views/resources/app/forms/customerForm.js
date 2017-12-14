var CustomerForm  = {

    create: function () {

       this.form = DynamicForm.create({
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

       this.title = HTMLFlow.create({
           contents: "<div class='cardBoxTitle'>Организация</div>"
       });

        this.sectionTitle =

        this.content = VLayout.create({
            width: "100%",
            autoDraw: false,
            members: [
                this.title,
                HTMLFlow.create({
                    contents: "<div class='cardBoxSectionTitle'>Наименование</div><div class='cardBoxSeparator'/>"
                }),
                this.form,
                HTMLFlow.create({
                    contents: "<div class='cardBoxSectionTitle'>Адрес</div><div class='cardBoxSeparator'/>"
                })
            ]
        });

       this.content.setStyleName("cardBox");
       return Object.create(this);
    },

    setData: function () {

    }
};
