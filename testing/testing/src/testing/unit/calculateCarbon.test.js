import { calculateCarbon } from "../../utils/calculateCarbon";

test("calculates carbon emission correctly", () => {
  expect(calculateCarbon(10, 2)).toBe(20);
});

test("returns 0 for negative values", () => {
  expect(calculateCarbon(-5, 2)).toBe(0);
});