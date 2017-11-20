var  navTree;
var  navTreeData;
var  navTreeCache;
var  navTreeSearchForm;
var  navTreeTabSet;
var  navTreeSelectedNode;

var testContacts = [
    {title: "Bill", parentId: 730},
    {title: "Gregory", parentId: 730},
    {title: "Sergei", parentId: 730},
    {title: "Larry", parentId: 730},
    {title: "Melissa", parentId: 730}
];


function createNavigationFrame() {
    return (
        VLayout.create({
            width: "320",
            height: "100%",
            minWidth: 320,
            showResizeBar: true,
            members: [
                createNavTreeToolbar(),
                createSearchBar(),
                createNavTreeSearchBar(),
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
                showFocused: false
            }),
            ToolStripButton.create({
                ID: "btnDelete",
                iconSize: 24,
                showDownIcon: false,
                title:"Удалить",
                icon: imgDir+"/ic_delete.png",
                showFocused: false
            }),
            ToolStripButton.create({
                ID: "btnEdit",
                iconSize: 24,
                showDownIcon: false,
                title:"Изменить",
                icon: imgDir+"/ic_edit.png",
                showFocused: false
            })
        ]
    }));
}

function openAllFolders() {
    // console.log(navTree.getData().getAllNodes());
    navTree.setDataSource(navTreeCache);
    navTree.filterData(null);
}

function createNavTreeSearchBar() {

   navTreeSearchForm = DynamicForm.create({
       numRows:1,
       width: "100%",
       titleWidth:3,
       padding: 6,
       autoDraw: false,
       titleSuffix:"",
       items: [
        {type: "text", name: "filterEdit", title: null, hint: "Поиск", width: "*", showHintInField:true, changed:onNavTreeFilterApply}
       ]
    });

    return (
        HLayout.create({
            width:"100%",
            members:[
                Img.create({imageType: "normal", width:"30", padding: 10,  src: imgDir+"/ic_search.png"}),
                navTreeSearchForm
            ]
        })
    );
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

   // if (!navTreeIsFiltered())

        switch (node.type) {
            case  "contacts":
                getContactNodesByCustomerId(node.parentId, function (contacts) {
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

function onNodeClick(viewer, node, recordNum) {
    navTreeSelectedNode = node;
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
                        title: "Контакты", name: "Контакты", icon:imgDir+"/ic_folder_contacts.png", isFolder: true, type: "contacts", search: false
                    },
                    {
                        id: "contracts_" + customers[i].id, parentId: customers[i].id,
                        title: "Контракты", name: "Контракты", isFolder: true, type: "contracts", search: false
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
    navTree.showLoadingIcons = false;
    // navTreeTabSet = TabSet.create({
    //     width: "100%",
    //     height: "100%",
    //     border: 0,
    //     padding:0,
    //     margin:0,
    //     tabs: [
    //         {title: "ОРГАНИЗАЦИИ", pane: navTree},
    //         {title: "КОНТАКТЫ", pane: navTree},
    //         {title: "КОНТРАКТЫ", pane: navTree}]
    // });

    return navTree;
    // return navTreeTabSet;
}

function setFilterNavTree(filter) {
    navTree.setDataSource(navTreeCache);
    navTree.filterData(filter);
}

function clearFilterNavTree() {
    navTree.filterData(null);
    //navTreeSearchForm.resetValues();
    $("#searchText").val("");
    navTree.setData(navTreeData);
}

function navTreeIsFiltered() {
    //var filter = navTreeSearchForm.getValue("filterEdit");
    var filter = $("#searchText").val();
    return filter !== null && filter !== undefined;

}

function onNavTreeFilterApply() {
    if (navTreeIsFiltered()) {
        setFilterNavTree({title: navTreeSearchForm.getValue("filterEdit"), search: true});
    } else {
        clearFilterNavTree();
    }
}