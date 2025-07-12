# Unidate API Documentation

## Authentication
`POST /api/auth/register`
```json
{
  "email": "user@university.edu",
  "password": "securePassword123!",
  "university": "University of Paris"
}
```

## User Profile
`GET /api/users/me`
```json
{
  "_id": "5f8d...",
  "email": "user@university.edu",
  "verificationStatus": "verified",
  "profile": {
    "name": "Jean Dupont",
    "interests": ["AI", "Robotics"]
  }
}
```

## Matching
`GET /api/matches/suggestions`
```json
{
  "matches": [
    {
      "user": {
        "_id": "5f8e...",
        "profile": { "name": "Marie Curie" }
      },
      "score": 85
    }
  ]
}
```

## BookHub
`POST /api/books/upload`
```json
{
  "title": "Advanced Machine Learning",
  "courseCode": "CS501",
  "file": "<binary data>"
}
```