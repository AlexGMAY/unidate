// // src/services/bookhub.service.ts
// class BookHubService {
//   async uploadResource(userId: string, file: Express.Multer.File, metadata: {
//     title: string;
//     courseCode: string;
//     description: string;
//     isPublic: boolean;
//   }) {
//     // Check DMCA compliance
//     // Store in Firebase Storage
//     // Add to database with moderation status "pending"
//     // Notify moderators
//   }
  
//   async searchResources(query: {
//     text?: string;
//     courseCode?: string;
//     university?: string;
//     fileType?: string;
//   }) {
//     // Elasticsearch or MongoDB text search
//     // Apply filters
//     // Return paginated results
//   }
// }


import { Book } from '@models/Book';
import { firebaseStorage } from '@config/firebase';
import { v4 as uuidv4 } from 'uuid';

class BookHubService {
  private bucket = firebaseStorage.bucket();

  async uploadTextbook(userId: string, file: Express.Multer.File, metadata: {
    title: string;
    author: string;
    courseCode: string;
    isPublic: boolean;
  }) {
    const filename = `books/${uuidv4()}-${file.originalname}`;
    const fileRef = this.bucket.file(filename);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          uploadedBy: userId,
          ...metadata
        }
      }
    });

    const book = await Book.create({
      title: metadata.title,
      author: metadata.author,
      courseCode: metadata.courseCode,
      fileUrl: `https://storage.googleapis.com/${this.bucket.name}/${filename}`,
      uploadedBy: userId,
      isPublic: metadata.isPublic
    });

    return book;
  }

  async searchBooks(query: string, filters: {
    courseCode?: string;
    university?: string;
  }) {
    let searchQuery: any = { 
      $text: { $search: query } 
    };

    if (filters.courseCode) {
      searchQuery.courseCode = filters.courseCode;
    }

    return Book.find(searchQuery)
      .sort({ score: { $meta: "textScore" } })
      .limit(20);
  }
}

export default new BookHubService();