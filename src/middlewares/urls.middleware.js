import urlSchema from '../schemas/url.schema.js'



export async function urlSchemaValidation (req, res, next){
    
    const url = req.body

    const validation = urlSchema.validate(url, {abortEarly: false})

    if (validation.error){
        const errors = validation.error.details.map((detail) => detail.message)
        res.status(422).send(errors)
        return
    }




    res.locals.user = url

    next()

}
