SideBarFrame = {

    create: function () {
        this.appState = 0;
        function createButton(title, icon, state){
          return (
            HTMLFlow.create({
                //overflow: "hidden",
                contents:
                "<div class ='sideBarButton' style='margin: 0'>"+
                    "<img src="+imgDir+"/"+icon+" width='36px'><br>" + title +
                "</div>",
                click: function () {
                    SideBarFrame.setAppState(state);
                }
            }))
        }

        this.btnHome        =  createButton("Главная", "ic_sb_home.png", 0);
        this.btnCRM         =  createButton("CRM", "ic_sb_CRM.png", 1);
        this.btnReports     =  createButton("Отчеты", "ic_sb_report.png", 2);
        this.btnCalendar    =  createButton("Календарь", "ic_sb_calendar.png", 3);
        this.btnSettings    =  createButton("Настройки", "ic_sb_settings.png", 4);
        this.btnHelp        =  createButton("Справка", "ic_sb_help.png", 5);

        this.btnCollapse = HTMLFlow.create({contents:
                "<div class='sideBarButton' style='height: 22px; margin-bottom: 0'>" +
                "<img src="+imgDir+"/ic_sb_chevron-left.png"+"></div>",
                click: function () {
                    SideBarFrame.content.setVisibility("hidden");
                }});

        this.vSeparator = VLayout.create({
           width:1,
           height: "100%",
           backgroundColor:"#E0E0E0"
        });

        this.spacer = VLayout.create({height:"100%"});

        this.toolBar = VLayout.create({
            width: 80,
            margin: 0,
            height: "100%",
            overflow:"hidden",
            members: [
                this.btnHome,
                this.btnCRM,
                this.btnReports,
                this.btnCalendar,
                this.btnSettings,
                this.btnHelp,
                this.spacer,
                this.btnCollapse
            ]});

        this.content = HLayout.create({
           width:80,
           height: "100%",
           members:[
               this.toolBar,
               this.vSeparator
           ]
        });

        return Object.create(this);
    },

    setAppState: function (state) {
        SideBarFrame.appState = state;

        for (var i = 0; i < SideBarFrame.toolBar.members.length; i++) {
            // if (i === state) {
            //     SideBarFrame.toolBar.members[i].setBackgroundColor("#d7d7d7")
            // }
            // else {
            //     SideBarFrame.toolBar.members[i].setBackgroundColor("#eeeeee")
            // }
            SideBarFrame.toolBar.members[i].setBackgroundColor(
                (i === state) ? ("#d7d7d7") : ("#eeeeee")
            );
        }

        switch (state) {
            case 0: // Home
                crmFrame.setVisibility("hidden");
                dashboardFrame.content.setVisibility("visible");
                break;
            case 1: // CRM
                crmFrame.setVisibility("visible");
                dashboardFrame.content.setVisibility("hidden");
                break;
            case 2: // Reports
                break;
            case 3: // Calendar
                break;
            case 4: // Settings
                break;
            case 5: // Help
                break;
        }
    }
};