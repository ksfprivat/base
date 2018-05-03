NavContractsGrid = {
    create: function () {

        this.listGrid = VLayout.create({
            members:[
                Button.create({title:"NavContacts"})
            ]
        });


        return Object.create(this);
    }
};