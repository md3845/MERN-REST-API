import createHttpError from "http-errors";
import { Config } from "../Config/Config.js";
import  jwt  from "jsonwebtoken";

const authenticate = (req, res, next)=>{
    const token = req.header('Authorization')
    if(!token){
        return next(createHttpError(401, "Authorization token is required."))
    }

    
    //token decode
    try{
    const parsedToken = token.split(" ")[1];
    const decode = jwt.verify(parsedToken, Config.jwtToken);
    req.userId = decode.sub
    // console.log('decode', decode);

    next();
    }catch(err){
    return next(createHttpError(401, 'Token expired.'))
    }
}

export default authenticate;