const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

const emailBar = document.getElementById('email-bar');
const passwordBar = document.getElementById('password-bar');

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
    loginSubmitBtnMiddelware();
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length > 0) {
        passwordBar_hasInput = true;
        passwordBar.style.backgroundPosition = 'left';
    } else {
        passwordBar_hasInput = false;
        passwordBar.style.backgroundPosition = 'right';
    };
    loginSubmitBtnMiddelware();
});


function clearInput() {
    emailInput.value = '';
    emailBar_hasInput = false;

    passwordInput.value = '';
    passwordBar_hasInput = false;
}

function clearItemProgress() {
    emailBar.style.backgroundPosition = 'right';
    passwordBar.style.backgroundPosition = 'right';
}

function clearButtonProgress() {
    loginSubmitBtn.style.animation = 'fade-up-exit .3s ease-out forwards';
    loginSubmitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
        loginBar.style.backgroundPosition = 'top';
    }, 300);
}


const loginBar = document.getElementById('login-bar');
const loginSubmitBtn = document.getElementById('login-submit-btn');

function loginSubmitBtnMiddelware() {
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
};




const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
    try {
        // clearInput();
        loginBar.style.opacity = '.5';
        loginSubmitBtn.disabled = true;

        event.preventDefault();

        // const formData = new FormData(loginForm);
        // console.log('formData', formData);

        // const data = Object.fromEntries(formData.entries());
        // console.log('data', data);    

        const data = Object.fromEntries(new FormData(loginForm).entries());
        console.log(data);

        const url = 'https://dgits.online/login'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        loginBar.style.opacity = '1';
        loginSubmitBtn.disabled = false;

        const result = await response.json();    

        if (response.status === 200) {
            console.log('result', result);
            
        }
        else {
            console.log('result', result);
            emitErrorPopup(result.message);
        };

        
    } catch (error) {
        console.log(error);
        emitErrorPopup(error.message);
    };

    loginBar.style.opacity = '1';
    clearInput();
    clearButtonProgress();
    clearItemProgress();
});


const errorPopup = document.getElementById('error-popup');

