import { expect, it } from "bun:test";
import { render, use } from "../src";
import hello_php from "./hello.php";

it("should import PHP file", async () => {
  expect(hello_php).toEqual("Hello World!");
  expect(await use(`${import.meta.dir}/hello.php`, { name: "PHP" })).toEqual(
    "Hello PHP!",
  );
});

it("should render PHP code", async () => {
  expect(await render(`<?= "Hello $name!"; ?>`, { name: "Sigui" })).toEqual(
    "Hello Sigui!",
  );
});
