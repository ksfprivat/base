function getContactNodesByCustomerId(customerId, callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getContactNodesByCustomerId',
        data: 'id='+customerId,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}

function getAllContactsNodes(callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getAllContactsNodes',
        success: function(data) {
            result = data;
            if(typeof callback === "function") callback(result);
        }
    });
}

