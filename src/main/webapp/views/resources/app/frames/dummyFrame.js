DummyFrame = {
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
                "<h1 align='center' style='color: #0b6ef9'><b>404</b></h1>"+
                "<h2 align='center'>Sorry. This feature unavailable in this version</h2>"+
                "<img align='center' src='"+imgDir+"/404.png'>"+
                "</div>"
            })
        );
    }
};