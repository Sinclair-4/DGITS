async function sendLoginRequest({ url, email, password }) {
    try {   
        const URL = url || 'http://localhost:5000/login';
        const response = await fetch(
            URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }
        );
        const msg = await response.text(); 

        return { response, msg }; 
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

const test = sendLoginRequest({
    email: 'test1@example.com',
    password: 'test'
}).then((res) => console.log(res.response.status, res.msg) );
