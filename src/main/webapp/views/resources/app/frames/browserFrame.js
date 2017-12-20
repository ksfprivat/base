var browserFrame;
var customerCard;

function createBrowserFrame() {

    var separator = VLayout.create({height:"16px"});
    customerCard = CustomerForm.create();
    browserFrame = VLayout.create({
        width: "100%",
        height: "100%",
        padding:8,
        margin: 8,
        border:0,
        overflow:"auto",
        styleName: "browserArea",
        members: [
            customerCard.content, separator
        ]
    });
    return browserFrame;
}