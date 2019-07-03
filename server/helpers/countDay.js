const countDay = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    let day= Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    return Math.abs(day)
}

module.exports= countDay