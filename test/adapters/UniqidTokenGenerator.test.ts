import { UniqidTokenGenerator } from "../../src/adapters/UniqidTokenGenerator";

describe("uniqidTokenGenerator Tests", () => {
  it("Should generate a token that is longer than 10 Characters", () => {
    const uniqidTokenGenerator = new UniqidTokenGenerator();
    const token = uniqidTokenGenerator.generateToken();

    expect(token.length).toBeGreaterThanOrEqual(10);
  });
});
