import log from '../src';

describe('simple test', () => {
    it('should pass', () => {
        const spy = jest.fn();

        log(spy);
        expect(spy).toHaveBeenCalled();
    });
});
