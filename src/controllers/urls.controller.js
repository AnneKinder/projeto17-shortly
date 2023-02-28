import { db } from "../database/database.connection.js";
import { nanoid } from 'nanoid'

export async function shortenUrl(req, res) {

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
        WHERE short_url=$1
      `, [shortUrl])

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

export async function getUrlById(req, res) {

  const { id } = req.params

  try {
    const urlById = await db.query(`
    SELECT *
    FROM urls
    WHERE id=$1  
    `, [id])


    if (urlById.rowCount === 0) {
      res.sendStatus(404)
      return
    }


    const body = {
      id: parseInt(id),
      shortUrl: urlById.rows[0].short_url,
      url: urlById.rows[0].original_url
    }

    res.status(200).send(body)

  }
  catch (err) {
    res.status(422).send(err.message)
  }

}

export async function openUrl(req, res) {

  const { shortUrl } = req.params

  try {

    const item = await db.query(` 
    SELECT *
    FROM urls
    WHERE short_url = $1   
   `, [shortUrl])


    if (!item) {
      res.sendStatus(404)
      return
    }

    const originalUrl = item.rows[0].original_url
    const currentVisits = parseInt(item.rows[0].qty_visits)

    res.redirect(originalUrl)

    const increment = await db.query(`
      UPDATE urls
      SET qty_visits = $1
      WHERE short_url = $2
    `, [currentVisits + 1, shortUrl])

  }
  catch (err) {
    res.status(422).send(err.message)
  }



}

export async function deleteUrlById(req, res) {

  const { id } = req.params

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

  try {
    const chosenUrl = await db.query(`
      SELECT *
      FROM urls
      WHERE id = $1
    `, [id])


    if (chosenUrl.rowCount === 0) {
      res.sendStatus(404)
      return
    }

    if (chosenUrl.rows[0].user_id === session.rows[0].user_id) {
      await db.query(`
        DELETE 
        FROM urls
        WHERE id = $1      
      `, [id])

      res.status(204).send("URL deleted.")
    }

  }
  catch (err) {
    res.status(422).send(err.message)
  }

}