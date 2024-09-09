const fetch = require('node-fetch'); 

router.post('/generateQuestion', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: `Generate a multiple-choice question about ${topic} with four possible answers.`,
                max_tokens: 150,
                temperature: 0.7,
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error.message);
        }
        
        const generatedText = data.choices[0].text.trim();
        res.json({ question: generatedText.split('\n')[0], answers: generatedText.split('\n').slice(1, 5) });
    } catch (error) {
        console.error('Error generating question:', error);
        res.status(500).json({ error: 'Failed to generate question' });
    }
});
