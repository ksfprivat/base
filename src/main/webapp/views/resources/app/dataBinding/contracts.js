function getContractById(contractId, callback) {
    var result;
    $.ajax({
        type: 'GET',
        url: 'getContractById',
        data: 'id='+contractId,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}

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

function getAllContracts(callback) {
    var result;
    $.ajax({
        type: 'POST',
        url: 'getAllContracts',
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


function insertContract(contract, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "insertContract",
        data: contract,
        success: function (data) {
            result = data;
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
    var result;
    $.ajax({
        type: "GET",
        url: "deleteContract",
        data: 'id='+contractId,
        success: function () {
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

function getNewContractNumber(year, callback) {
    var result;
    $.ajax({
        type: 'GET',
        url: 'getNewContractNumber',
        data: 'year='+year,
        success: function (data) {
            result = data;
            if (typeof callback === "function") callback(result);
        }
    });
}