import { formatCurrency } from "../scripts/utils/money"

describe('test suit for formatcurrency', () => {
  it('convert cents into dollars', () => {
    expect(formatCurrency(2095)).toEqual('20.95');
  });
} );