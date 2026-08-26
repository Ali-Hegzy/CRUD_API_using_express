const {z} = require('zod');

const createSchema = z.object({
    text : z.string().min(1, 'Text is required').max(2000,'Max text length is 2000 characters')
});

const validate = (schema) => (req, res, next)=>{ // High order function
    const result = schema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            error : "Validation Failed",
            details : result.error.message,
        });
    }

    req.body = result.data;
    next();
}

module.exports = {validate, createSchema};