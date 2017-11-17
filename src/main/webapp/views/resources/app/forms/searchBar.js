var navSearchCurrentValue;

function createSearchBar() {
    return (
        HTMLFlow.create({
            width: "100%",
            contents:
                "<div class='searchBar'>"+
                    "<table class='searchTextBox'><tr>"+
                        // "<td><input id='navBarSearchButton' type='image' src='"+imgDir+"/ic_search_gray_light.png' class='img'></td>"+
                        "<td><input id='searchText' type='text' class='searchInputText' placeholder='Поиск' onkeyup='onSearchTextChanged(this.value)'></td>"+
                        "<td ><input id='navBarSearchTextClearButton' type='image' src='"+imgDir+"/ic_delete_gray_light.png' class='img' style='visibility: hidden' onclick='clearSearchText()'></td>"+
                    "</tr></table>"+
            "</div>"
        })
    )
}

function onSearchTextChanged(value) {
    if (value.length > 0)
        document.getElementById("navBarSearchTextClearButton").style.visibility = "visible";
    else {
        document.getElementById("navBarSearchTextClearButton").style.visibility = "hidden";
        clearFilterNavTree();
    }

    if (value != navSearchCurrentValue) {
        navSearchCurrentValue = value;
        setFilterNavTree({title: value, search: true});
    }
}

function clearSearchText() {
    $("#searchText").val("");
    onSearchTextChanged("");
}