import { Config } from "../Config/Config.js";

const  globalErrorHandler = (err,req,res,next)=>{

    const statusCode= err.statusCode || 500;

    res.status(statusCode).json({
        success:false,
        message:err.message,
        errStack: Config.env ==='development'? err.stack :""
    })

};


export default globalErrorHandler;