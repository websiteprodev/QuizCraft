const express = require('express');
const router = express.Router();

router.post('/generateQuestion', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const response = { ok: true, question: "What is AI?" }; 
        if (!response.ok) {
            throw new Error('Failed to fetch question');
        }
        res.json({ question: response.question });
    } catch (error) {
        console.error('Error generating question:', error);
        res.status(500).json({ error: 'Failed to generate question' });
    }
});

module.exports = router;
