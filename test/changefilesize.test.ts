/*
 * @Author: t_winkjqzhang
 * @Date: 2022-04-02 14:42:37
 *
 * @LastEditTime: 2022-04-02 15:38:31
 * @Description: Do not edit
 */
import {changefilesize} from "../src/index";

describe("changefilesize", () => {
  describe("should return a filesize string", () => {
    test("param:1023,return 1023b", () => {
      expect(changefilesize(10)).toBe("10B");
    });
    test("param:1024,return 1Kb", () => {
      expect(changefilesize(1024)).toBe("1KB");
    });
    test("param:1024 * 1024,return 1MB", () => {
      expect(changefilesize(1024 * 1024)).toBe("1MB");
    });
    test("param:1024 * 1024 * 1024,return 1GB", () => {
      expect(changefilesize(1024 * 1024 * 1024)).toBe("1GB");
    });
  });
});
