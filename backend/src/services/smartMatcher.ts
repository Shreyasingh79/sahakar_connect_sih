import { Worker, MatchScoreDetails } from '../types';

// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function rankWorkers(
  workers: Worker[],
  targetCategoryName?: string,
  userLat?: number,
  userLng?: number,
  radiusKm = 50
): MatchScoreDetails[] {
  // Default coordinate if none provided (e.g. Pune center: 18.5204, 73.8567)
  const defaultLat = 18.5204;
  const defaultLng = 73.8567;
  const refLat = userLat !== undefined && !isNaN(userLat) ? userLat : defaultLat;
  const refLng = userLng !== undefined && !isNaN(userLng) ? userLng : defaultLng;

  const scoredList: MatchScoreDetails[] = workers.map(worker => {
    // 1. Proximity Score (Weight: 40%)
    let distanceKm = 5.0; // fallback if worker has no coordinates
    if (worker.lat !== null && worker.lng !== null) {
      distanceKm = calculateDistanceKm(refLat, refLng, worker.lat, worker.lng);
    }
    // Inverse distance normalized between 0 and 1: 1 / (1 + distance / 10)
    const proximityScore = Math.max(0, Math.min(1, 1 / (1 + distanceKm / 8)));

    // 2. Rating Score (Weight: 30%)
    // Normalized 0 to 1 based on 5-star max
    const ratingScore = Math.max(0, Math.min(1, worker.rating_avg / 5.0));

    // 3. Availability Score (Weight: 20%)
    // 1.0 if online and available, 0.2 if busy/offline
    const availabilityScore = worker.availability_status ? 1.0 : 0.2;

    // 4. Exact Skill Match (Weight: 10%)
    // 1.0 for exact category match in skills array, 0.5 for partial/related
    let skillMatchScore = 0.5;
    if (targetCategoryName) {
      const match = worker.skills.some(
        s => s.toLowerCase() === targetCategoryName.toLowerCase() ||
             targetCategoryName.toLowerCase().includes(s.toLowerCase()) ||
             s.toLowerCase().includes(targetCategoryName.toLowerCase())
      );
      skillMatchScore = match ? 1.0 : 0.3;
    } else {
      skillMatchScore = 1.0;
    }

    // Weighted Formula as specified in SIH Problem Statement 26089
    // match_score = (0.4 * proximity) + (0.3 * rating) + (0.2 * availability) + (0.1 * skill_match)
    const weightedScore =
      0.4 * proximityScore +
      0.3 * ratingScore +
      0.2 * availabilityScore +
      0.1 * skillMatchScore;

    const roundedScore = Math.round(weightedScore * 100);

    const breakdownExplanation = `Proximity: ${(proximityScore * 100).toFixed(0)}% (${distanceKm} km) | Rating: ${(ratingScore * 100).toFixed(0)}% (${worker.rating_avg}★) | Availability: ${worker.availability_status ? 'Available (100%)' : 'Offline (20%)'} | Skill match: ${(skillMatchScore * 100).toFixed(0)}%`;

    return {
      worker,
      total_score: roundedScore,
      distance_km: distanceKm,
      proximity_score: Math.round(proximityScore * 100),
      rating_score: Math.round(ratingScore * 100),
      availability_score: Math.round(availabilityScore * 100),
      skill_match_score: Math.round(skillMatchScore * 100),
      breakdown_explanation: breakdownExplanation
    };
  });

  // Filter within radius if requested, or keep closest
  const filtered = scoredList.filter(item => item.distance_km <= radiusKm);
  const result = filtered.length > 0 ? filtered : scoredList;

  // Rank highest match score first
  return result.sort((a, b) => b.total_score - a.total_score);
}
