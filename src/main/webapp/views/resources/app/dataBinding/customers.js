function getCustomers(callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getCustomers',
        success: function(data) {
            result = data;
            if(typeof callback === "function") callback(result);
        }
    });
}
