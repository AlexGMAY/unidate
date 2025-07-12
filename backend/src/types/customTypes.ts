import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        verificationStatus: string;
      } & Document;
    }
  }
}

export interface JumioVerificationResult {
  scanReference: string;
  verificationStatus: 'APPROVED_VERIFIED' | 'DENIED_FRAUD';
  documentType: 'PASSPORT' | 'DRIVER_LICENSE';
}