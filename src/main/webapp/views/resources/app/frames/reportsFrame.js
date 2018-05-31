ReportsFrame = {

    create: function () {

        this.templates = {
          byYear : {
              _constructor:"AdvancedCriteria",
              operator:"and",
              criteria:[
                  { fieldName:"date", operator:"greaterThan", value:new Date("01.01."+String(new Date().getFullYear()))}
              ]
          },

          inExecutionAndSigning : {
               _constructor:"AdvancedCriteria",
               operator:"or",
               criteria:[
                    { fieldName:"status", operator:"iContains", value:"0"},
                    { fieldName:"status", operator:"iContains", value:"1"}
                ]
            },
            noPayment : {
                _constructor:"AdvancedCriteria",
                operator:"and",
                criteria:[
                    { fieldName:"status", operator:"iContains", value:"2"},
                    { fieldName:"reports", operator:"isNull"},
                    { fieldName:"amount", operator:"notEqual", value: 0}
                ]
            }

        };

        // this.currentReport = -1;

        this.reports = [
            {id: "root", title: "Отчеты", isFolder: true,
                children:[
                {id: 0, title:"Контракты", isFolder: true,
                    children:[
                      {id: 0.1, title:"Отчет по контрактам", frame: ContractReport},
                      {id: 0.2, title:"Шаблоны", isFolder: true, icon: imgDir+"/ic_folder_green.png", children:[
                              {id: 0.21, title:"Котракты за текущий год", frame: ContractReport,
                                  config: {criteria: this.templates.byYear, group:"year"}},
                              {id: 0.22, title:"Котракты по месяцам", frame: ContractReport,
                                  config: {criteria: this.templates.byYear, group:"date", groupMode:"month"}},
                              {id: 0.23, title:"На исполнении и подписании", frame: ContractReport,
                                  config: {criteria: this.templates.inExecutionAndSigning, group: "status"}},
                              {id: 0.24, title:"Неоплаченные контракты ", frame: ContractReport,
                                  config: {criteria: this.templates.noPayment, group: "year"}}
                          ]
                      }

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
            nodeIcon: imgDir+"/ic_contract.png",
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
            width: 320, height: "100%",
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
        ReportsFrame.currentReport = node.id;
        if (typeof node.frame !== "undefined")
            ReportsFrame.browser.setMembers([
                node.frame.create(node.config).content
            ]);
    }

    
};