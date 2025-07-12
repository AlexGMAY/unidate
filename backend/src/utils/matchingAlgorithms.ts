
// function calculateMatchScore(userA: User, userB: User): number {
//   let score = 0;
  
//   // Campus proximity (higher weight for same campus)
//   if (userA.campus === userB.campus) score += 30;
//   else if (userA.university === userB.university) score += 15;
  
//   // Field of study
//   if (userA.major === userB.major) score += 20;
//   else if (userA.faculty === userB.faculty) score += 10;
  
//   // Interests
//   const commonInterests = userA.interests.filter(i => 
//     userB.interests.includes(i));
//   score += commonInterests.length * 5;
  
//   // Relationship preferences
//   if (userA.relationshipGoal === userB.relationshipGoal) score += 15;
  
//   return Math.min(score, 100);
// }

import { User } from '@models/User';

export function calculateMatchScore(userA: User, userB: User): number {
  let score = 0;

  // Campus proximity
  if (userA.campus === userB.campus) score += 30;
  else if (userA.university === userB.university) score += 15;

  // Academic similarity
  if (userA.major === userB.major) score += 25;
  else if (userA.faculty === userB.faculty) score += 10;

  // Interests
  const commonInterests = userA.profile.interests.filter(interest => 
    userB.profile.interests.includes(interest)
  );
  score += commonInterests.length * 5;

  // Relationship goals
  if (userA.matchPreferences.relationshipGoal === 
      userB.matchPreferences.relationshipGoal) {
    score += 20;
  }

  return Math.min(score, 100);
}

export function calculateCompatibility(userA: User, userB: User) {
  const baseScore = calculateMatchScore(userA, userB);
  const distancePenalty = calculateDistancePenalty(userA, userB);
  return baseScore - distancePenalty;
}

function calculateDistancePenalty(userA: User, userB: User): number {
  // Implement actual distance calculation using geolocation
  // For now, return 0 if same campus, 5 otherwise
  return userA.campus === userB.campus ? 0 : 5;
}