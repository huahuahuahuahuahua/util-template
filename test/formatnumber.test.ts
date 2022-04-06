/*
 * @Author: t_winkjqzhang
 * @Date: 2022-04-02 16:24:37
 * @LastEditTime: 2022-04-06 01:20:13
 * @Description:
 */
import {formatNumber} from "../src/index";

describe("formatNumber", () => {
  describe("should return a formatNumber string", () => {
    test("param:999,return 999", () => {
      expect(formatNumber(140)).toStrictEqual({
      "number":"140",
      "value":"",
    });
    });
    test("param:1400,return 1.40 千", () => {
      expect(formatNumber(1400)).toStrictEqual(
        { "number":"1.40", "value":"千",}
        );
    });
    test("param:14000,return 1.40 万", () => {
      expect(formatNumber(14000)).toStrictEqual({
      "number":"1.40",
      "value":"万",
      });
    });
    test("param:140000,return 14.00 万", () => {
      expect(formatNumber(140000)).toStrictEqual({
      "number":"14.00",
      "value":"万",
    });
    });
    test("param:1400000,return 1.40 百万", () => {
      expect(formatNumber(1400000)).toStrictEqual({
      "number":"1.40",
      "value":"百万",
    });
    });
    test("param:14000000,return 1.40 千万", () => {
      expect(formatNumber(14000000)).toStrictEqual({
      "number":"1.40",
      "value":"千万",
    });
    });
    test("param:140000000,return 1.40 亿", () => {
      expect(formatNumber(140000000)).toStrictEqual({
      "number":"1.40",
      "value":"亿",
    });
    });
    test("param:1400000000,return 14.00 亿", () => {
      expect(formatNumber(1400000000)).toStrictEqual({
      "number":"14.00",
      "value":"亿",
    });
    });
    // test("param:14000000000,return 1.40 百亿", () => {
    //   expect(formatNumber(14000000000000)).toBe("1.40");
    // });
    // test("param:140000000000,return 1.40 千亿", () => {
    //   expect(formatNumber(140000000000000)).toBe("1.40");
    // });
    // test("param:1400000000000,return 1.40 万亿", () => {
    //   expect(formatNumber(1400000000000)).toBe("1.40");
    // });
    test("param:14000000000,return error", () => {
      expect(formatNumber(14000000000)).toStrictEqual({"msg":"error 请输入1-10000000000 的数字"});
    });
  });
});
