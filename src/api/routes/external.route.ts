import axios from "axios";
import { Router } from "express";

interface User{
    id:string,
    name:string,
    email:string,
    age:number
}

const router = Router();

router.get('/external-info', async (req, res )=>{
    try{

        const {data} = await axios.get<User>("https://jsonplaceholder.typicode.com/users/4");

        const augmented = {
            ...data,
            extraInfo:{
                source:'JSONPlaceholder',
                fetched: new Date(). toISOString()
            },
        };

        res.json(augmented);


    }catch(error:any){
        return res.status(500).json({message:"Sunucu hatası"})
    }

})

export default router;
