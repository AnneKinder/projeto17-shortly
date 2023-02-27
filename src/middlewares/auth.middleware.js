import { signUpSchema, signInSchema } from "../schemas/auth.schema.js";
import { db } from "../database/database.connection.js";

export async function signUpSchemaValidation (req, res, next){
    
    const user = req.body

    const validation = signUpSchema.validate(user, {abortEarly: false})

    if (validation.error){
        const errors = validation.error.details.map((detail) => detail.message)
        res.status(400).send(errors)
        return
    }

    const emailExists = await db.query(`SELECT * FROM users WHERE email=$1`, [user.email])

    if (
        emailExists.rowCount!==0
        ){
        res.status(409).send("Email already in use.")
        return
    }

    if(user.password!== user.confirmPassword){
        res.status(422).send("Passwords don't match.")
        return
    }

    res.locals.user = user

    next()

}

export async function signInSchemaValidation (req, res, next){

    const user = req.body

    const validation = signInSchema.validate(user, {abortEarly: false})

    if (validation.error){
        const errors = validation.error.details.map((detail) => detail.message)
        res.status(402).send(errors)
        return
    }

    const emailExists = await db.query(`SELECT * FROM users WHERE email=$1`, [user.email])

    if (
        emailExists.rowCount==0
        ){
        res.status(401).send("User not registered.")
        return
    }

    res.locals.user = user

    next()

}