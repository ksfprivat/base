CRMScrollerFrame = {
    create:function () {


        function createButton(title, icon, visible, size, prompt, event){
            return (
                IButton.create({
                    layoutAlign:"center",
                    iconAlign:"center",
                    align:"center",
                    iconSize: 24,
                    width: size,
                    height: size,
                    margin:  3,
                    visibility: visible,
                    showDownIcon: false,
                    title:title,
                    icon: imgDir+"/"+icon,
                    showFocused: false,
                    prompt:prompt,
                    baseStyle:"scrollerButton",
                    click: event
                })
            );
        }

        function spacer(value) {return (VLayout.create({height:value}))}


        this.toolBar = VLayout.create({
            members:[
                createButton(null,"ic_domain.png", "visible", 30, "Организация", function () {
                    browserFrame.scrollToTop();
                }), spacer(10),
                createButton(null,"ic_contacts.png", "visible", 30, "Контакты", function () {

                }),spacer(10),
                createButton(null,"ic_currency-rub.png", "visible", 30,"Контракты", null),spacer(10)
            ]
        });


        this.content = VLayout.create({
            width:"24px", height:"100%", padding:0, margin:0,
            backgroundColor:"#eeeeee",
            members:[
                VLayout.create({height:"100%"}),
                this.toolBar,
                VLayout.create({height:"100%"})
            ]
        });

        return Object.create(this);
    }
};