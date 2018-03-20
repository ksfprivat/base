const imgDir = "/resources/img/ui";
var   header;
var   sideBar;
var   crmFrame;
var   dashboardFrame;

function createLayout() {
    header   = Header.create();
    sideBar  = SideBarFrame.create();
    crmFrame = HLayout.create({
        width: "100%", height: "100%", autoDraw: false,
        members:[
            createNavigationFrame(),
            createBrowserFrame()
        ]
    });

    dashboardFrame = DashboardFrame.create();

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
                crmFrame,
                dashboardFrame.content
                // createNavigationFrame(),
                // createBrowserFrame()
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