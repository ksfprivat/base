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

function updateContract(contract, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "updateContract",
        data: contract,
        success: function () {
            console.log("Success: Update contract:" + contract.name);
            result = true;
            if (typeof callback === "function") callback(result);
        },
        error: function (jqXHR, status, error) {
            alert("Error:" + jqXHR.status + "\n\n" + jqXHR.responseText + "\n\n" + error);
            result = false;
            if (typeof callback === "function") callback(result);
        }
    });
}

function deleteContract(contractId, callback) {
    console.log("Delete:"+contractId);
    var result;
    $.ajax({
        type: "GET",
        url: "deleteContract",
        data: 'id='+contractId,
        success: function () {
            console.log("Success: Delete contact:" + contractId);
            result = true;
            if (typeof callback === "function") callback(result);
        },
        error: function (jqXHR, status, error) {
            alert("Error:" + jqXHR.status + "\n\n" + jqXHR.responseText + "\n\n" + error);
            result = false;
            if (typeof callback === "function") callback(result);
        }
    });
}