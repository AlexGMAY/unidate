import jwt from 'jsonwebtoken';
import { User } from '@models/User';
import { firebaseAuth } from '@config/firebase';
import { JumioClient } from 'jumio-node-client';

class AuthService {
  private jumio = new JumioClient({
    apiToken: process.env.JUMIO_API_TOKEN!,
    apiSecret: process.env.JUMIO_API_SECRET!
  });

  async initiateVerification(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const verificationUrl = await this.jumio.createVerification({
      customerInternalReference: userId,
      userConsent: true
    });
    
    return verificationUrl;
  }

  async verifyStudent(userId: string, jumioScanReference: string) {
    const result = await this.jumio.getVerificationResult(jumioScanReference);
    
    if (result.verificationStatus === 'APPROVED_VERIFIED') {
      await User.findByIdAndUpdate(userId, { 
        verificationStatus: 'verified' 
      });
      return true;
    }
    
    return false;
  }

  generateToken(userId: string) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );
  }

  async validateUniversityEmail(email: string) {
    const domain = email.split('@')[1];
    const allowedDomains = ['.edu', '.ac.fr'];
    
    if (!allowedDomains.some(d => domain.endsWith(d))) {
      throw new Error('Invalid university email domain');
    }
    
    const exists = await User.findOne({ email });
    if (exists) throw new Error('Email already registered');
  }
}

export default new AuthService();