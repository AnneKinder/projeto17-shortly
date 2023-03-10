import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())


import authRouter from './routes/auth.router.js';
import urlRouter from './routes/urls.router.js';
import userRouter from './routes/user.router.js';
import rankRouter from './routes/rank.router.js'

app.use ([authRouter, urlRouter, userRouter, rankRouter])

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running in port ${port}.`))
