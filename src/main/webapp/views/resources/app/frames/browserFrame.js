var browserFrame;
var customerCard;
var contactsCard;
var contractsCard;

function createBrowserFrame() {

    var separator = VLayout.create({height:"16px"});
    customerCard  = CustomerForm.create();
    contactsCard  = ContactsForm.create();
    contractsCard = ContractsForm.create();

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
            contactsCard.content,
            separator,
            contractsCard.content
        ]
    });
    return browserFrame;
}

function refreshBrowserFrame(customerId) {
    getCustomerById(customerId, function (customer) {
        customerCard.setData(customer);
        // Load contacts
        getContactsByCustomerId(customer.id, function(contacts){
            contactsCard.setData(contacts, customer.id);
            if ((getNavigationFrameMode() === VM_CUSTOMERS) &&
                (typeof navTreeSelectedNode !== "undefined" ) &&
                (navTreeSelectedNode.type === "contact"))
                    ContactsForm.setCurrentRecord(ContactsForm.getRecordById(navTreeSelectedNode.id));
            // Load contracts
            getContractsByCustomerId(customer.id, function (contracts) {
                contractsCard.setData(contracts, customer.id);

            switch (getNavigationFrameMode()){
                case VM_CUSTOMERS: // Customers (navTree event initiator)
                    if (typeof navTreeSelectedNode !== "undefined") {
                        if (navTreeSelectedNode.type === "contract")
                            ContractsForm.setCurrentRecord(ContractsForm.getRecordById(navTreeSelectedNode.id));
                    }
                    break;

                case VM_CONTACTS: // Customers (navContactsGrid event initiator)
                    if (navContactsGrid.currentRecord != null)
                        ContactsForm.setCurrentRecord(ContactsForm.getRecordById(navContactsGrid.currentRecord.id));
                    break;

                case VM_CONTRACTS: // Customers (navContractsGrid event initiator)
                    if (navContractsGrid.currentRecord != null)

                        ContractsForm.setCurrentRecord(ContractsForm.getRecordById(navContractsGrid.currentRecord.id));
                    break;
            }
            });
        });
});}