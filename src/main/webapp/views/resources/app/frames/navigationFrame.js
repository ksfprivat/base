var  navTreeView;
var  navTreeData;
var  dataSource;
// var  nodes;

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

// !!! - Здесь пришлось прибегнуть к методам Reverse Engineering.
// Поскольку оригинальная библиотека SmartClient не предоставляет возможности обработки событий открытия каталога дерева
// (можно только переопределить метод openFolder() - что блокирует дальнейшую отрисовку открытия ветки) пришлось внедрить
// в function isc_Tree_openFolder(_1,_2) модуля библиотеки ISC_Grid вызов своей функции onTreeViewOpenFolder
// В качестве параметра node из оригинальной библиотеки передается параметр _1 - в котором хранится состояние ветки.
// (!!! - Учесть при смене версий библиотеки SmartClient).

function onTreeViewOpenFolder(node) {
    // Загрузка каталога дерева - сработка только при открытии узла
    if (node.state == "closed") {
        if (node.baseFolder) {
            var parentPath = "/"+node._parent_treeData.title+"/"+node.title;
            var parent = navTreeData.find(parentPath);

            navTreeData.unloadChildren(parent);

            if (node.type == "contacts")
                getContactNodesByCustomerId(node.parentId, function(contacts) {
                    navTreeData.addList(contacts, parent);
                });
            if (node.type == "contracts")
                getContractNodesByCustomerId(node.parentId, function(contracts) {
                    navTreeData.addList(contracts, parent);
                });
            // Даже если базовый каталог пустой всеравно вернуть ему статус Каталога
            node.isFolder = true;
        }
    }
// !!! - Еще одна особенность библиотеки SmartClient - как выяснилось при выполнения метода closeFolder (при закрытии узла дерева)
// почемуто вызывается метод openFolder, что в нашем случае приводит к нежелательному повторному обращению к серверу (т.е. повторное выполнение кода onTreeViewOpenFolder).
// Поэтому для избежания избыточных транзакций на стороне сервера (а также повторной передачи данных на сторону клиента)
// для базовых катаогов вводится дополнительное полее "state", которое указывает текущее состояние opened/closed
// Это позволяет избежать повторное выполнение кода. Далее идет переключение состояний.

    if (node.state == "closed")
        node.state = "opened";
    else
        node.state = "closed";
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
                    {title: "Контакты", name: "Контакты", isFolder: true, icon: imgDir+"/contacts.png", type:"contacts", baseFolder:true, state:"closed"},
                    {title: "Контракты", name: "Контракты", isFolder: true, type: "contracts", baseFolder: true, state:"closed"}
                ]};
        }

        navTreeData = Tree.create({ID:"treeData",  data:nodes});
        navTreeView.setData(navTreeData);

        // dataSource = DataSource.create({
        //     fields: [{name: "title", title:"Наименование"}],
        //     clientOnly: true,
        //     cacheData: nodes
        // });
        //
        // navTreeView.setDataSource(dataSource);
        // navTreeView.clearCriteria();
    });
}


function createNavigationTreeView() {
    loadNavTreeData();
    navTreeView = TreeGrid.create({
        fields: [{name:"title", title:"Наименование"}],
        folderIcon: imgDir+"/folder.png",
        nodeIcon: imgDir+"/frame.png",
        showOpenIcons:false,
        showDropIcons:false,
        closedIconSuffix:"",
        nodeClick: onNodeClick
    });
    return navTreeView;
}

function setFilterNavTree() {
    navTreeView.filterData({title: "Anna"});


}