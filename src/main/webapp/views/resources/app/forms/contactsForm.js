var testData = [
    {id:"1", name:"Швондер Аркдий Мамонтович", position:"специалист по ЗИ", phone:"(343) 345-75-87", mobile:"922-218-44-56", email:"shvonderAM@yandex.ru", fax:"(343) 345-67-89"},
    {id:"2", name:"Марвихер Каркан ремингтонович", position:"дректор по режиму", phone:"(343) 345-75-87", mobile:"922-218-44-56", email:"marviherCarckane@mail.ru", fax:"(343) 345-67-89"},
    {id:"3", name:"Беленгауз Акакий Муромец", position:"осинизатор 1 категории", phone:"(343) 345-75-87", mobile:"922-218-44-56", email:"shitcoinMiner@gmail.com", fax:"(343) 345-67-89"}
];



ContactsForm ={
    create: function () {
        this.expanded = true;
        this.changed = false;
        this.data = null;
        this.header = HTMLFlow.create({
            contents: "<table class='cardBoxTitle'><tr>" +
            "<td><input id='contactsCardExpandButton' title='Свернуть' type='image' src='" + imgDir + "/ic_expand.png' class='cardBoxHeaderButton' onclick='ContactsForm.cardExpand()'></td>" +
            "<td width='100%'>Контакты</td>" +
            "<td><input id='contactsCardBoxCommitChangesButton' title='Сохранить' type='image' src='" + imgDir + "/ic_commit.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='ContactsForm.commitChanges()'></td>" +
            "<td><input id='contactsCardBoxRollbackChangesButton' title='Отменить' type='image' src='" + imgDir + "/ic_rollback.png' class='cardBoxHeaderButton' style='visibility: hidden' onclick='ContactsForm.rollbackChanges()'></td>" +
            "</tr></table>"
        });


        this.toolBarBlock = HLayout.create({
            width: "100%",
            height: 32,
            members:[
                Button.create({title:"Hello !"})
            ]
        });
        this.contactsGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            padding: 6,
            margin: 8,
            alternateRecordStyles: true,
            alternateFieldStyles: false,
            showHeaderMenuButton:false,
            showSortNumerals: false,
            canEdit:true,
            autoDraw: false,
            sortField: 1,
            fields: [
                {name: "id"},
                {name: "name", title:"Имя"},
                {name: "position", title:"Должность"},
                {name: "phone", title:"Телефон"},
                {name: "mobile", title:"Мобильный"},
                {name: "email", title:"E-mail"},
                {name: "fax", title:"Факс"}
            ]});
        this.contactsGrid .hideFields(["id"]);
        this.contactsGrid.setData(testData);

        this.content = VLayout.create({
            width: "100%",
            height: "300",
            minWidth: 680,
            autoDraw: false,
            members: [
                this.header,
           //     this.toolBarBlock,
                this.contactsGrid
            ]
        });

        this.content.setStyleName("cardBox");

        return Object.create(this);
    },

    cardExpand: function () {
        for (var i = 1; i < this.content.members.length; i++) {
            if (this.expanded) {
                this.content.members[i].hide();
                this.content.setHeight(30);
                $("#contactsCardExpandButton").attr("src", imgDir + "/ic_collapse.png");
            } else {
                this.content.members[i].show();
                this.content.setHeight(300);
                $("#contactsCardExpandButton").attr("src", imgDir + "/ic_expand.png");
            }
        }
        this.expanded = !this.expanded;
    },

    commitChanges: function () {

    },

    rollbackChanges: function () {

    }

};
