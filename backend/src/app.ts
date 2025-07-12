import express from 'express';
import { connectToDatabase } from '@config/database';
import { initializeRedis } from '@config/redis';
import authRoutes from '@routes/auth.routes';
import userRoutes from '@routes/user.routes';

const app = express();
const PORT = process.env.PORT || 5526;

// Middleware
app.use(express.json());

// Database connections
(async () => {
  await connectToDatabase();
  await initializeRedis();
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});