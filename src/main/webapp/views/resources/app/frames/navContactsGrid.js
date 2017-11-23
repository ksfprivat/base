var testData = [
    {title: "Apple"},
    {title: "IBM"},
    {title: "Facebook"},
    {title: "Microsoft"},
    {title: "Google"},
    {title: "Yandex"},
    {title: "Dell"},
    {title: "Docker"}
];

function createNavContactsGrid() {
        var list = ListGrid.create({
            width:"100%",
            height:"100%",
            border:0,
            autoDraw: false,
            fields:[
                {name: "title", title: "Контакт"}
            ]
        });



        return list;
}
