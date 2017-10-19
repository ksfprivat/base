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
    HLayout.create({
        width: "100%",
        height: "100%"
    });
}

function createHeader() {
    return HTMLFlow.create({
        width: "100%",
        contents:
        "<div class='header'>" +
        "<div class='logo'><img src='/resources/img/logo2.png'/></div>"+
        "<div class='header_login'>"+
        "<img style='float: left' src='/resources/img/user_profile.png'>"+
        "<a class='header_text'>root@base.org</a>"+
        "</div>"+
        "</div>"
    });
}

function createFooter() {
    return HTMLFlow.create({
        width: "100%",
        contents:
        "<div class='footer'>" +
        "<a class='footer_text'>Base 2.0 Copyright (c) 2017</a>" +
        "</div>"
    });
}