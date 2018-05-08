ReportsFrame = {
    create: function () {

        this.currentReport = -1;

        this.reports = [
            {id: "root", title: "Отчеты", isFolder: true,
                children:[
                {id: 0, title:"Контракты", isFolder: true,
                    children:[
                      {id: 0.1, title:"Отчет по контрактам"},
                      {id: 0.2, title:"Отчет по платежам"}
                     ]
                },
                {id: 0, title:"Объекты", isFolder: true

                 }
            ]}];

        this.navTree = TreeGrid.create({
            height: "100%",
            width: "100%",
            fields: [
                {name: "id", hidden:true},
                {name:"title", title:"Отчеты"}
                ],
            iconSize: 22,
            autoDraw: false,
            border:0,
            folderIcon: imgDir+"/ic_folder.png",
            nodeIcon: imgDir+"/ic_table.png",
            showOpenIcons:false,
            showDropIcons:false,
            closedIconSuffix:"",
            alwaysShowOpener: true,
            showEmptyMessage: false,
            showLoadingIcons:false,
            showHeader: false,
            loadDataOnDemand: false,
            showSortNumerals: false,
            showHeaderContextMenu: false,
            nodeClick: this.changeReport
        });

        this.navReports = VLayout.create({
            width: 280, height: "100%",
            showResizeBar: true,
            members:[this.navTree]
        });

        this.browser = VLayout.create({
           width: "100%", height: "100%",
           padding:8, margin:8,
           members:[]
        });

        this.content = HLayout.create({
            width: "100%",
            height: "100%",
            visibility:"hidden",
            overflow:"hidden",
            align:"center",
            backgroundColor:"#eeeeee",
            members:[
                this.navReports, this.browser
            ]
        });

        this.init();

        return Object.create(this);
    },
    
    
   init: function () {
        ReportsFrame.navTree.setData(Tree.create({data: ReportsFrame.reports}));
        ReportsFrame.navTree.data.openAll();
   },

    changeReport: function (viewer, node) {
         switch (node.id) {
             case 0.1:
                 ReportsFrame.currentReport = node.id;
                 ReportsFrame.browser.setMembers([
                     ContractReport.create().content
                 ]);
                 break;
             case 0.2:
                 ReportsFrame.currentReport = node.id;
                 ReportsFrame.browser.setMembers([HTMLFlow.create({contents:"<h1>Payments</h1>"})]);
                 break;
         }
    }
    
};