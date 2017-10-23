function createBrowserFrame() {
    return (
       VLayout.create({
           width: "100%",
           height: "100%",
           members: [
               HTMLFlow.create({
                    width: "100%",
                    height: "100%",
                    contents: "<div class='dummy'><h1>BrowserFrame</h1></div>"
                }), Button.create({title: "Action", click: "getCustomers()"})
           ]
       })
    );

}