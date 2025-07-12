// import { User } from '@models/User';
// import { Match } from '@models/Match';
// import { Chat } from '@models/Chat';
// import { calculateMatchScore } from '@utils/matchingAlgorithms';

// class MatchService {
//   async createMatch(userAId: string, userBId: string) {
//     const [userA, userB] = await Promise.all([
//       User.findById(userAId),
//       User.findById(userBId)
//     ]);

//     const score = calculateMatchScore(userA, userB);
//     const chat = await Chat.create({ participants: [userAId, userBId] });

//     const match = await Match.create({
//       users: [userAId, userBId],
//       matchScore: score,
//       chatId: chat._id
//     });

//     await User.updateMany(
//       { _id: { $in: [userAId, userBId] } },
//       { $push: { matches: match._id } }
//     );

//     return match;
//   }

//   async unmatch(userId: string, matchId: string) {
//     const match = await Match.findById(matchId);
    
//     if (!match.users.includes(userId)) {
//       throw new Error('Not authorized to unmatch');
//     }

//     await Match.findByIdAndUpdate(matchId, { status: 'rejected' });
//     await User.updateMany(
//       { _id: { $in: match.users } },
//       { $pull: { matches: matchId } }
//     );
//   }
// }

// export default new MatchService();

import { User, Match } from '@models';
import { calculateDistance } from '@utils/geo';
import { redisGet, redisSet } from '@config/redis';

const CACHE_TTL = 3600; // 1 hour

class MatchingService {
  async findMatches(userId: string, limit = 20) {
    const cacheKey = `matches:${userId}`;
    const cached = await redisGet(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await User.findById(userId).lean();
    const potentialMatches = await User.find({
      _id: { $ne: userId },
      verificationStatus: 'verified',
      'matchPreferences.gender': user.profile.gender,
      campus: user.campus,
      lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Active in last 30 days
    }).lean();

    const scoredMatches = potentialMatches.map(target => ({
      user: target,
      score: this.calculateCompatibility(user, target)
    })).sort((a, b) => b.score - a.score).slice(0, limit);

    await redisSet(cacheKey, JSON.stringify(scoredMatches), 'EX', CACHE_TTL);
    return scoredMatches;
  }

  private calculateCompatibility(userA: any, userB: any) {
    let score = 0;

    // Academic proximity (30% weight)
    if (userA.major === userB.major) score += 30;
    else if (userA.faculty === userB.faculty) score += 15;

    // Geographic proximity (20% weight)
    const distance = calculateDistance(
      userA.location.coordinates,
      userB.location.coordinates
    );
    score += Math.max(0, 20 - (distance / 5)); // Decrease by 1 point per 5km

    // Interest matching (25% weight)
    const commonInterests = userA.profile.interests.filter(interest => 
      userB.profile.interests.includes(interest)
    );
    score += Math.min(25, commonInterests.length * 5);

    // Relationship goals (15% weight)
    if (userA.matchPreferences.relationshipGoal === 
        userB.matchPreferences.relationshipGoal) {
      score += 15;
    }

    // Activity level (10% weight)
    const lastActiveDiff = Math.abs(
      new Date(userA.lastActive).getTime() - 
      new Date(userB.lastActive).getTime()
    );
    score += Math.max(0, 10 - (lastActiveDiff / (7 * 24 * 60 * 60 * 1000))); // Decrease by 1 point per week

    return Math.min(100, score);
  }
}

export default new MatchingService();