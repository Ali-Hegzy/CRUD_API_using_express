const fs = require('fs');
const path = require('path');

function extractJson(rawText) {
  try {
    let cleaned = rawText.replace(/```(?:json)?\s*|\s*```/g, '').trim();
    
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      throw new Error('No JSON object found in response');
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    return { success: true, data: JSON.parse(cleaned) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function logToQuarantine(payload) {
  const logDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, 'quarantine.jsonl');
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...payload,
  }) + '\n';

  fs.appendFileSync(logFile, logEntry, 'utf-8');
}


module.exports = { extractJson, logToQuarantine };