function getContractsByCustomerId(customerId, callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getContractsByCustomerId',
        data: 'id='+customerId,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}

function getContractNodesByCustomerId(customerId, callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getContractNodesByCustomerId',
        data: 'id='+customerId,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}