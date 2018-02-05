function getcurrentUser(callback) {
    var result;
    $.ajax({
        type: 'GET',
        url: 'getCurrentUser',
        success: function(data) {
            result = data;
            if(typeof callback === "function") callback(result);
        }
    });
}

function getHeader() {
    var header;

    header = "<div class='header'>" +
            "<div class='logo'><img src='/resources/img/logo.png'/></div>"+
            "<div class='header_login'>"+
            "<img style='float: left' src='/resources/img/user_profile.png'>"+
            "<a class='header_text' id='userName'>root@base.org&nbsp;</a>"+
            "<a class='header_text' href='/logout'>Logout</a> "+
            "</div></div>";

    return header;

}