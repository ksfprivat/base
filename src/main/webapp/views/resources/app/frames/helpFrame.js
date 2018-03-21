HelpFrame = {
    create: function () {

        this.content = HLayout.create({
            width: "100%",
            height: "100%",
            visibility:"hidden",
            overflow:"hidden",
            align:"center",
            members:[
                this.page404()
            ]
        });

        return Object.create(this);
    },

    page404: function () {
        return (
            HTMLFlow.create({
                width: "100%", height:"100%",
                overflow: "hidden",
                backgroundColor:"#ffffff",
                contents:
                "<div align='center' style='overflow: hidden'>"+
                "<h1 align='center' style='color: #0b6ef9'><b>Help Frame</b></h1><br>"+
                "<a href='/resources/html/index.html' target=\_blank\">Справочные материалы</a>"+
                "</div>"
            })
        );
    }
};