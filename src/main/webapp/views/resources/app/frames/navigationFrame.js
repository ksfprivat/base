var  navTree;
var  navTreeData;
var  navTreeCache;
var  navTreeTabSet;
var  navTreeSelectedNode;
var  navContactsGrid;
var  navContractsGrid;
var  navTreeCurrentCustomerId;

// View modes (Customers/Contacts/Contracts)
const VM_CUSTOMERS       = 7777;
const VM_CONTACTS        = 7778;
const VM_CONTRACTS       = 7779;


function createNavigationFrame() {
     return (
        VLayout.create({
            width: 334,
            height: "100%",
            minWidth: 334,
            backgroundColor: "#1565c0",
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
        case 1: return VM_CONTACTS;
        case 2: return VM_CONTRACTS;
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
            case "customer":
                if (typeof node.children === "undefined") {
                    navTreeData.addList(createBaseFolders(node), node)
                }
                break;
            case  "contactsFolder":
                getContactNodesByCustomerId(node.parentId, function (contacts) {
                    // Add type property for each objects in array
                    contacts.forEach(function (contact) {
                        contact.type = "contact";
                        if (contact.favorite === 1) contact.icon = imgDir+"/ic_contact_star.png";
                        contact.sortField = contact.title;
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
            case "contractsFolder":
                getContractNodesByCustomerId(node.parentId, function (contracts) {
                    // Add type property for each objects in array
                    contracts.forEach(function (contract) {
                        contract.type="contract";
                        contract.icon = imgDir+"/ic_contract.png";
                        contract.sortField = reversTimestamp(contract.date);
                        contract.customerId = node.parentId;
                    });
                    if (!navTreeIsFiltered()) {
                        navTreeData.unloadChildren(node);
                        navTreeData.addList(contracts, node);
                    } else {
                        openFilteredNode(node,contracts);
                    }
                });
                break;
        }
    navTree.getData().openFolder(node);
}

function addContactNode(customerId, contact) {
    var folder = navTreeData.findById("contacts_"+customerId);
        if (typeof folder !== "undefined") {
            var node = {
                id: contact.id,
                customerId: customerId,
                title: contact.name,
                name: contact.name,
                type: "contact",
                sortField: contact.name
            };
            navTreeData.add(node, folder);
        }
}

function addContractNode(contract) {
    var folder = navTreeData.findById("contracts_"+contract.customerId);
    if (typeof folder !== "undefined") {
        var node={
            id: contract.id,
            customerId: contract.customerId,
            title: contract.title,
            name: contract.title,
            icon : imgDir+"/ic_contract.png",
            type :"contract",
            sortField: reversTimestamp(contract.date)
        };
        navTreeData.add(node, folder);
     }
}

function deleteNode(id) {
    var node =  navTreeData.findById(id);

    if (typeof node !== "undefined") {
        navTreeData.remove(node);
    }
}

function changeNodeTitle(id, title) {
    var node = navTreeData.findById(id);
    if (typeof node !== "undefined") {
         if (navTree.getRowNum(node) > 0) {
            node.title = title;
            node.sortField = title;
            navTree.refreshRow(navTree.getRowNum(node));
         }
    }
}

function selectNode(id) {
    var node = navTreeData.findById(id);
    if (navTreeData.isOpen(navTreeData.getParent(node))) {
        if (typeof node !== "undefined") {
            navTree.deselectAllRecords();
            navTree.selectRecord(node);
            navTree.scrollToRow(navTree.getFocusRow());
        }
    }
}

function refreshCustomerNode(data) {
    if (navTreeSelectedNode.type === "customer") {
//  Refresh for TreeData
        var customerNode = navTree.data.findById(data.id);
        customerNode.title = data.title;
        customerNode.sortField = data.title;
        navTree.refreshRow(navTree.getRowNum(customerNode));
//  Refresh for TreeCache
        customerNode = navTreeData.findById(data.id);
        customerNode.title = data.title;
        customerNode.sortField = data.title;
        navTree.refreshRow(navTree.getRowNum(customerNode));
    }
}

function onNodeClick(viewer, node, recordNum) {
    navTreeSelectedNode = node;
    if (!browserFrame.isVisible()) browserFrame.show();
    if (node.type === "customer") {
        if (navTreeCurrentCustomerId !== node.id) {
            refreshBrowserFrame(node.id);
            navTreeCurrentCustomerId = node.id;
        }
    } else {
        if (navTreeCurrentCustomerId !== node.customerId) {
            refreshBrowserFrame(node.customerId);
            navTreeCurrentCustomerId = node.customerId;
        }

        switch (navTreeSelectedNode.type) {
            case "contact":
                 ContactsForm.setCurrentRecord(ContactsForm.getRecordById(navTreeSelectedNode.id));
                break;
            case "contract":
                ContractsForm.setCurrentRecord(ContractsForm.getRecordById(navTreeSelectedNode.id));
                break;
        }
    }
}

function createBaseFolders(customer) {
    return(
        [
            {
                id: "contacts_" +customer.id, parentId: customer.id, customerId: customer.id,
                title: "Контакты", name: "Контакты", icon:imgDir+"/ic_folder_contacts.png", isFolder: true, type: "contactsFolder", search: false, sortField:0
            },
            {
                id: "contracts_" + customer.id, parentId: customer.id, customerId: customer.id,
                title: "Контракты", name: "Контракты", isFolder: true, type: "contractsFolder", search: false, sortField:1
            },
            {
                id: "objects_" + customer.id, parentId: customer.id, customerId: customer.id,
                title: "Объекты", name: "Объекты", isFolder: true, type: "objectsFolder", search: false,  sortField:2
            }
        ]
    );
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
                sortField: customers[i].title,
                type: "customer",
                children: createBaseFolders(customers[i])
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

    navTree = TreeGrid.create({
        height: "100%",
        fields: [
                {name:"title", title:"Наименование"},
                {name: "sortField", title:"sortField", hidden:true}
            ],
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
        sortField: "sortField",
        nodeClick: onNodeClick,
        openFolder: onNavTreeOpenFolder
    });

    navContactsGrid = NavContactsGrid.create();
    navContractsGrid = NavContractsGrid.create();

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
             {title: "ОРГАНИЗАЦИИ", pane: navTree, tabSelected:function () {
                     $("#searchText").val("");
                 }},
             {title: "КОНТАКТЫ",  pane: navContactsGrid.listGrid, tabSelected:function () {
                     $("#searchText").val("");
                     setFilterNavTree(null);
                 }},
             {title: "КОНТРАКТЫ", pane: navContractsGrid.listGrid, tabSelected:function () {
                     $("#searchText").val("");
                     navContractsGrid.setFilter("");
                 }}]
     });
   loadNavTreeData();
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
        case 2: // Contracts
            navContractsGrid.setFilter(filter);
            break;
    }
}

function clearFilterNavTree() {
   if (navTreeTabSet.getSelectedTabNumber() !== 0)
       navTree.setDataSource(navTreeCache);
    navTree.filterData(null);
    $("#searchText").val("");
    $("#navBarSearchTextClearButton").attr("style", "visibility:hidden");
    navTree.setData(navTreeData);
    navContactsGrid.clearFilter();
    navContractsGrid.clearFilter();
}

function navTreeIsFiltered() {
    return $("#searchText").val().length !== 0;
}


function navTreeAddButtonClick() {
    if (getNavigationFrameMode() === VM_CUSTOMERS)
        switch (navTreeSelectedNode.type) {
            case "customer":
                CustomerWindow.create(TRANSACTION_INSERT);
                break;
            case "contactsFolder":
            case "contact":
                ContactWindow.create(TRANSACTION_INSERT, customerCard.getData().title)
                    .setData({}, navTreeSelectedNode.customerId);
                break;
            case "contractsFolder":
            case "contract":
                ContractWindow.create(TRANSACTION_INSERT, customerCard.getData().title)
                    .setData({date:new Date(), dateFinal: new Date()}, ContractsForm.customerId );
                break;

    }

    if (getNavigationFrameMode() === VM_CONTACTS) {
        if (customerCard.data != null) {
            ContactWindow.create(TRANSACTION_INSERT, customerCard.getData().title)
                .setData({}, ContactsForm.customerId );
        } else isc.warn("Организация не выбрана");
    }

    if (getNavigationFrameMode() === VM_CONTRACTS) {
        if (customerCard.data != null) {
            ContractWindow.create(TRANSACTION_INSERT, customerCard.getData().title)
                .setData({date:new Date(), dateFinal: new Date()}, ContractsForm.customerId );
        } else isc.warn("Организация не выбрана");
    }
}

function deleteNavTreeNode() {
    if (typeof  navTreeSelectedNode === "undefined") {
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
                                customerCard.clearData();
                                browserFrame.hide();
                            }
                        });
                        break;

                    case "contact":
                        deleteContact(navTreeSelectedNode.id, function (success) {
                            if (success) {
                                var record  = ContactsForm.getRecordById(navTreeSelectedNode.id);
                                deleteNode(navTreeSelectedNode.id);
                                if (!!record)
                                    ContactsForm.contactsGrid.removeData(record);
                            }
                        });
                        break;
                    case "contract":
                        deleteContract(navTreeSelectedNode.id, function (success) {
                            if (success) {
                                var record  = ContractsForm.getRecordById(navTreeSelectedNode.id);
                                deleteNode(navTreeSelectedNode.id);
                                if (!!record)
                                    ContractsForm.listGrid.removeData(record);
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
        case VM_CONTRACTS:
            navContractsGrid.deleteItem();
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
        case "contract":
            var contractWindow = ContractWindow.create(TRANSACTION_UPDATE, customerCard.getData().title);
            getContractById(navTreeSelectedNode.id, function (contract) {
                contractWindow.setData(contract, navTreeSelectedNode.customerId);
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
        case VM_CONTRACTS:
            navContractsGrid.editItem();
            break;
    }
}

function navTreeAddCustomerNode(node) {
    if (navTreeIsFiltered()) clearFilterNavTree();
    navTreeData.sortByProperty("sortField");
    navTreeData.add(node, navTreeData.root);
    navTree.deselectAllRecords();
    navTree.selectRecord(node);
    navTree.scrollToRow(navTree.getFocusRow());
    onNodeClick(null, node, null);
    navTreeCache.addData(node);
}

