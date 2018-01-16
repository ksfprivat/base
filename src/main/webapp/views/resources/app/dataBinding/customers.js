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

function foo() {
    console.log("Hello...");
}

function updateCustomer(customer, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "updateCustomer",
        data: customer,
        success: function () {
            console.log("Success: Update customer:" + customer.title);
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

function insertCustomer(customer, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "insertCustomer",
        data: customer,
        success: function () {
            console.log("Success: Insert customer:" + customer.title);
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

function deleteCustomer(customerId, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "deleteCustomer",
        data: 'customerId='+customerId,
        success: function () {
            console.log("Success: Delete customer:" + customerId);
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

