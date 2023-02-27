import joi from 'joi'

export const signUpSchema = joi.object({
      name: joi.string().required(),
      email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
      password: joi.required(),
      confirmPassword: joi.required()
})

export const signInSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: joi.required()
})


