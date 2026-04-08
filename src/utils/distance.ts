/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - User's latitude
 * @param lon1 - User's longitude
 * @param lat2 - School's latitude
 * @param lon2 - School's longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R: number = 6371; // Earth's radius in kilometers
  const dLat: number = (lat2 - lat1) * (Math.PI / 180);
  const dLon: number = (lon2 - lon1) * (Math.PI / 180);

  const a: number =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance: number = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};
