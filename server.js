import { Config } from "./Config/Config.js";
import connectDataBase from "./Config/Db.js";
import { app } from "./src/app.js";



const startServer= async()=>{

   await connectDataBase();


    const port= Config.port || 8000
    app.listen(port,()=>{
          console.log(`PORT listening on ${port}`);
    })
}

startServer();


 





