import OpenAI from "openai";

const openAi = new OpenAI({apiKey: "sk-rdNr8ODhpIWUKuYFDJYLW7HAlvAqm9vfnnwD-SXz4fT3BlbkFJjr3ZWgMxWMbSJImOSmp2EOxf0FBYfYQYUmRXIMLg8A", dangerouslyAllowBrowser: true});

export const generateQuestion = async (topic) => {
    if (!topic) {
        throw new Error('Topic is required');
    }
    try {
        const completion = await openAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `Generate a question about ${topic}.`,
                },
            ],
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating question:', error.message);
        throw error;
    }
};
