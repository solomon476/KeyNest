const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('https://keynest-mu.vercel.app/_/backend/api/auth/login', {});
        console.log(res.data);
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}

test();
