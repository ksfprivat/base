var navTreeView;
var navTreeData;


function createNavigationFrame() {
    return (
        HLayout.create({
            width: 280,
            height: "100%",
            showResizeBar: true,
            members: [
                createNavigationTreeView()
            ]
        })
    );
}

function onTreeViewOpenFolder() {
    
}

function onNodeClick(viewer, node, recordNum) {

}

function loadTreeViewData()
{
    getCustomers(function(customers){
        var nodes = [];

        for (var i = 0; i < customers.length; i++) {
            nodes[i] = {title: customers[i].title, name: customers[i].title, id: customers[i].id, isFolder: true, type: "customer",
                children: [
                    {title: "Контакты", name: "Контакты", isFolder: true, icon: imgDir+"/contacts.png", type:"contacts", baseFolder:true, state:"closed"},
                    {title: "Контракты", name: "Контракты", isFolder: true, type: "contracts", baseFolder: true, state:"closed"}
                ]};
        }

        navTreeData = Tree.create({ID:"treeData",  data:nodes});
        navTreeView.setData(navTreeData);
    });
}


function createNavigationTreeView() {
     navTreeView = TreeGrid.create({
        fields: [{name:"title", title:"Наименование"}],
        folderIcon: imgDir+"/folder.png",
        nodeIcon: imgDir+"/frame.png",
        showOpenIcons:false,
        showDropIcons:false,
        closedIconSuffix:"",
        nodeClick: onNodeClick
    });

    loadTreeViewData();

    return navTreeView;
}