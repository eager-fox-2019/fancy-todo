module.exports =    function dateConvert ( date ) {
        console.log (date)
        let year = new Date(date).getFullYear()
        let month = new Date(date).getMonth()
        let tanggal = new Date(date).getDate()

        return `${tanggal}-${month}-${year}`
    }