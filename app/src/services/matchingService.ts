import { Assignment, User, AvailabilitySlot, HelperScore } from '../types';

/**
 * Calculates distance based on ZIP code difference
 * Simple approximation: each digit difference ≈ 10 km
 */
function calculateDistance(zip1: string | undefined, zip2: string | undefined): number {
  if (!zip1 || !zip2) return 999;
  
  const diff = Math.abs(parseInt(zip1) - parseInt(zip2));
  return Math.min(diff * 10, 999); // Cap at 999 km
}

/**
 * Checks if a helper is available during the assignment time
 */
function checkAvailability(
  assignment: Assignment,
  helperSlots: AvailabilitySlot[]
): number {
  if (helperSlots.length === 0) return 0;

  const assignmentDate = new Date(assignment.start);
  const assignmentDay = assignmentDate.getDay();
  const assignmentStart = assignmentDate.toTimeString().slice(0, 5); // HH:mm
  const assignmentEnd = new Date(assignment.end).toTimeString().slice(0, 5);

  // Find matching day slots
  const daySlots = helperSlots.filter(slot => slot.dayOfWeek === assignmentDay);
  
  if (daySlots.length === 0) return 0;

  // Check if any slot overlaps with assignment time
  const hasOverlap = daySlots.some(slot => {
    return slot.startTime <= assignmentStart && slot.endTime >= assignmentEnd;
  });

  return hasOverlap ? 100 : 50; // 100% if fully available, 50% if partially
}

/**
 * Calculates skill match percentage
 */
function calculateSkillMatch(
  requiredSkills: string[],
  helperSkills: string[] | undefined
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!helperSkills || helperSkills.length === 0) return 0;

  const matchingSkills = requiredSkills.filter(skill => 
    helperSkills.includes(skill)
  );

  return Math.round((matchingSkills.length / requiredSkills.length) * 100);
}

/**
 * Calculates overall score for a helper
 * Weights: Availability 40%, Skills 40%, Distance 20%
 */
function calculateOverallScore(
  availabilityMatch: number,
  skillMatch: number,
  distance: number
): number {
  // Distance score (closer is better, max distance 100km for full points)
  const distanceScore = Math.max(0, 100 - distance);
  
  // Weighted average
  const score = (
    availabilityMatch * 0.4 +
    skillMatch * 0.4 +
    distanceScore * 0.2
  );

  return Math.round(score);
}

/**
 * Finds the best matching helpers for an assignment
 */
export function findBestHelpers(
  assignment: Assignment,
  helpers: User[],
  availabilitySlots: AvailabilitySlot[]
): HelperScore[] {
  const scores: HelperScore[] = helpers.map(helper => {
    const helperSlots = availabilitySlots.filter(slot => slot.userId === helper.id);
    
    const distance = calculateDistance(assignment.address?.zipCode, helper.address?.zipCode);
    const availabilityMatch = checkAvailability(assignment, helperSlots);
    const skillMatch = calculateSkillMatch(assignment.requiredSkills, helper.skills);
    const score = calculateOverallScore(availabilityMatch, skillMatch, distance);

    return {
      helperId: helper.id,
      helperName: `${helper.firstname} ${helper.surname}`,
      score,
      distance,
      availabilityMatch,
      skillMatch,
    };
  });

  // Sort by score (highest first)
  return scores.sort((a, b) => b.score - a.score);
}
