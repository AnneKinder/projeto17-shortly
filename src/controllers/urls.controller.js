import { db } from "../database/database.connection.js";
import {nanoid} from 'nanoid'

export async function shortenUrl(req, res){

    const token = req.headers.token

    const shortUrl= nanoid()
    

    if (!token) {
      res.sendStatus(500);
      return;
    }
  
    
    const session = await db.query(`
        SELECT * 
        FROM sessions
        WHERE token = $1
        `, [token])

    if (!session) {
      res.sendStatus(401);
      return;
    }


    const url = res.locals.user

    try{
        console.log("Tem sessão rodando uhul")

    }
    catch(err){
        res.status(422).send(err.message)
    }


}