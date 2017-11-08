var  navTree;
var  navTreeData;
var  dataSource;
var  navTreeSearchForm;

var testContacts = [
    {title: "Bill"},
    {title: "Gregory"},
    {title: "Sergei"},
    {title: "Larry"},
    {title: "Melissa"}
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
               Button.create({title: "Filter", click:setFilterNavTree}),
               Button.create({title: "Clear", click: clearFilterNavTree}),
               Button.create({title: "Open All", click: openAllFolders})
           ]
        })
    );
}

function openAllFolders() {


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

   if (!navTreeIsFiltered()) {

        switch (node.type) {
            case  "contacts":
                getContactNodesByCustomerId(node.parentId, function (contacts) {
                    navTreeData.unloadChildren(node);
                    navTreeData.addList(contacts, node);
                });
                break;
        }
    }
    navTree.getData().openFolder(node);
}

function onNodeClick(viewer, node, recordNum) {

}

function loadNavTreeData()
{
    getCustomerNodes(function(customers){
        var nodes = [];

        for (var i = 0; i < customers.length; i++) {
            nodes[i] = {title: customers[i].title, name: customers[i].title, id: customers[i].id, isFolder: true, type: "customer",
                children: [
                    {title: "Контакты", name: "Контакты", parentId:customers[i].id, isFolder: true, icon: imgDir+"/contacts.png", type:"contacts", search:false},
                    {title: "Контракты", name: "Контракты", isFolder: true, type: "contracts", search: false}
                ]};
        }

        // Local data based tree nodes load method
        navTreeData = Tree.create({data:nodes});

        // Local datasource based tree nodes load method
        dataSource = DataSource.create({
            fields: [{name: "title", title:"Наименование"}],
            clientOnly: true,
            cacheData: nodes
        });
        // navTree.openAll();
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
    navTree.setDataSource(dataSource);
    navTree.filterData(filter);
}

function clearFilterNavTree() {
    navTree.filterData(null);
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