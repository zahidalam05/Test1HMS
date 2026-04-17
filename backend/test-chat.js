import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        const key = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`;

        console.log("Testing with URL:", apiUrl.replace(key, 'HIDDEN'));

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Success Reply:", data.candidates?.[0]?.content?.parts?.[0]?.text);
        } else {
            console.error("Error:", data);
        }
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
};

test();
