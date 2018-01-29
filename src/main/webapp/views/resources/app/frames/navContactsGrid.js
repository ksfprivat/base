
NavContactsGrid =  {

     create: function () {
        this.currenRecord = null;
        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            alternateRecordStyles: true,
            alternateFieldStyles: true,
            showHeader: false,
            autoDraw: false,
            sortField: "title",
            autoFetchData:true,
            fields: [
                {name: "id"},
                {name: "title", title:"Контакты"}
            ],
            rowClick: NavContactsGrid.onRowClick
        });

        this.init();
        return Object.create(this);
    },

    init: function () {
       var listGrid = this.listGrid;
        getAllContactsNodes(function (contacts)  {
            this.dataSource = DataSource.create({
                fields: [
                    {name: "id", primaryKey: true},
                    {name: "title", title:"Контакты"}
                ],
                clientOnly: true
            });

             for (var i = 0; i < contacts.length; i++) {
                var title =
                    "<table class='listItem'><tr>"+
                        "<td><img src='"+imgDir+"/ic_contact.png'></td>"+
                        "<td width='100%'>"+contacts[i].title+"" +
                        "<br><small style='color: #0D47A1'>"+contacts[i].customerTitle+"<small/></td>"+
                    "</tr></table>";

                this.dataSource.addData({id:contacts[i].id, title: title, customerId: contacts[i].customerId, customerTitle: contacts[i].customerTitle});
            }
            listGrid.setDataSource(this.dataSource);
            listGrid.hideFields(["id"]);
        });
    },

    setFilter: function (filter) {
        this.listGrid.filterData(filter);
    },

    clearFilter: function () {
        this.listGrid.filterData(null);
    },

    onRowClick: function (record, recordNum, fieldNum) {
         NavContactsGrid.currentRecord = record;
         if (!browserFrame.isVisible()) browserFrame.show();
          if (navTreeCurrentCustomerId != record.customerId) {
              refreshBrowserFrame(record.customerId);
              navTreeCurrentCustomerId = record.customerId;
          }
          ContactsForm.setCurrentRecord(ContactsForm.getRecordById(record.id));
    },

    deleteItem: function() {
         if (NavContactsGrid.currentRecord != null) {
              isc.ask("Вы хотите удалить: "+NavContactsGrid.currentRecord.title,
                 {
                     yesClick: function() {
                             deleteContact(NavContactsGrid.currentRecord.id, function (success) {
                                     if (success) {
                                         var record  = ContactsForm.getRecordById(NavContactsGrid.currentRecord.id);
                                         deleteContactNode(NavContactsGrid.currentRecord.id);
                                         NavContactsGrid.listGrid.removeData(NavContactsGrid.currentRecord);
                                         if (!!record)
                                             ContactsForm.contactsGrid.removeData(record);
                                     }
                                 });
                         return this.Super('yesClick', arguments);}
                 }
             );
         }
    },

    editItem: function () {
         if (NavContactsGrid.currentRecord != null) {
             var contactWindow = ContactWindow.create(TRANSACTION_UPDATE);
             getContactById(NavContactsGrid.currentRecord.id, function (contact) {
                 contactWindow.setData(contact, NavContactsGrid.currentRecord.customerId);
             });
         }

    },

    refreshRecord: function (title) {
        if (NavContactsGrid.currentRecord != null) {
            NavContactsGrid.currentRecord.title =
                "<table class='listItem'><tr>"+
                "<td><img src='"+imgDir+"/ic_contact.png'></td>"+
                "<td width='100%'>"+title+"" +
                "<br><small style='color: #0D47A1'>"+NavContactsGrid.currentRecord.customerTitle+"<small/></td>"+
                "</tr></table>";

            NavContactsGrid.listGrid.refreshRow(NavContactsGrid.listGrid.getRowNum(NavContactsGrid.currentRecord));

        }
    }

};














