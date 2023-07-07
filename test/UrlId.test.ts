import { UrlId } from "../src/UrlId";
import { UrlIdTooShortError } from "../src/UrlIdTooShortError";

describe("Secret Test", () => {
  it("should create an instance of secret class", () => {
    expect(new UrlId("13456azerty")).toBeInstanceOf(UrlId);
  });

  it("should throw an Error if the UrlId has less than 10 characters", () => {
    expect(() => new UrlId("12345")).toThrow(UrlIdTooShortError);
  });
});
