import { Secret } from "../../../../src/domain/models/Secret";
import { SecretTooShortError } from "../../../../src/domain/models/errors/SecretTooShortError";

describe("Secret Test", () => {
  it("should create an instance of secret class", () => {
    expect(new Secret("123aze")).toBeInstanceOf(Secret);
  });

  it("should throw an Error if the secret has less than 3 characters", () => {
    expect(() => new Secret("12")).toThrow(SecretTooShortError);
  });

  it("should return a string representation of the toString method", () => {
    expect(new Secret("mySuperSecret").toString()).toBe("mySuperSecret");
  });
});
