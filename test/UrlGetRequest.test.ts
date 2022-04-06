/*
 * @Author: t_winkjqzhang
 * @Date: 2022-04-02 14:42:52
 * @LastEditTime: 2022-04-06 20:49:09
 * @Description: Do not edit
 */
import {UrlGetRequest} from "../src/index";
// import assert from "assert";

describe("UrlGetRequest", () => {
  describe("should return a UrlGetRequest number", () => {
    let url = "https://test.kugou.com/?tagid=101&origin=ktvapp";
    let urlret1 = "101";
    let urlret2 = "ktvapp";
    let urlret3 = false;
    test("params1:tagid,return urlret1:101", () => {
      expect(UrlGetRequest({url, variable:"tagid"})).toBe(urlret1);
    });
    test("params:origin,return urlret:ktvapp", () => {
      expect(UrlGetRequest({url, variable:"origin"})).toBe(urlret2);
    });
    test("params3:,return urlret3:false", () => {
      expect(UrlGetRequest({url, variable:""})).toBe(urlret3);
    });
  });
});
