const imgDir = "/resources/img/ui";
var   header;
var   sideBar;

function createLayout() {
    header  = Header.create();
    sideBar = SideBarFrame.create();
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
                sideBar.content,
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