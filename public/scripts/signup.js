const usernameInput = document.getElementById('username-input');
const usernameBar = document.getElementById('username-bar');

const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

const emailBar = document.getElementById('email-bar');
const passwordBar = document.getElementById('password-bar');

const confirmPasswordInput = document.getElementById('confirm-password-input');
const confirmPasswordBar = document.getElementById('confirm-password-bar');

const InputElementsMap = new Map();

InputElementsMap.set('username', {
    hasInput: false,
    input: usernameInput,
    bar: usernameBar
});

InputElementsMap.set('email', {
    hasInput: false,
    input: emailInput,
    bar: emailBar
});

InputElementsMap.set('password', {
    hasInput: false,
    input: passwordInput,
    bar: passwordBar
});

InputElementsMap.set('confirm-password', {
    hasInput: false,
    input: confirmPasswordInput,
    bar: confirmPasswordBar
});

InputElementsMap.forEach((element) => {
    element.input.addEventListener('input', () => {
        if (element.input.value.length > 0) {
            element.hasInput = true;
            element.bar.style.backgroundPosition = 'left';
        } else {
            element.hasInput = false;
            element.bar.style.backgroundPosition = 'right';
        };
        submitButton.middleware(element.input);
    });
});

function clearAllInputs() {
    InputElementsMap.forEach(element => {
        element.input.value = "";
        element.hasInput = false;
        element.bar.style.backgroundPosition = 'right';
    });
};

const submitWrapperContainer = document.getElementById('submit-wrapper-container');

class SubmitButton {
    constructor({ form, button, bar, url }) {
        this.form = form;
        this.button = button;
        this.bar = bar;
        this.url = url || "https://dgits.online/auth/signup";

        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();
            this.submit();
        });
    }

    middleware(inputElement) {
        try {
            const inputsArray = Array.from(InputElementsMap.values());

            if (!inputsArray.every(input => input.hasInput)) {
                this.button.style.pointerEvents = 'none';
                this.button.disabled = true;
    
                this.button.style.animation = 'fade-up-exit .3s ease-out forwards';
    
                setTimeout(() => {
                    this.bar.style.backgroundPosition = 'top';
                }, 300);
                return;
            };

            this.bar.style.backgroundPosition = 'bottom';

            this.button.disabled = false;
            this.button.style.animation = 'fade-down-reveal .3s ease-out forwards';
            this.button.style.animationDelay = '.3s';
            this.button.style.pointerEvents = 'all';
        }
        catch (err) {
            console.log(err);
        }
    }

    async submit() {
        try {
            console.log('submit button clicked');

            submitWrapperContainer.style.opacity = '.5';
            this.button.disabled = true;

            const data = Object.fromEntries(new FormData(this.form).entries());
            // console.log(data);

            const result = await this.post(data);
            
            setTimeout(() => {
                submitWrapperContainer.style.opacity = '1';
                this.button.disabled = false;    
            }, 3000);

            if (result) {
                console.log('signup successful');
                successfulSignup(data.username);
            };
        }
        catch(err) {
            console.log(err);
        }
    }

    async post(data) {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const msg = await response.text();

            if (response.status !== 201) {
                console.log('signup failed with status:', response.status);
                console.log('signup response message:', msg);
                emitErrorPopup(msg);
            }
            else {
                console.log('signup success');
                return true;
            };
        }
        catch(err) {
            console.log(err);
            emitErrorPopup(err.message);
        };
    };
};

const signupForm = document.getElementById('signup-form');
const signupSubmitButton = document.getElementById('signup-submit-button');
const signupBar = document.getElementById('signup-bar');

const submitButton = new SubmitButton({
    form: signupForm,
    button: signupSubmitButton,
    bar: signupBar
})



const errorPopup = document.getElementById('error-popup');

function emitErrorPopup(msg) {
    errorPopup.textContent = msg;
    errorPopup.style.animation = 'fade-up-reveal .3s ease-out forwards';
    setTimeout(() => {
        errorPopup.style.animation = 'fade-down-exit .3s ease-out forwards';
    }, 3000);
}




const successfulWrapper = document.getElementById('successful-wrapper');
// const successTextWrapper = document.getElementById('success-text-wrapper');

// setTimeout(() => {
//     successfulWrapper.style.visibility = 'visible';
//     successfulWrapper.style.transition = 'height .3s ease-out';
//     successfulWrapper.style.height = '100%';

//     setTimeout(() => {
//         successTextWrapper.style.animation = 'fade-down-reveal .3s ease-out forwards';
//     }, 300);
// }, 3000);

const statusBar = document.querySelector('.status-bar');
const welcomeCard = document.querySelector('.welcome-card');
const loginButton = document.querySelector('#login-button');
const username = document.getElementById('username');

function successfulSignup(name) {
    username.textContent = name;

    successfulWrapper.style.visibility = 'visible';
    successfulWrapper.style.transition = 'height .5s ease-out';
    successfulWrapper.style.height = '100%';

    setTimeout(() => {
        statusBar.style.animation = 'fade-down-reveal .3s ease-out forwards';

        welcomeCard.style.animation = 'fade-down-reveal .3s ease-out forwards';
        welcomeCard.style.animationDelay = '.1s';
        
        loginButton.style.animation = 'fade-down-reveal .3s ease-out forwards';
        loginButton.style.animationDelay = '.2s';
    }, 300);
};

// successfulSignup('testing');