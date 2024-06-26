import express from 'express'; 
import globalErrorHandler from '../middleware/GlobalError.js';
import userRouter from '../user/userRoute.js';
import bookRouter from '../book/bookRoutes.js';
export const app= express();



app.use(express.json());



app.get('/',(req,res,next)=>{
      // const error= new Error('something went wrong')

      // return next(error)


    res.send('hello world')
    
        


});

// app.get('/user', (req,res,next)=>{
//     res.send(console.log('second route running on port 8001'))
// })

app.use('/api/users',   userRouter)
app.use('/api/books',   bookRouter)

app.use(globalErrorHandler);





