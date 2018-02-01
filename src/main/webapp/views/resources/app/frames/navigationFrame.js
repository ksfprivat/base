var  navTree;
var  navTreeData;
var  navTreeCache;
var  navTreeTabSet;
var  navTreeSelectedNode;
var  navContactsGrid;
var  navTreeCurrentCustomerId;

// View modes (Customers/Contacts/Contracts)
const VM_CUSTOMERS   = 7777;
const VM_CONTACTS    = 7778;


function createNavigationFrame() {
     return (
        VLayout.create({
            width: 334,
            height: "100%",
            minWidth: 334,
            showResizeBar: true,
            members: [
                createNavTreeToolbar(),
                createSearchBar(),
                createNavTree()
            ]
        })
    );
}

function getNavigationFrameMode() {
    switch (navTreeTabSet.getSelectedTabNumber()) {
        case 0: return VM_CUSTOMERS;
            break;
        case 1: return VM_CONTACTS;
            break;
    }
}

function createNavTreeToolbar() {
    return (ToolStrip.create({
        height:24,
        border:0,
        layoutMargin: 3,
        members: [
            ToolStripButton.create({
                ID: "btnAdd",
                iconSize: 24,
                showDownIcon: false,
                title:"Добавить",
                icon: imgDir+"/ic_add.png",
                showFocused: false,
                click: navTreeAddButtonClick
            }),
            ToolStripButton.create({
                ID: "btnDelete",
                iconSize: 24,
                showDownIcon: false,
                title:"Удалить",
                icon: imgDir+"/ic_delete.png",
                showFocused: false,
                click: navTreeDeleteButtonClick
            }),
            ToolStripButton.create({
                ID: "btnEdit",
                iconSize: 24,
                showDownIcon: false,
                title:"Изменить",
                icon: imgDir+"/ic_edit.png",
                showFocused: false,
                click: navTreeEditButtonClick
            })
        ]
    }));
}

function openFilteredNode(node, data) {
    var parent = navTreeData.getParent(node);
    navTree.setData(navTreeData);
    clearFilterNavTree();
    navTree.selectRecord(parent);
    navTree.scrollToRow(navTree.getFocusRow());
    navTree.getData().openFolder(parent);
    navTree.selectRecord(node);
    navTreeData.unloadChildren(node);
    navTreeData.addList(data, node);
    navTree.getData().openFolder(node);
    navTree.deselectRecord(parent);
}

function onNavTreeOpenFolder(node) {
        switch (node.type) {
            case  "contactsFolder":
                getContactNodesByCustomerId(node.parentId, function (contacts) {
                    // Add type property for each objects in array
                    contacts.forEach(function (contact) {
                        contact.type="contact";
                        contact.customerId = node.parentId;
                    });
                    if (!navTreeIsFiltered()) {
                        navTreeData.unloadChildren(node);
                        navTreeData.addList(contacts, node);
                    } else {
                        openFilteredNode(node,contacts);
                    }
                });
                break;
        }
    navTree.getData().openFolder(node);
}

function addContactNode(customerId, contact) {
    var folder = navTreeData.findById("contacts_"+customerId);

    if (typeof folder != "undefined") {
        var node={
            id: contact.id,
            customerId: customerId,
            title: contact.name,
            name: contact.name,
            type :"contact"
        };
        navTreeData.add(node, folder);
    }
}

function deleteContactNode(id) {
    var node =  navTreeData.findById(id);

    if (typeof node != "undefined") {
        navTreeData.remove(node);
    }
}

function changeNodeTitle(id, title) {
    var node = navTreeData.findById(id);
    if (typeof node != "undefined") {
         if (navTree.getRowNum(node) > 0) {
            node.title = title;
            navTree.refreshRow(navTree.getRowNum(node));
         }
    }
}

