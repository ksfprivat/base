const imgDir = "/resources/img/ui";
var appLqyout;

function createLayout() {
    VLayout.create({
        width: "100%",
        height:"100%",
        autoDraw:true,
        members:[
            createHeader(),
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
                createNavigationFrame(),
                createBrowserFrame()
        ]
    })
   );
}

// function separator() {
//     return VLayout.create({height:3});
// }


function createHeader() {
    return HTMLFlow.create({
        width: "100%",
        contents: getHeader()
    });
}

function createFooter() {
    return HTMLFlow.create({
        width: "100%",
        contents: getFooter()
    });
}