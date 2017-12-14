var CustomerForm  = {

    create: function () {
       this.form = DynamicForm.create({
           width: "100%",
           numCols: 2,
           colWidths: [100, "*"],
           padding:12,
           margin: 16,
           autoDraw:false,
           fields: [
                {name: "title", title: "Наименование", type: "text", width:"100%"},
                {name: "titleFull", title: "Полное наименование", type: "text", width:"100%"},
                {name: "address", title: "Адрес", type: "text", width:"100%"}
            ]
        });

       this.form.setStyleName("cardBox");
       return Object.create(this);
    },

    setData: function () {

    }
};
