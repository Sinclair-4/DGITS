const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailBar = document.getElementById('email-bar');
const passwordBar = document.getElementById('password-bar');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginBar = document.getElementById('login-bar');
const loginForm = document.getElementById('login-form');
const errorPopup = document.getElementById('error-popup');
const progressBarWrapper = document.getElementById('progress-bar-wrapper');

let emailBar_hasInput = false;
let passwordBar_hasInput = false;

emailInput.addEventListener('input', () => {
    if (emailInput.value.length > 0) {
        emailBar_hasInput = true;
        emailBar.style.backgroundPosition = 'left';
    } else {
        emailBar_hasInput = false;
        emailBar.style.backgroundPosition = 'right';
    };
    loginSubmitBtnMiddleware();
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length > 0) {
        passwordBar_hasInput = true;
        passwordBar.style.backgroundPosition = 'left';
    } else {
        passwordBar_hasInput = false;
        passwordBar.style.backgroundPosition = 'right';
    };
    loginSubmitBtnMiddleware();
});



function loginSubmitBtnMiddleware() {
    if (!emailBar_hasInput || !passwordBar_hasInput) {
        loginSubmitBtn.style.animation = 'fade-up-exit .3s ease-out forwards';
        loginSubmitBtn.style.pointerEvents = 'none';
        setTimeout(() => {
            loginBar.style.backgroundPosition = 'top';
        }, 300);
        return;
    }

    loginBar.style.backgroundPosition = 'bottom';
    loginSubmitBtn.style.animation = 'fade-down-reveal .3s ease-out forwards';
    loginSubmitBtn.style.animationDelay = '.3s';
    loginSubmitBtn.style.pointerEvents = 'all';
}



loginForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();

        loginBar.style.opacity = '.5';
        progressBarWrapper.style.opacity = '.5';
        loginSubmitBtn.disabled = true;
    
        const data = Object.fromEntries(new FormData(loginForm).entries());

        console.log('Submitting login form with data:', data);

        const url = 'https://dgits.online/auth/login';
        
        const request = await fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const msg = await request.text();

        console.log('Login response status:', request.status);
        console.log('Login response message:', msg);

        if (request.status !== 200) {
            emitErrorPopup(msg || 'Login failed');
        }
        else {
            console.log('Login successful');
            window.location.href = '/user';
        };

        setTimeout(() => {
            loginBar.style.opacity = '1';
            progressBarWrapper.style.opacity = '1';
            loginSubmitBtn.disabled = false;
        }, 3000);
    }
    catch (err) {
        console.log('Login form submit failed:', err);   
    }
});



function emitErrorPopup(msg = 'Error') {
    errorPopup.textContent = msg;
    errorPopup.style.animation = 'fade-up-reveal .3s ease-out forwards';
    setTimeout(() => {
        errorPopup.style.animation = 'fade-down-exit .3s ease-out forwards';
    }, 3000);
};