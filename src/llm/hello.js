require('dotenv').config();
const OpenAI = require('openai');
const outputSchema = require('./schema');
const fs = require('fs');
const path = require('path');
const { extractJson, logToQuarantine } = require("./utilis");

const client = new OpenAI({
    baseURL  : process.env.LLM_BASE_URL,
    apiKey : process.env.LLM_API_KEY,
});
const PROMPT_VERSION = 'v1';
const systemPrompt = fs.readFileSync(
    path.join(__dirname, `../../prompts/tidy-${PROMPT_VERSION}.md`),'utf-8'
);

function validate(rawText){
    const jsonResult = extractJson(rawText);
    if(!jsonResult.success){
        return {
            success : false,
            message : `JSON Parse Error: ${jsonResult.error}`
        }
    }
    const schemaResult = outputSchema.safeParse(jsonResult.data);
    if (!schemaResult.success) {
        return {
        success: false,
        error: `Schema Validation Error: ${JSON.stringify(schemaResult.error.flatten().fieldErrors)}`,
        };
    }

    return { success: true, data: schemaResult.data };
}

async function main(input){
    if(process.env.LLM_STUB === '1'){
        const stubResponse = {
            text : "Tidy vocab stub",
            confidence : 1,
        };

        return outputSchema.parse(stubResponse);
    }

    const message = [
            {role : 'system', content : systemPrompt},
            {role : 'user', content : input.text}
        ];

    // First try
    const firstReq = await client.chat.completions.create({
        model : process.env.LLM_MODEL,
        temperature : 0.2,
        response_format : { type: "json_object" },
        messages : message,
    });
    
    const firstLLMResponse = firstReq.choices[0].message.content;

    const firstLLMResponseCheck = validate(firstLLMResponse);

    if(firstLLMResponseCheck.success){
        return firstLLMResponseCheck.data;
    }

    // Second try
    const repairMessages = [
    ...message,
    { role: 'assistant', content: firstLLMResponse },
    {
        role: 'user',
        content: `Your previous answer was rejected for this reason: ${firstLLMResponseCheck.error}. Return only corrected JSON matching the schema.`,
        },
    ];

    const secondReq = await client.chat.completions.create({
        model: process.env.LLM_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: repairMessages,
    });

    const secondLLMResponse = secondReq.choices[0].message.content;
    const secondLLMResponseCheck = validate(secondLLMResponse);
    
    if(secondLLMResponseCheck.success){
        return secondLLMResponseCheck.data;
    }

    logToQuarantine({
        PROMPT_VERSION : PROMPT_VERSION,
        input : input,
        rawFirstOutput : firstLLMResponse,
        rawSecondOutput : secondLLMResponse,
        lastErro : secondLLMResponseCheck.error,
    });

    const error = new Error('LLM output failed validation after repair attempt');
    error.statusCode = 422;
    throw error;
}


module.exports = main;