import { firstAvailableOrder } from './display-order';

describe('Automatic display order', () => {
  it('starts at one and fills the first vacant position', () => {
    expect(firstAvailableOrder([])).toBe(1);
    expect(
      firstAvailableOrder([
        { displayOrder: 0 },
        { displayOrder: 1 },
        { displayOrder: 3 },
        { displayOrder: 3 },
      ]),
    ).toBe(2);
    expect(
      firstAvailableOrder([{ displayOrder: 1 }, { displayOrder: 2 }]),
    ).toBe(3);
  });
});
