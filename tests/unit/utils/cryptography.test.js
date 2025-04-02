const bcrypt = require("bcrypt");
const { createHash, comparePass } = require("../../../api/utils/cryptography");

jest.mock("bcrypt");

describe("Cryptography", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createHash", () => {
    it("should create a hash from a password", () => {
      const password = "test-password";
      const salt = "test-salt";
      const expectedHash = "test-hash";

      bcrypt.genSaltSync.mockReturnValue(salt);
      bcrypt.hashSync.mockReturnValue(expectedHash);

      const result = createHash(password);

      expect(bcrypt.genSaltSync).toHaveBeenCalled();
      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, salt);
      expect(result).toBe(expectedHash);
    });
  });

  describe("comparePass", () => {
    it("should return true when passwords match", async () => {
      const password = "test-password";
      const hash = "test-hash";

      bcrypt.compare.mockResolvedValue(true);

      const result = await comparePass(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it("should return false when passwords do not match", async () => {
      const password = "test-password";
      const hash = "test-hash";

      bcrypt.compare.mockResolvedValue(false);

      const result = await comparePass(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});
