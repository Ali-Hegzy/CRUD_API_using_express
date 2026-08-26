const {z} = require('zod');

const outputSchema = z.object({
    text: z.string().min(1, 'Output text cannot be empty'),

    confidence: z.number().min(0).max(1)
});

module.exports = outputSchema