SplashWindow = {
    create: function() {
        this.window = isc.Window.create({
            width: 600,
            height:150,
            border: 0,
            bodyColor: '#1565c0',
            showHeaderIcon: false,
            isModal: true,
            autoCenter: true,
            autoSize: true,
            showHeader: false,
            showModalMask: true,
            canDragReposition: false,
            items: [
                isc.Img.create({
                    imageType: "stretch",
                    width: 600, height: 100,
                    src: "/resources/img/splash.png"

                }),
                HTMLFlow.create({
                    height:'100%',
                    width:"100%",
                    contents:[
                        "<div align = 'center' style='color: white; font-size: 16px'>Загрузка данных...</div>"
                    ]
                })

            ]
        });

        return Object.create(this);
    }
};