import { checkExpiredDates}  from '../Screens/components/checkExpiredDates'

test('removal of expired dates', () => {
 
var Dates = ["2021-03-23","2021-03-26","2021-03-27"]

expect(checkExpiredDates(Dates)).not.toContain("2021-03-23");
  });


  test('no change in dates since non expired', () => {
 
    var Dates = ["2021-03-26","2021-03-27"]
    
    expect(checkExpiredDates(Dates)).not.toContain("2021-03-23");
      });