import { db } from "../database/database.connection.js";

export async function shortenUrl(req, res){

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
  
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


    try{
        console.log("Tem sessão rodando uhul")
        console.log(token)
    }
    catch(err){
        res.status(422).send(err.message)
    }


}