const Groq = require('groq-sdk');
const Crime = require('../models/crime');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.chat = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Step 1 — Extract keywords from question
        const questionLower = question.toLowerCase();

        // Find state mentioned
        const states = await Crime.distinct('state');
        const mentionedState = states.find(s =>
            questionLower.includes(s.toLowerCase())
        );

        // Find crime type mentioned
        const crimeTypes = await Crime.distinct('crime_type');
        const mentionedCrime = crimeTypes.find(c =>
            questionLower.includes(c.toLowerCase())
        );

        // Find year mentioned
        const yearMatch = question.match(/\b(200[1-9]|2010)\b/);
        const mentionedYear = yearMatch ? parseInt(yearMatch[0]) : null;

        // Step 2 — Query MongoDB with extracted filters
        let filter = {};
        if (mentionedState) filter.state = mentionedState;
        if (mentionedCrime) filter.crime_type = mentionedCrime;
        if (mentionedYear) filter.year = mentionedYear;

        const crimes = await Crime.find(filter).limit(50);

        // Step 3 — Build context from data
        const context = crimes.map(c =>
            `State: ${c.state}, Year: ${c.year}, Crime: ${c.crime_type}, Cases: ${c.total_cases}`
        ).join('\n');

        // Step 4 — Get top stats for context
        const topStates = await Crime.aggregate([
            { $group: { _id: '$state', total: { $sum: '$total_cases' } } },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        const topStatesText = topStates.map(s =>
            `${s._id}: ${s.total.toLocaleString()} cases`
        ).join(', ');

        // Step 5 — Send to Groq
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are a crime data analyst for India. 
Answer questions using ONLY the data provided below.
Be concise and specific. Always mention state, year, and crime type in your answer.
If data is not available say so clearly.

TOP 5 STATES BY TOTAL CRIMES: ${topStatesText}

RELEVANT DATA:
${context || 'No specific data found for this query.'}`
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            max_tokens: 300,
            temperature: 0.3
        });

        const answer = completion.choices[0]?.message?.content || 'Sorry I could not find an answer.';

        res.json({
            question,
            answer,
            dataUsed: {
                state: mentionedState || 'All states',
                crime: mentionedCrime || 'All crimes',
                year: mentionedYear || 'All years',
                recordsFound: crimes.length
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getPolicy = async (req, res) => {
    try {
        const { state } = req.query;

        if (!state) return res.status(400).json({ error: 'State required' });

        // Get crime data for this state
        const stateCrimes = await Crime.aggregate([
            { $match: { state } },
            { $group: { _id: '$crime_type', total: { $sum: '$total_cases' } } },
            { $sort: { total: -1 } }
        ]);

        // Get year trend
        const yearTrend = await Crime.aggregate([
            { $match: { state } },
            { $group: { _id: '$year', total: { $sum: '$total_cases' } } },
            { $sort: { _id: 1 } }
        ]);

        // National average
        const nationalAvg = await Crime.aggregate([
            { $group: { _id: '$state', total: { $sum: '$total_cases' } } },
            { $group: { _id: null, avg: { $avg: '$total' } } }
        ]);

        const stateTotal = stateCrimes.reduce((sum, c) => sum + c.total, 0);
        const avgTotal = nationalAvg[0]?.avg || 0;
        const comparedToAvg = stateTotal > avgTotal ? 'above' : 'below';

        const crimeContext = stateCrimes.map(c =>
            `${c._id}: ${c.total.toLocaleString()} cases`
        ).join('\n');

        const trendContext = yearTrend.map(y =>
            `${y._id}: ${y.total.toLocaleString()}`
        ).join(', ');

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are a senior crime policy analyst for India. 
Generate exactly 4 specific, actionable policy recommendations based on the crime data.
Format your response as JSON with this exact structure:
{
  "summary": "2 sentence overview of the crime situation",
  "recommendations": [
    {
      "title": "Short title",
      "priority": "High/Medium/Low",
      "description": "2-3 sentence specific recommendation",
      "targetCrime": "Which crime this addresses"
    }
  ]
}
Return ONLY valid JSON, no other text.`
                },
                {
                    role: 'user',
                    content: `State: ${state}
Total crimes: ${stateTotal.toLocaleString()} (${comparedToAvg} national average)

Crime breakdown:
${crimeContext}

Year-wise trend:
${trendContext}

Generate 4 policy recommendations.`
                }
            ],
            max_tokens: 800,
            temperature: 0.4
        });

        const text = completion.choices[0]?.message?.content || '{}';
        const clean = text.replace(/```json|```/g, '').trim();
        const policy = JSON.parse(clean);

        res.json({ state, ...policy, stateTotal, comparedToAvg });

    } catch (error) {
        console.error('Policy error:', error);
        res.status(500).json({ error: error.message });
    }
};