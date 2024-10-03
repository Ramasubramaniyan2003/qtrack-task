$(document).ready(function() {
    $('.signup_form').hide();

    $('#signup.link').on('click', function(e) {
        e.preventDefault(); 
        $('.login_form').hide(); 
        $('.signup_form').show();
    });

    $('#login.link').on('click', function(e) {
        e.preventDefault(); 
        $('.signup_form').hide(); 
        $('.login_form').show();
    });
});


document.querySelector('#signupForm').addEventListener('submit',(e) => {
    e.preventDefault();
    const password = $('#signupPassword').val()
    const CnfrmPassword = $('#signupCnfrmPassword').val();
    if(password == CnfrmPassword) {
    const userName = $('#signupEmail').val();
    $.ajax({
        type: 'POST',
        url: '/user-auth/signup',
        data: {email: userName, password: password},
        headers: { 'X-AT-SessionToken': localStorage.sessionToken }
    }).done(function (response) {
        if (response.success === true) {
            localStorage.setItem('sessionToken', response.data.token);
			localStorage.setItem('id', response.data.id);
			localStorage.setItem('email', response.data.email);
            window.location ='/users';
           } else {
            alert(response.error || 'Error saving data');
        }
    });
    } else {
        alert('Wrong Password');
    }
})

//login
document.querySelector('#loginForm').addEventListener('submit',(e) => {
    e.preventDefault();
    console.log($('#loginForm').serialize());
    $.ajax({
        type: 'POST',
        url: '/user-auth/login',
        data: $('#loginForm').serialize(),
    }).done(function (response) {
        if (response.success === true) {
            localStorage.setItem('sessionToken', response.token);
			localStorage.setItem('id', response.id);
			localStorage.setItem('email', response.email);
            window.location ='/users';
           } else {
            alert(response.error || 'Error Login');
        };
    });
})

