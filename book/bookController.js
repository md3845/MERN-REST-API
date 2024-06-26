import cloudinary from "../Config/Cloudinary.js";
import { fileURLToPath } from 'url';
import path from 'node:path';
import fs from 'fs';
import { bookModel } from "./bookModel.js";
import createHttpError from "http-errors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBook = async (req, res, next) => {
  try {
    const { title, genre } = req.body;
    // console.log('Files', req.files);
    

    // Ensure the cover image is available
    if (!req.files || !req.files.coverImage || !req.files.coverImage[0]) {
      throw new Error('Cover image is required');
    }

    const coverImageFile = req.files.coverImage[0];
    const coverImageFileName = coverImageFile.filename;
    const coverImageFilePath = path.resolve(__dirname, '../public/data/uploads', coverImageFileName);
    const coverImageMimeType = coverImageFile.mimetype.split('/').pop();

    console.log('Cover image file path:', coverImageFilePath);

    // Upload the cover image to Cloudinary
    const coverResult = await cloudinary.uploader.upload(coverImageFilePath, {
      public_id: coverImageFileName,
      folder: 'books_covers',
      resource_type: 'image'
    });

    console.log('Cover image upload result:', coverResult);

    // Ensure the PDF file is available
    if (!req.files || !req.files.file || !req.files.file[0]) {
      throw new Error('PDF file is required');
    }

    const bookFile = req.files.file[0];
    const bookFileName = bookFile.filename;
    const bookFilePath = path.resolve(__dirname, '../public/data/uploads', bookFileName);

    console.log('Book file path:', bookFilePath);

    // Upload the PDF file to Cloudinary
    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      public_id: bookFileName,
      folder: 'book-pdfs',
      format: 'pdf'
    });

    console.log('Book file upload result:', bookFileUpload);
    console.log('userId', req.userId);

    //book create

    const newBook = await bookModel.create({
      title,
      genre,
      // author: "667add0be09424c8e7a5a06b", // Use the author ID directly
      author: req.userId,
      coverImage: coverResult.secure_url,
      file: bookFileUpload.secure_url,
    });
    
    // Delete temp files
    try {
      await fs.promises.unlink(bookFilePath);
      await fs.promises.unlink(coverImageFilePath);
      
      res.status(201).json({ id: newBook._id });
    } catch (error) {
      console.error('Error deleting files:', error);
      res.status(500).json({ success: false, error: 'Failed to delete files' });
    }
    

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file', error: error.message });
  }
};


//update


export const updateBook = async (req, res, next) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    console.log('Request params:', req.params);
    console.log(`Updating book with ID: ${bookId}`);

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      console.log("Book not found");
      return next(createHttpError(404, "Book not found"));
    }

    //check Access
    if (book.author.toString() !== req.userId) {
      console.log("Unauthorized access attempt");
      return next(createHttpError(403, "Unauthorized"));
    }

    let completeCoverImage = book.coverImage;
    if (req.files && req.files.coverImage) {
      console.log("Cover image found in request");
      const coverImageFile = req.files.coverImage[0];
      const coverImageFileName = coverImageFile.filename;
      const coverImageFilePath = path.resolve(__dirname, "../public/data/uploads", coverImageFileName);

      console.log('Cover image file:', coverImageFile);
      console.log('Cover image file path:', coverImageFilePath);

      // Check if the file exists
      if (fs.existsSync(coverImageFilePath)) {
        console.log('Cover image file exists');
        const coverResult = await cloudinary.uploader.upload(coverImageFilePath, {
          public_id: coverImageFileName,
          folder: "book-covers"
        });
        completeCoverImage = coverResult.secure_url;
        await fs.promises.unlink(coverImageFilePath);
      } else {
        console.error('Cover image file does not exist:', coverImageFilePath);
        return next(createHttpError(400, "Cover image file does not exist"));
      }
    }

    let completeFileName = book.file;
    if (req.files && req.files.file) {
      console.log("Book file found in request");
      const bookFile = req.files.file[0];
      const bookFileName = bookFile.filename;
      const bookFilePath = path.resolve(__dirname, "../public/data/uploads", bookFileName);

      console.log('Book file:', bookFile);
      console.log('Book file path:', bookFilePath);

      // Check if the file exists
      if (fs.existsSync(bookFilePath)) {
        console.log('Book file exists');
        const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
          resource_type: 'raw',
          public_id: bookFileName,
          folder: "book-files",
        });
        completeFileName = bookFileUpload.secure_url;
        await fs.promises.unlink(bookFilePath);
      } else {
        console.error('Book file does not exist:', bookFilePath);
        return next(createHttpError(400, "Book file does not exist"));
      }
    }

    console.log("Updating book in database");
    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: completeCoverImage,
        file: completeFileName,
      },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    next(error);
  }
};
 // get all book
export const listBook = async (req, res, next ) =>{
  try {
    //add pagination name: (mongo pagination)
    const book = await bookModel.find()
    res.json(book)
    
  } catch (error) {
    next(createHttpError(500, "Error, while getting a book"))
  }
}

export const getSingleBook = async (req, res, next ) =>{

  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findOne({_id: bookId})
    if(!book){
      return next(createHttpError(404, "Book not found"))
    }

    return res.json(book)
  } catch (error) {
    next(createHttpError(500, "Error, while getting a book"))
  }
}


export const deleteBook = async (req, res, next ) =>{
  const bookId = req.params.bookId;
  
  const book = await bookModel.findOne({_id: bookId})
    if(!book){
      return next(createHttpError(404, "Book not found"))
    }

    //check access
    if (book.author.toString() !== req.userId) {
      console.log("Unauthorized access attempt");
      return next(createHttpError(403, "Unauthorized"));
    }


    //delete

    //cloudinay public id (book-covers/d9ffc1eb03a586f15ff54ddceeece54f)
    //mongoosedb url(https://res.cloudinary.com/diz8k5d1u/image/upload/v1719330099/books_covers/0558f99ac43ae51739db911a802ceb9b.jpg)
     
    //image
    const coverFileSplit = book.coverImage.split('/');
    const coverFileImage = coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split('.').at(-2); 


    // console.log("coverFileImage", coverFileImage);
    // console.log("coverFileSplit", coverFileSplit);

    //file
    const bookFileSplit = book.file.split('/');
    const bookFilePublic = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);

    // console.log("bookFilePublic", bookFilePublic);

    //delete image & file
    try {
      await cloudinary.uploader.destroy(coverFileImage)
    } catch (error) {
      next(createHttpError(404, "Image not found"))
    }
    try {
      await cloudinary.uploader.destroy(bookFilePublic, {
        resource_type: "raw",
      })
      
    } catch (error) {
      next(createHttpError(404, "File not found"))
    }

    //database remove
    await bookModel.deleteOne({_id: bookId})


    return res.sendStatus(204);
}
