module.exports =    function dateConvert ( date ) {

    let year = new Date(date).getFullYear()
    let month = new Date(date).getMonth()
    let day = new Date(date).getDate()

    return `${day}-${month}-${year}`
    
}