function refreshCustomerNode(data) {
    if (navTreeSelectedNode.type == "customer") {
        navTreeSelectedNode.title = data.title;
        navTree.refreshRow(navTree.getRowNum(navTreeSelectedNode));
    } else {
        var customerNode = navTreeData.findById(navTreeSelectedNode.customerId);
        customerNode.title = data.title;
        navTree.refreshRow(navTree.getRowNum(customerNode));
    }
}

function onNodeClick(viewer, node, recordNum) {
    navTreeSelectedNode = node;
    if (!browserFrame.isVisible()) browserFrame.show();
    if (node.type == "customer") {
        if (navTreeCurrentCustomerId != node.id) {
            refreshBrowserFrame(node.id);
            navTreeCurrentCustomerId = node.id;
        }
    } else {
        if (navTreeCurrentCustomerId != node.customerId) {
            refreshBrowserFrame(node.customerId);
            navTreeCurrentCustomerId = node.customerId;
        }

        switch (navTreeSelectedNode.type) {
            case "contact":
                ContactsForm.setCurrentRecord(ContactsForm.getRecordById(navTreeSelectedNode.id));
                break;
        }
    }
}

function loadNavTreeData() {
    getCustomerNodes(function (customers) {
        var nodes = [];

        for (var i = 0; i < customers.length; i++) {
            nodes[i] = {
                title: customers[i].title,
                name: customers[i].title,
                id: customers[i].id,
                isFolder: true,
                type: "customer",
                children: [
                    {
                        id: "contacts_" + customers[i].id, parentId: customers[i].id, customerId: customers[i].id,
                        title: "Контакты", name: "Контакты", icon:imgDir+"/ic_folder_contacts.png", isFolder: true, type: "contactsFolder", search: false
                    },
                    {
                        id: "contracts_" + customers[i].id, parentId: customers[i].id, customerId: customers[i].id,
                        title: "Контракты", name: "Контракты", isFolder: true, type: "contractsFolder", search: false
                    }
                ]
            };
        }
        // Tree Data
        navTreeData = Tree.create({data: nodes});

        // Tree Cache - for enable filtering
        navTreeCache = DataSource.create({
            fields: [
                {name: "id", title: "id", primaryKey: true},
                {name: "title", title: "Наименование"}],
            clientOnly: true,
            cacheData: nodes
        });
        navTree.setData(navTreeData);

        // Set first node
        // navTree.selectRecord(0);
        // onNodeClick(null, navTreeData.root.children[0], null);
        navTreeSelectedNode = navTreeData.root.children[0];
    });
}

function createNavTree() {
    loadNavTreeData();
    navTree = TreeGrid.create({
        height: "100%",
        fields: [{name:"title", title:"Наименование"}],
        iconSize: 22,
        autoDraw: false,
        border:0,
        folderIcon: imgDir+"/ic_folder.png",
        nodeIcon: imgDir+"/ic_contact.png",
        showOpenIcons:false,
        showDropIcons:false,
        closedIconSuffix:"",
        alwaysShowOpener: true,
        showEmptyMessage: false,
        showLoadingIcons:false,
        showHeader: false,
        loadDataOnDemand: false,
        sortField: "title",
        nodeClick: onNodeClick,
        openFolder: onNavTreeOpenFolder
    });

    navContactsGrid = NavContactsGrid.create();

    navTreeTabSet = TabSet.create({
        width: "100%",
        height: "100%",
        styleName:"tabSet",
        showTabScroller:false,
        showTabPicker:false,
        showTabContextMenu:false,
        autoDraw: false,
        defaultTabWidth:100,
        paneMargin:0,
            tabs: [
             {title: "ОРГАНИЗАЦИИ", pane: navTree},
             {title: "КОНТАКТЫ",  pane: navContactsGrid.listGrid},
             {title: "КОНТРАКТЫ", pane: null}]
     });

   return navTreeTabSet;
}

function setFilterNavTree(filter) {
    switch (navTreeTabSet.getSelectedTabNumber()) {
        case 0: // Companies
            navTree.setDataSource(navTreeCache);
            navTree.filterData(filter);
            break;
        case 1: // Contacts
            navContactsGrid.setFilter(filter);
            break;
    }
}

