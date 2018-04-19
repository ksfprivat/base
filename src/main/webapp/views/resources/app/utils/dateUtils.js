function formatDateString(value) {
    return (value.substr(8,2)+"."+value.substr(5,2)+"."+value.substr(0,4));
}

function dateToDateString(value) {
       return (
           value.getFullYear()+"."+
           ((Number(value.getMonth()+1)<10) ? ("0"+(Number(value.getMonth())+1)): ((Number(value.getMonth())+1)) )+"."+
           ((Number(value.getDate())<10) ? ("0"+value.getDate()): (value.getDate()))
       );
}


function isDateString (value) {
    return (value.indexOf(".") !== -1)
}

function isDate(value) {
    return (value instanceof Date)
}

function isDigit(str) {
    return str && !/[^\d]/.test(str);
}