import { db } from "../database/database.connection.js";

export async function getRank (req, res) {

    try{
        const body = await db.query(`
        SELECT json_build_object(
            'id', users.id,
            'name', users.name,
            'linksCount', COUNT(urls.user_id),
            'visitCount', SUM(urls.qty_visits)
        )
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