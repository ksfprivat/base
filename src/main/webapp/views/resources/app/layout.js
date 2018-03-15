const imgDir = "/resources/img/ui";
var  header;

function createLayout() {
    header = Header.create();
    VLayout.create({
        width: "100%",
        height:"100%",
        autoDraw:true,
        members:[
            header.headerBar,
            createMainFrame(),
            createFooter()
        ]
    });
}

function createMainFrame() {
   return (
        HLayout.create({
            width:  "100%",
            height: "100%",
            members:[
                SideBarFrame.create().content,
                createNavigationFrame(),
                createBrowserFrame()
        ]
    })
   );
}

function createFooter() {
    return HTMLFlow.create({
        width: "100%",
        contents: getFooter()
    });
}

function afterLoad() {
    SplashWindow.window.close();
}