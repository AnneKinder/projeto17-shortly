import { db } from "../database/database.connection.js";

export async function getRank (req, res) {


    try{

        const ranking = await db.query(`
        SELECT users.id, users.name, COUNT(urls.user_id), SUM(urls.qty_visits)
        FROM urls
        JOIN users
        ON users.id=urls.user_id
        GROUP BY users.id
        ORDER BY SUM(urls.qty_visits) desc
        LIMIT 10      
        `)

       // res.status(200).send(body)
    
    }
    catch (err) {
        res.status(422).send(err.message)
    }

}