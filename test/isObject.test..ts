/*
 * @Descripttion: 
 * @version: 
 * @Author: huawink
 * @Date: 2022-04-06 00:44:02
 * @LastEditTime: 2022-04-06 00:51:54
 */

import {isObject} from "../src/index";

describe('isObject', () => {
    it('should be a object', (done) => {
        expect(isObject({})===true).toBeTruthy();
        done()

    });
    it('Function should be a object', (done) => {
        expect(isObject(()=>{})===true).toBeTruthy();
        done()
    });
    it('number should not be a object', (done) => {
        expect(isObject({a:1})===false).toBeTruthy();
        done()
    });
});