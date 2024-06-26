import mongoose, { Schema } from "mongoose";

const bookShcema= new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:false
    },

    file:{
        type:String,
        required:true
    },
   
}, {
    timestamps:true
});

export const bookModel= mongoose.model('Book',bookShcema,)

// books