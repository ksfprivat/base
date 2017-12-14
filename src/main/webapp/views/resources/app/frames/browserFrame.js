var browserFrame;

function createBrowserFrame() {

    var customerForm = CustomerForm.create();

    return(
        VLayout.create({
        width: "100%",
        height: "100%",
        backgroundColor: "#EEEEEE",
        members: [
           customerForm.form,  customerForm.create().form
        ]
    }));

}