import mongoose from "mongoose";
import { Config } from "./Config.js";


const connectDataBase= async()=>{



try {
    mongoose.connection.on('error',(err)=>{
        console.log('error in connecting database',err);
    })


    mongoose.connection.on('connected',()=>{
        console.log('database connected successfully');
    });
   

   await  mongoose.connect(Config.databaseUrl)


    
} catch (error) {
    console.log('database connection failed',error);
    process.exit(1)
    
}
    

};

export default connectDataBase;