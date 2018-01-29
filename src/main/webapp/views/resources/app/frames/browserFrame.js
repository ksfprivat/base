var browserFrame;
var customerCard;
var contactsCard;

function createBrowserFrame() {

    var separator = VLayout.create({height:"16px"});
    customerCard = CustomerForm.create();
    contactsCard = ContactsForm.create();
    browserFrame = VLayout.create({
        width: "100%",
        height: "100%",
        padding:8,
        margin: 8,
        border:0,
        autoDraw: false,
        visibility: "hidden",
        overflow:"auto",
        styleName: "browserArea",
        members: [
            customerCard.content,
            separator,
            contactsCard.content
        ]
    });
    return browserFrame;
}

function refreshBrowserFrame(customerId) {
    getCustomerById(customerId, function (customer) {
        customerCard.setData(customer);
        getContactsByCustomerId(customer.id, function(contacts){
            contactsCard.setData(contacts, customer.id);
            //var record = ContactsForm.getRecordById(navTreeSelectedNode.id);
            //ContactsForm.contactsGrid.deselectAllRecords();
            //ContactsForm.contactsGrid.selectRecord(record);
            ContactsForm.setCurrentRecord(ContactsForm.getRecordById(navTreeSelectedNode.id));
        });
    });

}