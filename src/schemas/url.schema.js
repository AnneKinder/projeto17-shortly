import joi from 'joi'

    const urlSchema = joi.object({
        url: joi.uri().string().required()
    })

    export default urlSchema