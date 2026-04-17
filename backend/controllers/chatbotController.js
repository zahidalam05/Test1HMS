import MessMenu from "../models/MessMenu.js";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";
import Notice from "../models/Notice.js";

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ reply: "Gemini API key is not configured!" });
        }

        // 1. Fetch Student Profile to get student ID
        const studentProfile = await Student.findOne({ user: user._id });

        // 2. Fetch Total Fees Paid
        let totalPaid = 0;
        if (studentProfile) {
            const payments = await Payment.find({ student: studentProfile._id, status: 'Approved' });
            totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        }

        // 3. Fetch Latest Notices
        const notices = await Notice.find({
            $or: [{ visibleTo: 'All' }, { visibleTo: 'Students' }]
        }).sort({ createdAt: -1 }).limit(3);
        const noticesString = notices.map(n => `- ${n.title}: ${n.message}`).join('\n');

        // 4. Fetch Mess Menu context
        const menuItems = await MessMenu.find({});
        const menuString = menuItems.map(m => `${m.day}: Breakfast: ${m.breakfast || '-'}, Lunch: ${m.lunch || '-'}, Dinner: ${m.dinner || '-'}`).join('\n');

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[new Date().getDay()];
        const todayMenu = menuItems.find(m => m.day === currentDay);
        const todayMenuString = todayMenu ? `Today (${currentDay}): Breakfast: ${todayMenu.breakfast}, Lunch: ${todayMenu.lunch}, Dinner: ${todayMenu.dinner}` : "No menu set for today.";

        const systemPrompt = `You are "MIT HMS AI Assistant", a friendly AI for the Hostel Management System.
The student is ${user.name}. 

REAL-TIME CONTEXT DATA:
- Today's Mess Menu: ${todayMenuString}
- Full Weekly Menu: ${menuString}
- Total Fees Paid by ${user.name}: ₹${totalPaid}
- Latest Notices:
${noticesString || "No recent notices."}

INSTRUCTIONS:
1. Greet ${user.name} naturally. 
2. Use CONTEXT DATA to answer fees, menu, and notice questions.
3. Keep replies very sweet, helpful and short.
4. If they ask about fees, mention the total ₹${totalPaid} paid.
5. You can chat in Hinglish (mix of Hindi/English).

USER MESSAGE: ${message}
ASSISTANT:`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(response.status).json({ reply: "Ji, main avi connect nahi ho paa raha hoon. Please thodi der baad koshish karein." });
        }

        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Main aapka message samajh nahi paya. Fir se poochiye?";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ reply: "Backend mein server par kuch dikkat aa rahi hai." });
    }
};
