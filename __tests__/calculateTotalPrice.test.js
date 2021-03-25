import { calculateTotalPrice}  from '../Screens/components/calculateTotalPrice'

test('total price of request', () => {
    expect(calculateTotalPrice(["2021-03-27"],250, 20)).toBeCloseTo(310.5);
  });


  test('total price of request for two days', () => {
    expect(calculateTotalPrice(["2021-03-27","2021-03-28"],250, 20)).toBeCloseTo(598); 
  });