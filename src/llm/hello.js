require('dotenv').config();
const OpenAI = require('openai');
const outputSchema = require('./schema');
const fs = require('fs');
const path = require('path');

const client = new OpenAI({
    baseURL  : process.env.LLM_BASE_URL,
    apiKey : process.env.LLM_API_KEY,
});

async function main(input){
    if(process.env.LLM_STUB === '1'){
        const stubResponse = {
            text : "Tidy vocab stub",
            confidence : 1,
        };

        return outputSchema.parse(stubResponse);
    }

    const systemPrompt = fs.readFileSync(
        path.join(__dirname, '../../prompts/tidy-v1.md'),'utf-8'
    );

    const res = await client.chat.completions.create({
        model : process.env.LLM_MODEL,
        temperature : 0.2,
        response_format : { type: "json_object" },
        messages : [
            {role : 'system', content : systemPrompt},
            {role : 'user', content : input.text}],
    });
    
    const llmResponse = JSON.parse(res.choices[0].message.content);
    return outputSchema.parse(llmResponse);
}


module.exports = main;