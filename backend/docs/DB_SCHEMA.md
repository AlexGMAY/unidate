# Database Schema

## Users Collection
```javascript
{
  _id: ObjectId,
  email: String, // university email
  verificationStatus: String, // 'pending'|'verified'|'rejected'
  profile: {
    name: String,
    interests: [String],
    pronouns: String
  },
  matchPreferences: {
    maxDistance: Number,
    relationshipGoal: String
  },
  location: {
    type: "Point",
    coordinates: [Number] // [longitude, latitude]
  }
}
```

## Matches Collection
```javascript
{
  users: [ObjectId], // Sorted [userA, userB] where userA < userB
  status: String,
  matchScore: Number,
  chatId: ObjectId
}
```