SideBarFrame = {

    create: function () {

        function createButton(title, icon, event){
          return (
            HTMLFlow.create({
                //overflow: "hidden",
                contents:
                "<div class ='sideBarButton' style='margin: 0'>"+
                    "<img src="+imgDir+"/"+icon+" width='36px'><br>" + title +
                "</div>"
            }))
        }

        this.btnHome        =  createButton("Главная", "ic_sb_home.png", null);
        this.btnCRM         =  createButton("CRM", "ic_sb_CRM.png", null);
        this.btnReports     =  createButton("Отчеты", "ic_sb_report.png", null);
        this.btnCalendar    =  createButton("Календарь", "ic_sb_calendar.png", null);
        this.btnHelp        =  createButton("Справка", "ic_sb_help.png", null);
        this.btnSettings    =  createButton("Настройки", "ic_sb_settings.png", null);


        this.btnCollapse = HTMLFlow.create({contents:
                "<div class='sideBarButton' style='height: 22px; margin-bottom: 0'>" +
                "<img src="+imgDir+"/ic_sb_chevron-left.png"+"></div>"});

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
    }
};