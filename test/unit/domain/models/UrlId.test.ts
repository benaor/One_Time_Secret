import { UrlId } from "../../../../src/domain/models/UrlId";
import { UrlIdTooShortError } from "../../../../src/domain/models/errors/UrlIdTooShortError";

describe("Secret Test", () => {
  it("should create an instance of secret class", () => {
    expect(new UrlId("13456azerty")).toBeInstanceOf(UrlId);
  });

  it("should throw an Error if the UrlId has less than 10 characters", () => {
    expect(() => new UrlId("12345")).toThrow(UrlIdTooShortError);
  });

  it("should return a string representation of the toString method", () => {
    expect(new UrlId("13456azerty").toString()).toBe("13456azerty");
  });
});
