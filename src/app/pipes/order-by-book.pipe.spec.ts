import { OrderByBookPipe } from './order-by-book.pipe';

describe('OrderByBookPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByBookPipe();
    expect(pipe).toBeTruthy();
  });
});
