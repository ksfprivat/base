SideBarFrame = {

    create: function () {

        function createButton(title, icon,  event){
          return (
            HTMLFlow.create({
                contents:
                "<div class ='sideBarButton'>"+
                    "<img src="+imgDir+"/"+icon+" width='36px'><br>" + title +
                "</div>"
            }))
        }

        this.btnHome =  createButton("Главная", "ic_sb_home.png", null);
        this.btnCRM  =  createButton("CRM", "ic_sb_CRM.png", null);
        this.btnReports =  createButton("Отчеты", "ic_sb_report.png", null);
        this.btnCalendar =  createButton("Календарь", "ic_sb_calendar.png", null);


        this.separator = VLayout.create({
           width:1,
           height: "100%",
           backgroundColor:"#E0E0E0"
        });

        this.toolBar = VLayout.create({
            width: 80,
            height: "100%",
            members: [
                this.btnHome,
                this.btnCRM,
                this.btnReports,
                this.btnCalendar
        ]});

        this.content = HLayout.create({
           width:80,
           members:[
               this.toolBar,
               this.separator
           ]
        });

        return Object.create(this);
    }
};