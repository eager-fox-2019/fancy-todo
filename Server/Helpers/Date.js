function date(input){
    let temp = new Date(input.due_date)
    let day = temp.getDate()
    let month = temp.getMonth()
    let year = temp.getFullYear()

    let monthName = null
    if (month == 0){
        monthName = 'January'
    } else if (month == 1){
        monthName = 'February'
    } else if (month == 2){
        monthName = 'March'
    } else if (month == 3){
        monthName = 'April'
    } else if (month == 4){
        monthName = 'May'
    } else if (month == 5){
        monthName = 'June'
    } else if (month == 6){
        monthName = 'July'
    } else if (month == 7){
        monthName = 'August'
    } else if (month == 8){
        monthName = 'September'
    } else if (month == 9){
        monthName = 'October'
    } else if (month == 10){
        monthName = 'November'
    } else if (month == 11){
        monthName = 'December'
    }
    if (month < 10){
        month = `0${month+1}`
    }
    if (day < 10){
        day = `0${day}`
    }

    let output = {
        _id: input._id,
        title: input.title,
        description: input.description,
        status: input.status,
        group: input.group,
        UserId: input.UserId,
        __v: input.__v,
        dbDue_date: input.due_date,
        due_date: `${year}-${month}-${day}`,
        showDue_date: `${day} ${monthName} ${year}`
    }

    return output
}

module.exports = date