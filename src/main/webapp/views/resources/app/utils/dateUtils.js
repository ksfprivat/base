function timestampToDateString(timestamp) {
    var date = new Date(Number(timestamp));
    return (
        ( (Number(date.getDate())<10) ? ("0"+date.getDate()): (date.getDate()) )+"."+
        ( (Number(date.getMonth()+1)<10) ? ("0"+(Number(date.getMonth())+1)): ((Number(date.getMonth())+1)) )+"."+
        date.getFullYear());
}

function dateStringToTimestamp(dateString) {
    return new Date(dateString.split(".").reverse().join(".")).getTime();
}

function isTimestamp (value) {
    return Number(value) > 0;
}

function isDateString (value) {
    return (value.indexOf(".") !== -1)
}

function isDate(value) {
    return (value instanceof Date)
}