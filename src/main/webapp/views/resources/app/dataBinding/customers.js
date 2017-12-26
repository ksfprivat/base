function getCustomerById(customerId, callback) {
    var result;
    $.ajax({
        type: 'GET',
        url: 'getCustomerById',
        data: 'id='+customerId,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}

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

function getCustomerNodes(callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getCustomerNodes',
        success: function(data) {
            result = data;
            if(typeof callback === "function") callback(result);
        }
    });
}