const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', () => {
    const uname = loginForm.querySelector('.uname');
    console.log(uname.value);
    const pwd = loginForm.querySelector('.pwd');
    console.log(pwd.value);
});

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', () => {
    const uname = signupForm.querySelector('.uname');
    console.log(uname.value);
    const pwd = signupForm.querySelector('.pwd');
    console.log(pwd.value);
});