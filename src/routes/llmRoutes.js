const express = require('express');
const router = express.Router();
const middleware = require('../middleware/llm');
const main = require('../llm/hello');

router.post('/your-thing', middleware.validate(middleware.createSchema),async (req, res)=>{
    try{
        const result = await main(req.body);
        res.json(result);
    }catch (err) {
        if (err.statusCode === 422) {
        return res.status(422).json({
            error: "Unprocessable Entity",
            message: "Model response could not be validated against schema."
        });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }

});

module.exports = router;