var browserFrame;

function createBrowserFrame() {

    var customerForm = CustomerForm.create();
    var separator = VLayout.create({height:"16px"});

    return(
        VLayout.create({
        width: "100%",
        height: "*",
        padding:8,
        margin: 8,
        backgroundColor: "#EEEEEE",
        members: [
           customerForm.content, separator,
           customerForm.create().content
        ]
    }));

}