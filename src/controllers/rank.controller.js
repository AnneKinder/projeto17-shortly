import { db } from "../database/database.connection.js";

export async function getRank (req, res) {

    try{
        const body = await db.query(`
        SELECT 
        users.id AS id, 
        users.name AS name, 
        COUNT(urls.user_id) AS "linksCount", 
        SUM(urls.qty_visits) AS "visitCount"
        
            FROM urls
            JOIN users
            ON users.id=urls.user_id
            GROUP BY users.id
            ORDER BY SUM(urls.qty_visits) desc
            LIMIT 10       
        `)

       res.status(200).send(body.rows)
    
    }
    catch (err) {
        res.status(422).send(err.message)
    }
}
