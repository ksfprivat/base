const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь","Декабрь"
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

// Input value format: String date format "yyy.MM.dd"
function stringToDate(date) {
    var year    = Number(date.substr(0,4)),
        month   = Number(date.substr(5,2))-1,
        day     = Number(date.substr(8,2));
    return new Date(year, month, day, 12, 0, 0, 0);
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
    if ( (typeof value !== "undefined") && (value !== null) )
        return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    else return 0;
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

function exportHTMLtableToWord(fileName, content) {
    var html, link, blob, url, css;
    css = (
        '<style>' +
        '@page WordSection{size: 841.95pt 595.35pt; mso-page-orientation: landscape;}' +
        'div.WordSection {page: WordSection;}' +
        '</style>'
    );

    html = "<div class='WordSection'>"+content+"</div>";
    blob = new Blob(['\ufeff', css + html], {
        type: 'application/msword'
    });
    url = URL.createObjectURL(blob);
    link = document.createElement('A');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    if (navigator.msSaveOrOpenBlob )
        navigator.msSaveOrOpenBlob( blob, fileName+'.doc'); // IE10-11
    else link.click();  // other browsers
    document.body.removeChild(link);
}