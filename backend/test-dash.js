async function test() {
    try {
        const login = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@hostel.com', password: 'admin123' })
        });
        const loginData = await login.json();
        const token = loginData.token;

        const dash = await fetch('http://localhost:5000/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const dashData = await dash.json();
        console.log("DASH STATUS:", dash.status);
        console.log("DASH ERROR/DATA:", dashData);
    } catch (e) {
        console.log("ERROR:", e.message);
    }
}
test();
