import axios from 'axios';
import { Book, User } from '@models';
import { firebaseStorage } from '@config/firebase';

const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

class ModerationService {
  async analyzeText(text: string) {
    const response = await axios.post(
      `${PERSPECTIVE_API_URL}?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        comment: { text },
        requestedAttributes: {
          TOXICITY: {}, SEXUALLY_EXPLICIT: {}, THREAT: {}
        }
      }
    );

    return response.data.attributeScores;
  }

  async scanImage(imageUrl: string) {
    // Implement Google Cloud Vision API or similar
    return { safe: true, labels: [] };
  }

  async autoModerateUserContent(userId: string) {
    const [user, books] = await Promise.all([
      User.findById(userId),
      Book.find({ uploadedBy: userId })
    ]);

    // Check profile
    const profileCheck = await this.analyzeText(
      `${user.profile.bio} ${user.profile.interests.join(' ')}`
    );

    // Check uploaded books
    const bookChecks = await Promise.all(
      books.map(async book => ({
        id: book._id,
        text: await this.analyzeText(`${book.title} ${book.description}`),
        image: await this.scanImage(book.coverUrl)
      }))
    );

    return { profileCheck, bookChecks };
  }
}

export default new ModerationService();