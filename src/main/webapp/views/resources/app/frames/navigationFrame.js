var  navTree;
var  navTreeData;
var  navTreeCache;
var  navTreeSearchForm;
var  selectedNode;

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
            width: 280,
            height: "100%",
            showResizeBar: true,
            members: [
                createNavTreeToolbar(),
                createNavTreeSearchBar(),
                createNavTree()
            ]
        })
    );
}

function createNavTreeToolbar() {
    return (
        HLayout.create({
           width:"100%",
           members:[
               Button.create({title: "Filter", width:"80", click:setFilterNavTree}),
               Button.create({title: "Clear", width:"80",  click: clearFilterNavTree}),
               Button.create({title: "Open All", width:"80", click: openAllFolders})
           ]
        })
    );
}

function openAllFolders() {
    // console.log(navTree.getData().getAllNodes());
    navTree.setDataSource(navTreeCache);
    navTree.filterData(null);
}

function createNavTreeSearchBar() {
   navTreeSearchForm = DynamicForm.create({
       numRows: 0,
       autoDraw: false,
       items: [
           {type: "text", name: "filterEdit", title: "Filter"}
       ],
       keyUp: onNavTreeFilterApply
    });
   
    return (
        HLayout.create({
            width:"100%",
            members:[
                navTreeSearchForm
            ]
        })

    );
}


function onNavTreeOpenFolder(node) {

   // if (!navTreeIsFiltered())

        switch (node.type) {
            case  "contacts":
                if (!navTreeIsFiltered()) {
                getContactNodesByCustomerId(node.parentId, function (contacts) {
                        navTreeData.unloadChildren(node);
                        navTreeData.addList(contacts, node);
                });} else {
                    console.info(node);
                }
                break;
        }

    navTree.getData().openFolder(node);
}

function onNodeClick(viewer, node, recordNum) {
    selectedNode = node;
}


function loadNavTreeContactNodes(){

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
                        title: "Контакты", name: "Контакты", isFolder: true, type: "contacts", search: false
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
        folderIcon: imgDir+"/folder.png",
        nodeIcon: imgDir+"/frame.png",
        showOpenIcons:false,
        showDropIcons:false,
        closedIconSuffix:"",
        alwaysShowOpener: true,
        showHeader: false,
        loadDataOnDemand: false,
        // keepParentsOnFilter: true,
        nodeClick: onNodeClick,
        openFolder: onNavTreeOpenFolder
    });
    return navTree;
}

function setFilterNavTree(filter) {
    navTree.setDataSource(navTreeCache);
    navTree.filterData(filter);
}

function clearFilterNavTree() {
    navTree.filterData(null);
    navTreeSearchForm.resetValues();
    navTree.setData(navTreeData);
}

function navTreeIsFiltered() {
    var filter = navTreeSearchForm.getValue("filterEdit");
    return filter !== null && filter !== undefined;

}

function onNavTreeFilterApply() {
    if (navTreeIsFiltered()) {
        setFilterNavTree({title: navTreeSearchForm.getValue("filterEdit"), search: true});
    } else {
        clearFilterNavTree();
    }
}