function clearFilterNavTree() {
   if (navTreeTabSet.getSelectedTabNumber() != 0)
       navTree.setDataSource(navTreeCache);
    navTree.filterData(null);
    $("#searchText").val("");
    $("#navBarSearchTextClearButton").attr("style", "visibility:hidden");
    navTree.setData(navTreeData);
    navContactsGrid.clearFilter();
}

function navTreeIsFiltered() {
    return $("#searchText").val().length != 0;
}


function navTreeAddButtonClick() {
    if (getNavigationFrameMode() == VM_CUSTOMERS)
        switch (navTreeSelectedNode.type) {
            case "customer":
                CustomerWindow.create(TRANSACTION_INSERT);
                break;
            case "contactsFolder":
            case "contact":
                ContactWindow.create(TRANSACTION_INSERT, customerCard.getData().title)
                    .setData({}, navTreeSelectedNode.customerId);
                break;
    }

    if (getNavigationFrameMode() == VM_CONTACTS) {
        ContactWindow.create(TRANSACTION_INSERT, customerCard.getData().title)
            .setData({}, ContactsForm.customerId );
    }
}

function deleteNavTreeNode() {
    if (typeof  navTreeSelectedNode == "undefined") {
        isc.warn("Необходимо выбрать данные");
        return;
    }

    if (navTreeSelectedNode.type.includes("Folder")){
        isc.warn("Невозможно удалить базовый каталог");
        return;
    }
    isc.ask("Вы хотите удалить: "+navTreeSelectedNode.title,
        {
            yesClick: function() {
                switch (navTreeSelectedNode.type) {
                    case "customer":
                        deleteCustomer(navTreeSelectedNode.id, function (success) {
                            if (success) {
                                navTreeData.remove(navTreeSelectedNode);
                                navTreeCache.removeData(navTreeSelectedNode);
                                browserFrame.hide();
                            }
                        });
                        break;

                    case "contact":
                        deleteContact(navTreeSelectedNode.id, function (success) {
                            if (success) {
                                var record  = ContactsForm.getRecordById(navTreeSelectedNode.id);
                                deleteContactNode(navTreeSelectedNode.id);
                                if (!!record)
                                    ContactsForm.contactsGrid.removeData(record);
                            }
                        });
                        break;
                }
                return this.Super('yesClick', arguments);}
        }
    );
}

function navTreeDeleteButtonClick() {
    switch (getNavigationFrameMode()) {
        case VM_CUSTOMERS: deleteNavTreeNode();
            break;
        case VM_CONTACTS:
            navContactsGrid.deleteItem();
            break;
    }
}

function editNavTreeNode() {
    if (navTreeSelectedNode.type.includes("Folder")){
        isc.warn("Невозможно редактировать базовый каталог");
        return;
    }

    switch (navTreeSelectedNode.type) {
        case "customer":
            var customerWindow = CustomerWindow.create(TRANSACTION_UPDATE);
            getCustomerById(navTreeSelectedNode.id, function (customer) {
                customerWindow.setData(customer);
            });
            break;
        case "contact":
            var contactWindow = ContactWindow.create(TRANSACTION_UPDATE, customerCard.getData().title);
            getContactById(navTreeSelectedNode.id, function (contact) {
                contactWindow.setData(contact, navTreeSelectedNode.customerId);
            });
            break;
    }
}

function navTreeEditButtonClick() {
    switch (getNavigationFrameMode()) {
        case VM_CUSTOMERS: editNavTreeNode();
            break;
        case VM_CONTACTS:
            navContactsGrid.editItem();
            break;
    }
}

function navTreeAddCustomerNode(node) {
    if (navTreeIsFiltered()) clearFilterNavTree();
    navTreeData.add(node, navTreeData.root);
    navTree.deselectAllRecords();
    navTree.selectRecord(node);
    navTree.scrollToRow(navTree.getFocusRow());
    onNodeClick(null, node, null);
    navTreeCache.addData(node);
}

