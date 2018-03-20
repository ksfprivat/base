const imgDir = "/resources/img/ui";
var   header;
var   sideBar;
var   mainFrame;
var   crmFrame;
var   dashboardFrame;

function createLayout() {
    header   = Header.create();
    sideBar  = SideBarFrame.create();
    crmFrame = HLayout.create({
        width: "100%", height: "100%", autoDraw: false,
        overflow:"hidden",
        members:[
            createNavigationFrame(),
            createBrowserFrame()
        ]
    });
    crmFrame.content = crmFrame;

    dashboardFrame = DashboardFrame.create();
    DummyFrame.create();


    mainFrame = HLayout.create({
        width:  "100%",
        height: "100%",
        overflow: "hidden",
        members:[
            sideBar.content,
            dashboardFrame.content,
            crmFrame.content,
            DummyFrame.create().content,
            DummyFrame.create().content,
            DummyFrame.create().content,
            DummyFrame.create().content
        ]
    });
    // Main layout builder
    VLayout.create({
        width: "100%",
        height:"100%",
        autoDraw:true,
        members:[
            header.headerBar,
            mainFrame,
            createFooter()
        ]
    });
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