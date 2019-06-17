function getQueryParam(key) {
    let rawQueryParams = window.location.search
    let queryParams = new URLSearchParams(rawQueryParams)
    let query = queryParams.get(key)
    return query
}

function toast_error(err) {
    let msg
    if (typeof(err) === 'string') {
        msg = err
    } else {
        msg = err.response && err.response.data || 'unknown error: ' + err.message
    }
    $.toast({
        title: 'An error occured!',
        content: msg,
        type: 'error',
        delay: 2666
    })
}

function toast_success(title='success', msg) {
    $.toast({
        title: title,
        content: msg,
        type: 'success',
        delay: 2666
    })
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}