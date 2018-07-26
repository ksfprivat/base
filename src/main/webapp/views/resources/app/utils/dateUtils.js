const months = [
  "Январь", "Февраль", "Мар", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь","Декабрь"
];

function formatDateString(value) {
    if ((value != null)) {
        if (isDate(value)) value = dateToDateString(value);
        return (value.substr(8, 2) + "." + value.substr(5, 2) + "." + value.substr(0, 4))
    } else return"-";
}

function dateToDateString(value) {
       return (
           value.getFullYear()+"."+
           ((Number(value.getMonth()+1)<10) ? ("0"+(Number(value.getMonth())+1)): ((Number(value.getMonth())+1)) )+"."+
           ((Number(value.getDate())<10) ? ("0"+value.getDate()): (value.getDate()))
       );
}

// Revers date timestamp for descending sort in ascending sorted treeView
// Input value format: String date format "yyy.MM.dd"
function reversTimestamp(value) {
    return 2000000000000-Number(new Date(value).getTime());
}


function isDateString (value) {
    return (value.indexOf(".") !== -1)
}

function isDate(value) {
    return (value instanceof Date)
}

function isDigit(str) {
    if (Number(str) === 0) return true;
    else return str && !/[^\d]/.test(str);
}

function formatStringDoubleToCurrency(value, symbol) {
    if (value != null)
        return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+",00"+((typeof symbol !== "undefined")? " "+symbol:"");
    else return "0.00"+((typeof symbol !== "undefined")? " "+symbol:"");
}

function getContractNumber(contractTitle) {
    var result = 0;
    var i = 0;
    while (isDigit(contractTitle[i])) {
        result += contractTitle[i];
        i++;
    }
    return Number(result);
}

function stringNumberToCurrency(value) {
    if ( (typeof value !== "undefined") || (value !== null) )
        return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    return value;
}

function getStatusFieldTextValue(value) {
    var result = "";
        switch  (value) {
            case "Подписание":
            case "0":
                result = "Подписание";
                break;
            case "Исполнение":
            case "1":
                result = "Исполнение";
                break;
            case "Выполнен":
            case "Выполнено":
            case "2":
                result = "Выполнен";
                break;
            case "Не действителен":
            case "3":
                result = "Недействителен";
                break;
            default: result = "Недействителен";
        }
        return result;
}

function getStatusFieldNumberValue(value) {
    var result = "";
    switch  (value) {
        case "Подписание":
        case "0":
            result = "0";
            break;
        case "Исполнение":
        case "1":
            result = "1";
            break;
        case "Выполнен":
        case "Выполнено":
        case "2":
            result = "2";
            break;
        case "Не действителен":
        case "3":
            result = "3";
            break;
        default: result = "3";
    }
    return result;
}

function getContractTypeWord(value) {
    var result = "";
    switch (value) {
        case "0":
            result = "аттестация";
            break;
        case "1":
            result = "контроль";
            break;
        case "2":
            result = "услуга";
            break;
        case "3":
            result = "поставка";
            break;
    }
    return result;
}