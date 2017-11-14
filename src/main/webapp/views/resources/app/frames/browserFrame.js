function createBrowserFrame() {
    var btn = Button.create({title:"MyButton",  height:50,
        baseStyle:"toolBtn",
        overflow:"visible",
        wrap:true

       });

    return (
       VLayout.create({
           width: "100%",
           height: "100%",
           members: [
               HTMLFlow.create({
                    width: "100%",
                    height: "100%",
                    contents: "<div class='dummy'><h1>BrowserFrame</h1></div>"
                }), btn

           ]
       })
    );

}