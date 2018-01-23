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


function updateContact(contact, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "updateContact",
        data: contact,
        success: function () {
            console.log("Success: Update contact:" + contact.name);
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

function deleteContact(contactId, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "deleteContact",
        data: 'contactId='+contactId,
        success: function () {
            console.log("Success: Delete contact:" + contactId);
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

function insertContact(contact, callback) {
    var result;
    $.ajax({
        type: "GET",
        url: "insertContact",
        data: contact,
        success: function () {
            console.log("Success: Insert contact:" + contact.name);
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
