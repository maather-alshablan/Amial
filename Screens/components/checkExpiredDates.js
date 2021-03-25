

 export function checkExpiredDates  (dates)  {
    console.log('original dates: ', dates)
    var currentDate = new Date()
    console.log('current date', currentDate)

    var checkedDates = dates.filter(function (x) {
      //return only those dates equal or ahead of current date
      console.log(new Date(x))
      return currentDate <= new Date(x);
    });


    console.log('new dates', checkedDates)
    return checkedDates

  }