HelpFrame = {
    create: function () {

        this.content = HLayout.create({
            width: "100%",
            height: "100%",
            visibility:"hidden",
            overflow:"hidden",
            align:"center",
            members:[
                this.mainForm()
            ]
        });

        return Object.create(this);
    },

    mainForm: function () {
        return (
            HTMLFlow.create({
                width: "100%", height:"100%",
                overflow: "hidden",
                backgroundColor:"#ffffff",
                contents:
                "<div align='center' style='overflow: hidden'>"+
                "<div class='aboutBanner'></div>"+
                "<h1 align='center' style='color: #0b6ef9'><b>Build</b> "+buildString+"</h1><br>"+
                "<p>BASE. Customer relationship system. 2018. Zintur Ltd. Fedotovskih Konstantin</p>"+
                "<a href='/resources/html/index.html' target=\_blank\">Справочные материалы WikiBase</a>"+
                "</div>"
            })
        );
    }
};