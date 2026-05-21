import { validateSchool, validateListSchools } from "../src/utils/validation";

describe("Input Validation", () => {
  describe("validateSchool", () => {
    it("should pass for valid school data", () => {
      const result = validateSchool({
        name: "Greenwood High School",
        address: "123 Education Lane, Bangalore",
        latitude: 12.9716,
        longitude: 77.5946,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Greenwood High School");
      }
    });

    it("should fail when name is too short", () => {
      const result = validateSchool({
        name: "A",
        address: "123 Education Lane, Bangalore",
        latitude: 12.9716,
        longitude: 77.5946,
      });
      expect(result.success).toBe(false);
    });

    it("should fail when latitude is out of bounds", () => {
      const result = validateSchool({
        name: "Greenwood High School",
        address: "123 Education Lane, Bangalore",
        latitude: 95.0,
        longitude: 77.5946,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("validateListSchools", () => {
    it("should pass for valid list school query params", () => {
      const result = validateListSchools({
        latitude: 28.6139,
        longitude: 77.2090,
      });
      expect(result.success).toBe(true);
    });

    it("should fail when longitude is out of bounds", () => {
      const result = validateListSchools({
        latitude: 28.6139,
        longitude: -200,
      });
      expect(result.success).toBe(false);
    });
  });
});
