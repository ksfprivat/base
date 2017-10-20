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

function createNavigationTreeView() {
    return TreeGrid.create({
        fields: [{name:"title", title:"Наименование"}],
        folderIcon: imgDir+"/folder.png",
        nodeIcon: imgDir+"/frame.png",
        showOpenIcons:false,
        showDropIcons:false,
        closedIconSuffix:"",
        nodeClick: onNodeClick
    });
}