// ###############################     SUBSCRIPTION FORM VALIDATION      ####################################################
// ##########################################################################################################################
flag = false;
function subscriptionfnameValidation() {
    var fname = document.getElementById('customer_fname').value;
    var regx = /^[A-Za-z]+$/;
    if (fname.match(regx)) {
        document.getElementById('subsError').innerHTML = ''
        document.getElementById('customer_lname').disabled = false;
        flag = false;
    } else {
        document.getElementById('subsError').innerHTML = 'Name only contains alphabets'
        document.getElementById('customer_lname').disabled = true;
        document.getElementById('customer_email').disabled = true;
        document.getElementById('customer_contact').disabled = true;
        flag = true;
    }
}

function subscriptionlnameValidation() {
    var lname = document.getElementById('customer_lname').value;
    var regx = /^[A-Za-z]+$/;
    if (lname.match(regx)) {
        document.getElementById('subsError').innerHTML = ''
        flag = false;
        document.getElementById('customer_email').disabled = false;
    } else {
        document.getElementById('subsError').innerHTML = 'Name only contains alphabets'
        flag = true;
        document.getElementById('customer_email').disabled = true;
        document.getElementById('customer_contact').disabled = true;
    }
}

function subscriptionemailValidation() {
    var email = document.getElementById('customer_email').value;
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (email.match(regx)) {
        document.getElementById('subsError').innerHTML = ''
        flag = false;
        document.getElementById('customer_contact').disabled = false;

    } else {
        document.getElementById('subsError').innerHTML = 'Invalid Email'
        flag = true;

        document.getElementById('customer_contact').disabled = true;
    }
}

function subscriptioncontactValidation() {
    var contact = document.getElementById('customer_contact').value;
    var regx = /^[6-9][0-9]{9}$/;
    if (contact.match(regx)) {
        document.getElementById('subsError').innerHTML = ''
        flag = true;
        document.getElementById('subbutton').disabled = false;
    } else {
        document.getElementById('subsError').innerHTML = 'Invalid Contact'
        flag = false;
        document.getElementById('subbutton').disabled = true;
    }
}

// ######################################     QUERY FORM VALIDATION      ####################################################
// ##########################################################################################################################
flag = false;
function queryfnameValidation() {
    var fname = document.getElementById('customer_fname1').value;
    var regx = /^[A-Za-z]+$/;
    if (fname.match(regx)) {
        document.getElementById('queryError').innerHTML = ''
        document.getElementById('customer_lname1').disabled = false;
        flag = false;
    } else {
        document.getElementById('queryError').innerHTML = 'Name only contains alphabets'
        document.getElementById('customer_lname1').disabled = true;
        document.getElementById('customer_email1').disabled = true;
        document.getElementById('customer_contact1').disabled = true;
        flag = true;
    }
}

function querylnameValidation() {
    var lname = document.getElementById('customer_lname1').value;
    var regx = /^[A-Za-z]+$/;
    if (lname.match(regx)) {
        document.getElementById('queryError').innerHTML = ''
        flag = false;
        document.getElementById('customer_email1').disabled = false;
    } else {
        document.getElementById('queryError').innerHTML = 'Name only contains alphabets'
        flag = true;
        document.getElementById('customer_email1').disabled = true;
        document.getElementById('customer_contact1').disabled = true;
    }
}

function queryemailValidation() {
    var email = document.getElementById('customer_email').value;
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (email.match(regx)) {
        document.getElementById('queryError').innerHTML = ''
        flag = false;
        document.getElementById('customer_contact1').disabled = false;

    } else {
        document.getElementById('queryError').innerHTML = 'Invalid Email'
        flag = true;

        document.getElementById('customer_contact1').disabled = true;
    }
}

function querycontactValidation() {
    var contact = document.getElementById('customer_contact1').value;
    var regx = /^[6-9][0-9]{9}$/;
    if (contact.match(regx)) {
        document.getElementById('queryError').innerHTML = ''
        flag = true;
        document.getElementById('querybutton').disabled = false;
    } else {
        document.getElementById('queryError').innerHTML = 'Invalid Contact'
        flag = false;
        document.getElementById('querybutton').disabled = true;
    }
}

// ######################################     CONTACT FORM VALIDATION      ####################################################
// ##########################################################################################################################
flag = false;
function contactnameValidation() {
    var fname = document.getElementById('Custname').value;
    var regx = /^[A-Za-z]+$/;
    if (fname.match(regx)) {
        document.getElementById('contactError').innerHTML = ''
        document.getElementById('Custemail').disabled = false;
        flag = false;
    } else {
        document.getElementById('contactError').innerHTML = 'Name only contains alphabets'
        document.getElementById('Custemail').disabled = true;
        document.getElementById('Custcontact').disabled = true;
        document.getElementById('Custmessage').disabled = true;
        flag = true;
    }
}


function contactemailValidation() {
    var email = document.getElementById('Custemail').value;
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (email.match(regx)) {
        document.getElementById('contactError').innerHTML = ''
        flag = false;
        document.getElementById('Custcontact').disabled = false;

    } else {
        document.getElementById('contactError').innerHTML = 'Invalid Email'
        flag = true;

        document.getElementById('Custcontact').disabled = true;
        document.getElementById('Custmessage').disabled = true;

    }
}

function contactcontactValidation() {
    var contact = document.getElementById('Custcontact').value;
    var regx = /^[6-9][0-9]{9}$/;
    if (contact.match(regx)) {
        document.getElementById('contactError').innerHTML = ''
        flag = true;
        document.getElementById('contactbutton').disabled = false;
    } else {
        document.getElementById('contactError').innerHTML = 'Invalid Contact'
        flag = false;
        document.getElementById('contactbutton').disabled = true;
    }
}