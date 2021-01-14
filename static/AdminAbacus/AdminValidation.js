// #######################################################################################################################################################
// ##############################################        STEP 01         #################################################################################
// #######################################################################################################################################################

function sLocation() {
    var abacus_StoreLoc = document.getElementById('storeLoc').value;
    var regx = /^[A-Za-z0-9 & ' ']+$/;
    if (abacus_StoreLoc.match(regx)) {
        // document.getElementById('storeLoc').style.border = '';
        document.getElementById('invalidloc').innerHTML = '';
        document.getElementById('NextButton').disabled = true;
    } else {
        // document.getElementById('storeLoc').style.border = '1px solid red';
        document.getElementById('invalidloc').innerHTML = 'Only alphabets and numbers allowed';
        // document.getElementById('NextButton').disabled = true;
    }
}
// #########################################################################################################################
function stown() {
    var abacus_StoreTown = document.getElementById('storeTown').value;
    var regx = /^[A-Za-z & ' ']+$/;
    if (abacus_StoreTown.match(regx)) {
        // document.getElementById('storeTown').style.border = '';
        document.getElementById('invalidtown').innerHTML = '';
        document.getElementById('NextButton').disabled = true;
    } else {
        // document.getElementById('storeTown').style.border = '1px solid red';
        document.getElementById('invalidtown').innerHTML = 'Only alphabets allowed';
        // document.getElementById('NextButton').disabled = true;
    }
}
// #########################################################################################################################
function sstate() {
    var abacus_StoreState = document.getElementById('storeState').value;
    var regx = /^[A-Za-z & ' ']+$/;
    if (abacus_StoreState.match(regx)) {
        // document.getElementById('storeTown').style.border = '';
        document.getElementById('invalidstate').innerHTML = '';
        document.getElementById('NextButton').disabled = false;
    } else {
        // document.getElementById('storeTown').style.border = '1px solid red';
        document.getElementById('invalidstate').innerHTML = 'Only alphabets allowed';
        document.getElementById('NextButton').disabled = true;
    }
}
// #######################################################################################################################################################
// ##############################################        STEP 02         #################################################################################
// #######################################################################################################################################################
var err_manager_name = false;
var err_manager_contact = false;
var err_manager_email = false;

