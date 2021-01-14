function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// ====================================================   CUSTOMER Subscription FORM    ===================================================================================

function subscription_query_form() {
    var fname = $('#customer_fname').val();
    var lname = $('#customer_lname').val();
    var email = $('#customer_email').val();
    var contact = $('#customer_contact').val();

    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: "customer_query",
        headers: { 'X-CSRFToken': csrftoken },
        data: { 'fname': fname, 'lname': lname, 'email': email, 'contact': contact },
        success: function (response) {
            console.log(response);
        }
    });
}
// ====================================================   CUSTOMER QUERY FORM    ===================================================================================
function subscription_query_form1() {
    var fname = $('#customer_fname1').val();
    var lname = $('#customer_lname1').val();
    var email = $('#customer_email1').val();
    var contact = $('#customer_contact1').val();

    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: "customer_query1",
        headers: { 'X-CSRFToken': csrftoken },
        data: { 'fname': fname, 'lname': lname, 'email': email, 'contact': contact },
        success: function (response) {
            console.log(response);
        }
    });
}


function subscription_query_form2() {
    var name = $('#Custname').val();
    var email = $('#Custemail').val();
    var contact = $('#Custcontact').val();
    var dob = $('#Custdob').val();
    var message = $('#Custmessage').val();

    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: "customer_query2",
        headers: { 'X-CSRFToken': csrftoken },
        data: { 'name': name, 'email': email, 'contact': contact, 'dob': dob, 'message': message },
        success: function (response) {
            console.log(response);
        }
    });
}


// const togglePassword = document.querySelector('#togglePassword');
// const password = document.querySelector('#password');

// togglePassword.addEventListener('click', function (e) {
//     // toggle the type attribute
//     const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//     password.setAttribute('type', type);
//     // toggle the eye slash icon
//     this.classList.toggle('fa-eye-slash');
// });