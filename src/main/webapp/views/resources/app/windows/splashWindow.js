SplashWindow = {
    create: function() {
        this.window = isc.Window.create({
            width: 600,
            height:150,
            border: null,
            // bodyColor: '#1565c0',
            showHeaderIcon: false,
            isModal: true,
            autoCenter: true,
            autoSize: true,
            showHeader: false,
            showModalMask: true,
            modalMaskOpacity:100,
            modalMaskStyle:"splashBackground",
            canDragReposition: false,
            items: [
                Img.create({
                    width: 600, height: 300,
                    src: "/resources/img/splash.png"

                }),
                HTMLFlow.create({
                    height:'100%',
                    width:"100%",
                    layoutAlign:"center",
                    contents:[
                        "<br><div align = 'center' style='color: #7D7D7D; font-size: 16px'>Загрузка данных...</div>"+
                        "<br><div align = 'center' style='color: #7D7D7D; font-size: 10px'>BASE CRM Customer Relationship Management System."+"" +
                        "<br>Copyright (c) 2018 Fedotovskih Konstantin</div>"
                    ]
                })

            ]
        });

        return Object.create(this);
    }
};