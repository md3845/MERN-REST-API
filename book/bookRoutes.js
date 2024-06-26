import express from 'express';
import multer from 'multer';
import path from 'node:path'
import  {fileURLToPath} from 'url';
import fs from 'fs';
import { createBook, deleteBook, getSingleBook, listBook, updateBook } from './bookController.js';
import authenticate from '../middleware/Authentication.js';

 const __filename= fileURLToPath(import.meta.url);
 const  __dirname= path.dirname(__filename);



const bookRouter=express.Router()

const upload=multer({
    dest:path.resolve(__dirname,'../public/data/uploads'),
    //put limit 10mb max
    limits: { fieldSize: 3e7},

    
});

bookRouter.post(
    '/' ,
    authenticate,
    upload.fields
    ([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}
    
]) ,createBook)

//update

bookRouter.patch(
    '/:bookId' ,
    authenticate,
    upload.fields
    ([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}
    
]) ,updateBook)


// public data show  unauthorized user all list
bookRouter.get('/', listBook)

// single book
bookRouter.get('/:bookId', getSingleBook)

//delete
bookRouter.delete('/:bookId', authenticate, deleteBook)

export default bookRouter;