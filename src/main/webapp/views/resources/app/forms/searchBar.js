function createSearchBar() {
    return (
        HTMLFlow.create({
            width: "100%",
            contents:
                "<div class='searchBar'>"+
                    "<table class='searchTextBox'><tr>"+
                        "<td><input id='navBarSearchButton' type='image' src='"+imgDir+"/ic_search_gray_light.png' class='img'></td>"+
                        "<td><input id='searchText' type='text' class='searchInputText' placeholder='Поиск' oninput='onSearchTextChanged(this.value)'></td>"+
                        "<td ><input id='navBarSearchTextClearButton' type='image' src='"+imgDir+"/ic_delete_gray_light.png' class='img' style='visibility: hidden' onclick='clearSearchText()'></td>"+
                    "</tr></table>"+
                 "</div>"
        })
    )
}

function onSearchTextChanged(value) {
      if (value.length > 0) {
           setFilterNavTree({title: value, search: true});
           $("#navBarSearchTextClearButton").attr("style", "visibility:visible");
       }
       else
       {
           clearFilterNavTree();
           $("#navBarSearchTextClearButton").attr("style", "visibility:hidden");
       }
}

function clearSearchText() {
    $("#searchText").val("");
    onSearchTextChanged("");
}