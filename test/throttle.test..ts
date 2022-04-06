/*
 * @Descripttion: 
 * @version: 
 * @Author: huawink
 * @Date: 2022-04-06 00:38:23
 * @LastEditTime: 2022-04-06 00:42:14
 */
import { throttle } from '../src';
const identity = function (value) { return value; };
describe('throttle', function () {

    it('should throttle a function', function (done) {
        var callCount = 0,
            throttled = throttle(function () { callCount++; }, 32);

        throttled();
        throttled();
        throttled();

        var lastCount = callCount;
        expect(callCount > 0).toBeTruthy();

        setTimeout(function () {
            expect(callCount > lastCount).toBeTruthy();
            done();
        }, 64);
    });
        it('subsequent calls should return the result of the first call', function (done) {
        var throttled = throttle(identity, 32),
            results = [throttled('a'), throttled('b')];

        expect(results).toEqual(['a', 'a']);

        setTimeout(function () {
            var results = [throttled('c'), throttled('d')];
            expect(results[0]).not.toBe('a');
            expect(results[0]).not.toBeUndefined();

            expect(results[0]).not.toBe('d');
            expect(results[0]).not.toBeUndefined();

            done();
        }, 64);
    });
    it('should not trigger a trailing call when invoked once', function (done) {
        var callCount = 0,
            throttled = throttle(function () { callCount++; }, 32);

        throttled();
        expect(callCount).toBe(1);

        setTimeout(function () {
            expect(callCount).toBe(1);
            done();
        }, 64);
    });
        it('should trigger a second throttled call as soon as possible', function (done) {
        var callCount = 0;

        var throttled = throttle(function () {
            callCount++;
        }, 128, { 'leading': false });

        throttled();

        setTimeout(function () {
            expect(callCount).toBe(1);
            throttled();
        }, 192);

        setTimeout(function () {
            expect(callCount).toBe(1);
        }, 254);

        setTimeout(function () {
            expect(callCount).toBe(2);
            done();
        }, 384);
    });

    it('should apply default options', function (done) {
        var callCount = 0,
            throttled = throttle(function () { callCount++; }, 32, {});

        throttled();
        throttled();

        expect(callCount).toBe(1);

        setTimeout(function () {
            expect(callCount).toBe(2);
            done();
        }, 128);
    });
})