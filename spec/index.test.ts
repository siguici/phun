import { expect, it } from "bun:test";
import { use } from "../src";
import hello_php from "./hello.php";

it("should import PHP file", async () => {
  expect(hello_php).toBe("Hello World!");
  expect(await use(`${import.meta.dir}/hello.php`, { name: "PHP" })).toBe(
    "Hello PHP!",
  );
});
