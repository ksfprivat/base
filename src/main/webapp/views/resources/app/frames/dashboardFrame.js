DashboardFrame = {
    create: function () {

        this.content = HLayout.create({
            width: "100%",
            height: "100%",
            visibility:"hidden",
            backgroundColor:"#ffffff",
            align:"center",
            members:[
                DashboardFrame.page404()
            ]
        });

        return Object.create(this);
    },

    page404: function () {
        return (
            HTMLFlow.create({
                width: "100%", height:"100%",
                contents:
                "<div align='center' style='overflow: hidden'>"+
                     "<h1 align='center'><b>Sorry. This feature unavailable in this version</b></h1>"+
                     "<img align='center' src='"+imgDir+"/404.png'>"+
                     "<h3 align='center' style='color: #0b6ef9'><b>Релиз foxtrot.bravo</b></h3>"+
                "</div>"
                })
        );
    }
};