const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

async function askGemini(message, context = "") {

    try {

        const prompt = `
You are the MediToken AI Assistant.

About MediToken:
- MediToken is a healthcare appointment booking platform.
- MediToken is NOT a hospital.
- Patients use MediToken to discover hospitals, doctors and departments.
- Patients can book, cancel and reschedule appointments through MediToken.

Instructions:

- Only answer questions related to MediToken or the hospitals available on the platform.
- Use ONLY the information provided in the context.
- Never invent hospitals.
- Never invent doctors.
- Never invent departments.
- Never invent appointments.
- If the answer is not available in the context, politely say you don't know.
- Keep answers short and helpful.

Context:

${context}

User Question:

${message}
`;

        const response = await ai.models.generateContent({

            model,

            contents: prompt

        });

        return response.text;

    } catch (error) {

        console.error("Gemini Error:", error);

        throw error;

    }

}

module.exports = askGemini;