import main from "../src/main";
describe("Name of the group", () => {
  test("should ", () => {
    console.log = jest.fn();
    main();
    // The first argument of the first call to the function was 'hello'
    expect(console.log).toHaveBeenCalledWith("hello world");
  });
});
