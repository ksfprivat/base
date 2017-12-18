var browserFrame;

function createBrowserFrame() {

    var customerForm = CustomerForm.create();
    var separator = VLayout.create({height:"16px"});

    return(
        VLayout.create({
        width: "100%",
        height: "100%",
        padding:8,
        margin: 8,
        border:0,
        overflow:"auto",
            styleName: "browserArea",
        members: [
           customerForm.content, separator,
           customerForm.create().content
        ]
    }));

}