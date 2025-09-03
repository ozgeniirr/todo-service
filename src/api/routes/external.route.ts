import axios from "axios";
import { Router } from "express";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string; suite: string; city: string; zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: { name: string; catchPhrase: string; bs: string };
}


const router = Router();

router.get('/external-info', async (req, res )=>{
    try{

        const {data} = await axios.get<User>("https://jsonplaceholder.typicode.com/users/4");

        const augmented = {
            ...data,
            extraInfo:{
                source:'JSONPlaceholder',
                fetched: new Date().toISOString()
            },
        };

        res.json(augmented);


    }catch(error:any){
        return res.status(500).json({message:"Sunucu hatası"})
    }

})

export default router;
