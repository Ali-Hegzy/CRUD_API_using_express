const express = require('express');
const router = express.Router();
const middleware = require('../middleware/llm');
const main = require('../llm/hello');

router.post('/your-thing', middleware.validate(middleware.createSchema),async (req, res)=>{
    const result = await main(req.body);

    res.json(result);
});

module.exports = router;