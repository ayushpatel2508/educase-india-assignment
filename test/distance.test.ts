import { calculateDistance } from "../src/utils/distance";

describe("calculateDistance", () => {
  it("should calculate distance between two coordinates accurately", () => {
    // Distance between Delhi (28.6139, 77.2090) and Mumbai (19.0760, 72.8777)
    // is approximately 1148 km
    const dist = calculateDistance(28.6139, 77.2090, 19.0760, 72.8777);
    expect(dist).toBeGreaterThan(1140);
    expect(dist).toBeLessThan(1160);
  });

  it("should return 0 for the same coordinates", () => {
    const dist = calculateDistance(28.6139, 77.2090, 28.6139, 77.2090);
    expect(dist).toBe(0);
  });
});
