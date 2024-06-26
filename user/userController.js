import { userModel } from "./userModel.js";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import { Config } from "../Config/Config.js";

 export const createUser=  async (req,res,next)=>{

    

    // validation
    try {
        const {name,password,email}=req.body;
        if(!name || !password || !email){
            const error = new Error('ALL FIELDS are required')
            return next(error)
        }
         const user= await userModel.findOne({email});

         if(user){
            next( new Error('user ALready exist'))
         }
        //    password hash
         const hashPassword= await bcrypt.hash(password,10);

         

    
         const newUser= await userModel.create({
            name,
            password:hashPassword,
            email



         });


         const token=JWT.sign({sub:newUser._id},Config.jwtToken,{expiresIn:'7d'} )

        //  access token


    
        res.json({
             accessToken:token
        })
        
    } catch (error) {
        
    }
    
}
//  login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error('Email and password are required');
            return next(error);
        }

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new Error('User not found'));
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next(new Error('Incorrect password'));
        }

        // Generate JWT token
        const token = JWT.sign({ sub: user._id }, Config.jwtToken, { expiresIn: '7d' });

        // Respond with access token
        res.json({
            user:user._id
        });
    } catch (error) {
        next(error);
    }
}


