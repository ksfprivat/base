function getContactsByCustomerId(customerId, callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getContactsByCustomerId',
        data: 'id='+customerId,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}

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