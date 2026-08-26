require('dotenv').config();
const OpenAI = require('openai');
const outputSchema = require('./schema');

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

    const systemPrompt = `You are a vocabulary tidying assistant.
                    Task:
                    1. Replace messy vocabulary/abbreviations with proper terms (e.g. "SWE" -> "Software Engineer").
                    2. Never change normal vocabulary or delete text.
                    3. If unsure, return the word with your low confidence guess in square brackets "[guess]".
                    4. Return ONLY valid JSON conforming to this schema:
                    {
                    "text": "tidy string",
                    "confidence": 0.0 to 1.0
                    }`;

    const res = await client.chat.completions.create({
        model : process.env.LLM_MODEL,
        response_format : { type: "json_object" },
        messages : [
            {role : 'system', content : systemPrompt},
            {role : 'user', content : input.text}],
    });
    
    const llmResponse = JSON.parse(res.choices[0].message.content);
    return outputSchema.parse(llmResponse);
}


module.exports = main;