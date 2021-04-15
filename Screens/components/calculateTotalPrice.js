
export function calculateTotalPrice(selectedDates, dailyRate, pickUpOptionCost) {
  var price = 0;
  var totalAmount = 0;
  if (selectedDates != undefined) {
    price = (parseInt(dailyRate) *selectedDates.length) + parseInt(pickUpOptionCost);
    var tax = price * 0.15;
    totalAmount = price + tax;
  }

  return totalAmount
}