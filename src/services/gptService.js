const http = require('http');
const fetch = require('node-fetch');
require('dotenv').config(); 


const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const url = 'https://api.openai.com/v1/chat/completions';

const requestListener = async (req, res) => {
    if (req.method === 'POST' && req.url === '/generateQuestion') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { topic } = JSON.parse(body); 
            if (!topic) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Topic is required' }));
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}` 
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: `Generate a question about ${topic}` }],
                        temperature: 0.7
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error.message || 'Failed to fetch question');
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ question: data.choices[0].message.content }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};

const server = http.createServer(requestListener);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
