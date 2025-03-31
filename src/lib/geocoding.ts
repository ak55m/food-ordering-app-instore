/**
 * Geocoding utility functions
 */

// Convert coordinates to address using reverse geocoding
export async function geocodeCoordinates(latitude: number, longitude: number): Promise<string | null> {
  try {
    // In a real app, you would use a geocoding API like Google Maps, Mapbox, etc.
    // For this demo, we'll simulate with a hardcoded response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    return "Your location";
  } catch (error) {
    console.error('Error in geocoding:', error);
    return null;
  }
}

// Calculate distance between two coordinates using the Haversine formula
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}
