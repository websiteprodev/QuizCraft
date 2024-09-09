export const generateAIQuestion = async () => {
    const topic = "Arts"; 
    const url = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY; 
  

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: `Generate a question about ${topic}. It should have four possible options. Structure it in a JSON format. The question should be "question", "answer", "answerOne", "answerTwo", "answerThree", "answerFour"` }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error.message || 'Failed to generate question');
        }

        console.log(data.choices[0].message.content); 
    } catch (error) {
        console.error('Error generating AI question:', error);
    }
};

