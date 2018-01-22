var  navTree;
var  navTreeData;
var  navTreeCache;
var  navTreeTabSet;
var  navTreeSelectedNode;
var  navContactsGrid;

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
                    contacts.forEach(function (customer) {
                        customer.type="contact";
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

function refreshSelectedNode(data) {
    navTreeSelectedNode.title = data.title;
    navTree.refreshRow(navTree.getRowNum(navTreeSelectedNode));
    onNodeClick(null, navTreeSelectedNode, null);
}

function onNodeClick(viewer, node, recordNum) {
    navTreeSelectedNode = node;
    if (!browserFrame.isVisible()) browserFrame.show();
    if (node.type == "customer") {
        getCustomerById(node.id, function (customer) {
            customerCard.setData(customer);
            getContactsByCustomerId(customer.id, function(contacts){
                contactsCard.setData(contacts);
            })
        });


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
                        id: "contacts_" + customers[i].id, parentId: customers[i].id,
                        title: "Контакты", name: "Контакты", icon:imgDir+"/ic_folder_contacts.png", isFolder: true, type: "contactsFolder", search: false
                    },
                    {
                        id: "contracts_" + customers[i].id, parentId: customers[i].id,
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
        nodeClick: onNodeClick,
        openFolder: onNavTreeOpenFolder
    });

    // navContactsGrid = NavContactsGrid.create();

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
             // {title: "КОНТАКТЫ",  pane: navContactsGrid.listGrid},
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
    //navContactsGrid.clearFilter();
}

function navTreeIsFiltered() {
    return $("#searchText").val().length != 0;
}


function navTreeAddButtonClick() {
    CustomerWindow.create(TRANSACTION_INSERT);
}

function navTreeDeleteButtonClick() {
    isc.ask("Вы хотите удалить: "+navTreeSelectedNode.title,
        {
            yesClick: function() {
                deleteCustomer(navTreeSelectedNode.id, function (success) {
                    if (success) {
                        navTreeData.remove(navTreeSelectedNode);
                        navTreeCache.removeData(navTreeSelectedNode);
                        browserFrame.hide();
                        console.log("Success deleting: "+navTreeSelectedNode.id);
                    }
                });
                return this.Super('yesClick', arguments);}}
    );
}

function navTreeEditButtonClick() {
   switch (navTreeSelectedNode.type) {
       case "customer":
           var customerWindow = CustomerWindow.create(TRANSACTION_UPDATE);
           getCustomerById(navTreeSelectedNode.id, function (customer) {
               customerWindow.setData(customer);
           });
           customerWindow.setData("Anna");
           break;
   }

}

function navTreeAddCustomerNode(node) {
    if (navTreeIsFiltered()) clearFilterNavTree();
    navTreeData.add(node, navTreeData.root);
    navTree.sort("title");
    navTree.deselectAllRecords();
    navTree.selectRecord(node);
    navTree.scrollToRow(navTree.getFocusRow());
    onNodeClick(null, node, null);
    navTreeCache.addData(node);
}

