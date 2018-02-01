
NavContactsGrid =  {

     create: function () {
        this.listGrid = ListGrid.create({
            width: "100%",
            height: "100%",
            border:0,
            cellHeight: 44,
            alternateRecordStyles: true,
            alternateFieldStyles: true,
            showHeader: false,
            autoDraw: false,
            sortField: "name",
            virtualScrolling: false,
            autoFetchData:true,
            //===============================================================================================
            // WARNING ! Experimental feature. Not use because decrease in performance if showAllRecords:true
            //===============================================================================================
            //showAllRecords:true,
            dataPageSize: 10000,
            //===============================================================================================
            fields: [
                {name: "id"},
                {name: "title", title:"Контакты"},
                {name: "name"}
            ],
            rowClick: NavContactsGrid.onRowClick
        });

        this.init();
        return Object.create(this);
    },

    init: function () {
       var listGrid = this.listGrid;
        getAllContactsNodes(function (contacts)  {
            var dataSource = DataSource.create({
                fields: [
                    {name: "id", primaryKey: true},
                    {name: "title", title:"Контакты"},
                    {name: "name"}
                ],
                cacheAllData:true,
                autoCacheAllData: true,
                clientOnly: true
            });

             for (var i = 0; i < contacts.length; i++) {
                var title = NavContactsGrid.createItemBlock(contacts[i].title, contacts[i].customerTitle);

                dataSource.addData({id:contacts[i].id, title: title, name: contacts[i].title,
                                        customerId: contacts[i].customerId, customerTitle: contacts[i].customerTitle});
            }
            listGrid.setDataSource(dataSource);
            listGrid.hideFields(["id", "name"]);
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

    getItemById: function (id) {
         return $.grep(NavContactsGrid.listGrid.dataSource.cacheData, function(item) { return item.id == id })[0];
    },

    getItemsByCustomerId: function(customerId) {

    },

    insertItem: function(contact, customerTitle) {
         var record = {};
         record.id = contact.id;
         record.customerId = contact.customerId;
         record.customerTitle = customerTitle;
         record.name = contact.name;
         record.title = NavContactsGrid.createItemBlock(contact.name, customerTitle);
         NavContactsGrid.listGrid.dataSource.addData(record);
         NavContactsGrid.listGrid.deselectAllRecords();
         NavContactsGrid.listGrid.selectRecord(record);
         NavContactsGrid.listGrid.scrollToRow(record);

    //     NavContactsGrid.listGrid.setSort({"name", });
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


    deleteItemById: function (id) {
        var record = NavContactsGrid.getItemById(id);
        if (typeof record != "undefined")
            NavContactsGrid.listGrid.dataSource.removeData(record);
    },

    editItem: function () {
         if (NavContactsGrid.currentRecord != null) {
             var contactWindow = ContactWindow.create(TRANSACTION_UPDATE, customerCard.getData().title);
             getContactById(NavContactsGrid.currentRecord.id, function (contact) {
                 contactWindow.setData(contact, NavContactsGrid.currentRecord.customerId);
             });
         }

    },

    updateItem: function (id, title, customerTitle) {
         var record = NavContactsGrid.getItemById(id);
         if (typeof record != "undefined") {
             record.title = NavContactsGrid.createItemBlock(title, customerTitle);
             NavContactsGrid.listGrid.dataSource.updateData(record);
             NavContactsGrid.listGrid.refreshRow(NavContactsGrid.listGrid.getRowNum(record))
         }
    },

    createItemBlock: function(title, customerTitle) {
        return (
            "<table class='listItem'><tr>"+
            "<td><img src='"+imgDir+"/ic_contact.png'></td>"+
            "<td width='100%'>"+title+"" +
            "<br><small style='color: #0D47A1'>"+customerTitle+"<small/></td>"+
            "</tr></table>"
        );
    }

};














