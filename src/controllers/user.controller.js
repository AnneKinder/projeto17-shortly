import { db } from "../database/database.connection.js";

export async function myProfile(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        res.sendStatus(401);
        return;
    }

    const session = await db.query(`
          SELECT * 
          FROM sessions
          WHERE token = $1
          `, [token])

    if (session.rowCount === 0) {
        res.sendStatus(401);
        return;
    }

    let shortenedUrlsArray = []

    try {

        const user = await db.query(` 
            SELECT * 
            FROM users
            WHERE id= $1
        `, [session.rows[0].user_id])

        const urlsByUser = await db.query(` 
            SELECT * 
            FROM urls
            WHERE user_id = $1
        `, [user.rows[0].id])

        const visitSum = await db.query(` 
            SELECT SUM(qty_visits)
            FROM urls
            WHERE user_id= $1    
            `, [user.rows[0].id])


        for (let i = 0; i < urlsByUser.rowCount; i++) {
            shortenedUrlsArray.push(
                {
                    id: urlsByUser.rows[i].id,
                    shortUrl: urlsByUser.rows[i].short_url,
                    url: urlsByUser.rows[i].original_url,
                    visitCount: urlsByUser.rows[i].qty_visits
                }
            )
        }


        const body = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitCount: visitSum.rows[0].sum,
            shortenedUrls: shortenedUrlsArray
        }

        res.status(200).send(body)

    }
    catch (err) {
        res.status(422).send(err.message)
    }

}