function createLayout() {
    VLayout.create({
        width: "100%",
        height:"100%",
        members:[
            createHeader(),
            createMainFrame(),
            createFooter()
        ]
    });
    console.info("Create Layout");
}

function createMainFrame() {

    return HTMLFlow.create(
      {
        width: "100%",
        height: "100%",
        contents: "<h1>Hello World !</h1>"
    });
}

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