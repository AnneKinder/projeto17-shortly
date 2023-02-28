import { db } from "../database/database.connection.js";
import { nanoid } from 'nanoid'

export async function shortenUrl(req, res) {

  const token = req.headers.token

  if (!token) {
    res.sendStatus(401);
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

  const shortUrl = nanoid()
  const userId = session.rows[0].user_id
  const url = res.locals.user

  try {
    await db.query(`
        INSERT INTO urls
        (user_id, original_url, short_url)
        VALUES ($1, $2, $3)
     `, [userId, url.url, shortUrl])


    const thisUrl =
      await db.query(`
        SELECT *
        FROM urls
        WHERE original_url=$1
      `, [url.url])

    const urlId = thisUrl.rows[0].id

    const body = {
      id: urlId,
      shortUrl
    }

    res.status(201).send(body)


  }
  catch (err) {
    res.status(422).send(err.message)
  }

}