/*
 * @Author: t_winkjqzhang
 * @Date: 2022-04-02 15:46:27
 * @LastEditTime: 2022-04-02 15:48:41
 * @Description:
 */
import main from "../src/main";
describe("Name of the group", () => {
  test("should ", () => {
    console.log = jest.fn();
    main();
    // The first argument of the first call to the function was 'hello'
    expect(console.log).toHaveBeenCalledWith("hello world");
  });
});
