const imgDir = "/resources/img/ui";
var   header;
var   sideBar;
var   mainFrame;
var   crmFrame;
var   dashboardFrame;
var   helpFrame;

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
    helpFrame = HelpFrame.create();

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
            helpFrame.content
        ]
    });
    // Main layout builder
    VLayout.create({
        width: "100%",
        height:"100%",
        overflow: "hidden",
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