const username = document.getElementById('username');
const email = document.getElementById('email');
const logoutBtn = document.getElementById('logout-btn');
const classtagFeature = document.getElementById('classtag-feature');

async function populateUserInfo() {
    try {
        const url = 'https://dgits.online/api/me';

        const request = fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        });

        const response = await request;
        const data = await response.json();

        if (response.ok) {
            console.log('User info retrieved:', data);
            username.textContent = data.username;
            email.textContent = data.email;
        } else {
            console.log('Failed to retrieve user info with status:', response.status);
            console.log('User info response message:', data);
        };
    }
    catch (err) {
        console.log('Error populating user info:', err);
    };
};

populateUserInfo();



async function logout() {
    try {
        const url = 'https://dgits.online/auth/refresh/logout';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' 
        });

        const msg = await response.text();

        if (response.ok) {
            console.log('Logout successful');
            window.location.href = '/login'; 
        } else {
            console.log('Logout failed with status:', response.status);
            console.log('Logout response message:', msg);

            console.log('Attempting to refresh token');
            const refreshResponse = await refreshToken();

            if (refreshResponse.ok) {
                console.log('Token refresh successful, retrying logout');
                await logout();
            };
        };
    }   
    catch (err) {
        console.log('Error during logout:', err);    
    }
}

logoutBtn.addEventListener('click', async () => {
    await logout();
})

async function refreshToken() {
    try {
        const url = 'https://dgits.online/auth/refresh';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        });

        const msg = await response.text();

        if (response.ok) {
            console.log('Token refresh successful');
            return response;
        } else {
            console.log('Token refresh failed with status:', response.status);
            console.log('Token refresh response message:', msg);
            return response;
        }
    }
    catch (err) {
        console.log('Error refreshing token:', err);
    }
}



classtagFeature.addEventListener('click', () => {
    window.location.href = 'https://dgits.online/classtag';
});