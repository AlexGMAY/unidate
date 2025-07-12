import { connectToDatabase } from '@config/database';
import { User } from '@models/User';

const seedUsers = async () => {
  const users = [
    {
      email: 'student1@university.edu',
      university: 'University of Paris',
      campus: 'Paris-Saclay',
      major: 'Computer Science',
      verificationStatus: 'verified',
      profile: {
        name: 'Jean Dupont',
        interests: ['Programming', 'AI']
      }
    },
    // Add more sample users
  ];

  await User.insertMany(users);
  console.log('Database seeded successfully');
};

(async () => {
  await connectToDatabase();
  await seedUsers();
  process.exit();
})();