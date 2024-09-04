
const express = require('express');
const router = express.Router();


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/generate-question', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Generate a multiple-choice question about ${topic} with four possible answers.`,
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${sk-rdNr8ODhpIWUKuYFDJYLW7HAlvAqm9vfnnwD-SXz4fT3BlbkFJjr3ZWgMxWMbSJImOSmp2EOxf0FBYfYQYUmRXIMLg8A}`,
                'Content-Type': 'application/json',
            }
        });

        const generatedText = response.data.choices[0].text.trim();
        const [question, ...answers] = generatedText.split('\n').filter(Boolean);
        
        res.json({ question, answers: answers.slice(0, 4) });
    } catch (error) {
        console.error('Error generating question:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate question' });
    }
});

module.exports = router;