var err_supervisor_name = false;
var err_supervisor_contact = false;
var err_supervisor_email = false;
// #######################      MANAGER NAME VALIDATION       ##############################
function validateName() {
    var abacus_managerName = document.getElementById('managrName').value;
    var regx = /^[A-Za-z & ' ']+$/;
    if (abacus_managerName.match(regx)) {
        document.getElementById('invalidmanagername').innerHTML = '';
        err_manager_name = true;
    } else {
        document.getElementById('invalidmanagername').innerHTML = 'Only alphabets allowed';
        err_manager_name = false;
    }
}
// #######################      MANAGER EMAIL VALIDATION       ##############################
function validateEmail() {
    var email = document.getElementById('managerEmail').value;
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;

    if (email.match(regx)) {
        document.getElementById('invalidmanageremail').innerHTML = '';
        var email = document.getElementById('managerEmail').value;
        $.ajax({
            type: 'GET',
            data: { 'email': email },
            url: "checkEmail",
            success: function (response) {
                if (response == 'True') {
                    document.getElementById('invalidmanageremail').innerHTML = 'Email already exist!';
                } else {
                    err_manager_email = true;
                }
            }
        });
    } else {
        document.getElementById('invalidmanageremail').innerHTML = 'Invalid Email';
        err_manager_email = false;
    }
}
// #######################      SUPERVISOR EMAIL VALIDATION       ##############################
function validateSupervisorEmail() {
    var email = document.getElementById('supervisorEmail').value;
    var memail = $('#managerEmail').val();
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (email.match(regx)) {
        document.getElementById('invalidsupervisoremail').innerHTML = '';
        document.getElementById('NextButton').disabled = false;
        if (email === memail) {
            document.getElementById('invalidsupervisoremail').innerHTML = "Manager And Supervisor email can't be same";
            document.getElementById('NextButton').disabled = true;
        } else {
            document.getElementById('invalidsupervisoremail').innerHTML = '';
            document.getElementById('NextButton').disabled = false;
        }
    } else {
        document.getElementById('invalidsupervisoremail').innerHTML = 'Invalid Email';
        document.getElementById('NextButton').disabled = true;
    }
}
// #######################      MANAGER PASSWORD VALIDATION       ##############################
// ############### 3 Upper & Lower case letter/ 2Special characters/ 2 numbers  ################
function validatePassowrd() {
    var f1 = false;
    var f2 = false;
    var f3 = false;
    var f4 = false;
    var pwd = $('#validateManagerpass').val();
    console.log(pwd);
    if (pwd.length >= 8) {
        document.getElementById('charlenadd').classList.remove('fa-times');
        document.getElementById('charlenadd').classList.add('fa-check');
        document.getElementById('charlenadd').style.color = 'green';
        f1 = true;
    } else {
        document.getElementById('charlenadd').classList.remove('fa-check');
        document.getElementById('charlenadd').classList.add('fa-times');
        document.getElementById('charlenadd').style.color = 'red';
        f1 = false;
    }

    //  atleast 1 Upper case alphabet
    if (pwd.match(/[A-Z]/)) {
        document.getElementById('uppercaseadd').classList.remove('fa-times');
        document.getElementById('uppercaseadd').classList.add('fa-check');
        document.getElementById('uppercaseadd').style.color = 'green';
        f2 = true;
    } else {
        document.getElementById('uppercaseadd').classList.remove('fa-check');
        document.getElementById('uppercaseadd').classList.add('fa-times');
        document.getElementById('uppercaseadd').style.color = 'red';
        f2 = false;
    }

    // atleast 1 numeric value
    if (pwd.match(/[0-9]/)) {
        document.getElementById('numbersadd').classList.remove('fa-times');
        document.getElementById('numbersadd').classList.add('fa-check');
        document.getElementById('numbersadd').style.color = 'green';
        f3 = true;
    } else {
        document.getElementById('numbersadd').classList.remove('fa-check');
        document.getElementById('numbersadd').classList.add('fa-times');
        document.getElementById('numbersadd').style.color = 'red';
        f3 = false;
    }

    // atleast 1 Special character 
    if(pwd.match(/[!\@\#\$\%\^\&\*\(\)\_\-\+\=]/)){
        document.getElementById('symboladd').classList.remove('fa-times');
        document.getElementById('symboladd').classList.add('fa-check');
        document.getElementById('symboladd').style.color = 'green';
        f4 = true;
    }else{
        document.getElementById('symboladd').classList.remove('fa-check');
        document.getElementById('symboladd').classList.add('fa-times');
        document.getElementById('symboladd').style.color = 'red';
        f4 = false;
    }

    if (f1 == true & f2 == true & f3 == true & f4 == true) {
        document.getElementById('NextButton').disabled = false;
    } else {
        document.getElementById('NextButton').disabled = true;
    }
}


function enablepwdcondition() {
    $('#passwordCondition').show();
}

// #######################      MANAGER CONTACT VALIDATION       ##############################
function validateCon(txt) {
    var ManagerContact = document.getElementById('ManagerContact').value;
    var regx = /^[6789]\d{9}$/;
    // alert(ManagerContact);
    if (ManagerContact.includes()) {
        alert();
    }
    if (ManagerContact.match(regx)) {
        $.ajax({
            type: 'GET',
            data: { 'ManagerContact': ManagerContact },
            url: "checkmanagerContact",
            success: function (response) {
                if (response == 'True') {
                    document.getElementById('invalidmanagercontact').innerHTML = 'Contact already exist!';
                    err_manager_contact = false;
                } else {
                    document.getElementById('invalidmanagercontact').innerHTML = '';
                    $('input[name="userUinqueID"]').val(txt.value);
                    err_manager_contact = true;
                }
            }
        });
    } else if (ManagerContact.charAt(0) == 0 || ManagerContact.charAt(0) == 1 || ManagerContact.charAt(0) == 2 || ManagerContact.charAt(0) == 3 || ManagerContact.charAt(0) == 4 || ManagerContact.charAt(0) == 5) {
        if (ManagerContact.length == 0) {
            document.getElementById('invalidmanagercontact').innerHTML = '';
        } else {
            (document.getElementById('invalidmanagercontact').innerHTML = 'Invalid contact');
        }
    } else if (ManagerContact.length != 10) {
        document.getElementById('invalidmanagercontact').innerHTML = 'Contact must be of 10 digit';
        err_manager_contact = false;
    } else {
        document.getElementById('invalidmanagercontact').innerHTML = 'Invalid contact';
        err_manager_contact = false;
    }
}
// #######################      SUPERVISOR NAME VALIDATION       ##############################
function validateSuName() {
    var supervisorName = document.getElementById('supervisorName').value;
    document.getElementById('invalidsupervisorName').innerHTML = '';
    var regx = /^[A-Za-z & ' ']+$/;
    if (supervisorName.match(regx)) {
        document.getElementById('invalidsupervisorName').innerHTML = '';
        err_supervisor_name = false;
    } else {
        document.getElementById('invalidsupervisorName').innerHTML = 'Only alphabets allowed';
        err_supervisor_name = false;
    }
}
// #######################      SUPERVISOR CONTACT VALIDATION       ##############################
function validateSuperContact() {
    var supervisorContact = document.getElementById('SuperContact').value;
    var ManagerContact = document.getElementById('ManagerContact').value;
    var regx = /^[6789]\d{9}$/;
    if (supervisorContact.match(regx)) {
        document.getElementById('invalidsupervisorcontact').innerHTML = '';
        if (ManagerContact === supervisorContact) {
            document.getElementById('invalidsupervisorcontact').innerHTML = "Manager and Supervisor contact can't be same";
            err_supervisor_contact = false;
        } else {
            document.getElementById('invalidsupervisorcontact').innerHTML = '';
            err_supervisor_contact = true;
        }
    } else if (supervisorContact.charAt(0) == 0 || supervisorContact.charAt(0) == 1 || supervisorContact.charAt(0) == 2 || supervisorContact.charAt(0) == 3 || supervisorContact.charAt(0) == 4 || supervisorContact.charAt(0) == 5) {
        if (supervisorContact.length == 0) {
            document.getElementById('invalidsupervisorcontact').innerHTML = '';
        } else {
            (document.getElementById('invalidsupervisorcontact').innerHTML = 'Invalid contact');
        }
    } else if (supervisorContact.length != 10) {
        document.getElementById('invalidsupervisorcontact').innerHTML = 'Contact must be of 10 digit';
        err_supervisor_contact = false;
    } else {
        document.getElementById('invalidsupervisorcontact').innerHTML = 'Invalid contact';
        err_supervisor_contact = false;
    }
}
// #########################################################################################################################
function onlyNumberKey(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57))
        return true;
    else
        return false;
}


$('input[name="managerEmail"]').on('keypress', function (e) {
    if (e.which == 32) {
        console.log('Space Detected');
        return false;
    }
})
// #########################################################################################################################
