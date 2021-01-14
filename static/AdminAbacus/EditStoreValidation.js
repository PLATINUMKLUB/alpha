// ###############################    check store existance   #######################################################################
function checkStoreExist() {
    var valid_store = document.getElementById('editStoreName').value;
    var url = '/checkStore?store_name=' + valid_store;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = eval(req.responseText);
            if (data === true) {
                console.log(data);
                document.getElementById('existStore').innerHTML = 'Store Already Exist!'
                document.getElementById('update_btn').disabled = true;
            } else {
                document.getElementById('existStore').innerHTML = ""
                document.getElementById('update_btn').disabled = false;
            }
        }
    };
    req.open('GET', url, true)
    req.send()
}
// #####################################################################################################################################
// check manager email
function checkEmailExist() {
    var email = document.getElementById('existEmail').value;
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (email.match(regx)) {
        document.getElementById('existmanageremail').innerHTML = '';
        var email = document.getElementById('existEmail').value;
        $.ajax({
            type: 'GET',
            data: { 'email': email },
            url: "/checkEmail",
            success: function (response) {
                if (response == 'True') {
                    document.getElementById('existmanageremail').innerHTML = 'Email already exist!';
                } else {
                }
            }
        });
    } else {
        document.getElementById('existmanageremail').innerHTML = 'Invalid Email';
        // err_manager_email = false;
    }
}
// #####################################################################################################################################
// check manager contact
function editmanagerContact(txt) {
    var ManagerContact = document.getElementById('checkManagerContact').value;
    var regx = /^[6789]\d{9}$/;
    if (ManagerContact.match(regx)) {
        $.ajax({
            type: 'GET',
            data: { 'ManagerContact': ManagerContact },
            url: "/checkmanagerContact",
            success: function (response) {
                if (response == 'True') {
                    document.getElementById('existmanagercontact').innerHTML = 'Contact already exist!';
                    // err_manager_contact = false;
                } else {
                    document.getElementById('existmanagercontact').innerHTML = '';
                    // $('input[name="userUinqueID"]').val(txt.value);
                    // err_manager_contact = true;
                }
            }
        });
    } else if (ManagerContact.charAt(0) == 0 || ManagerContact.charAt(0) == 1 || ManagerContact.charAt(0) == 2 || ManagerContact.charAt(0) == 3 || ManagerContact.charAt(0) == 4 || ManagerContact.charAt(0) == 5) {
        if (ManagerContact.length == 0) {
            document.getElementById('existmanagercontact').innerHTML = '';
            document.getElementById('update_btn').readonly = false;
        } else {
            (document.getElementById('existmanagercontact').innerHTML = 'Invalid contact');
            document.getElementById('update_btn').readonly = true;
        }
        // err_manager_contact = false;
    } else if (ManagerContact.length != 10) {
        document.getElementById('existmanagercontact').innerHTML = 'Contact must be of 10 digit';
        document.getElementById('update_btn').readonly = true;
        // err_manager_contact = false;
    } else {
        document.getElementById('existmanagercontact').innerHTML = 'Invalid contact';
        document.getElementById('update_btn').readonly = true;
        // err_manager_contact = false;
    }
}
// #####################################################################################################################################
// manager Name validation
function editmanagerName() {
    var abacus_managerName = document.getElementById('editManagerName').value;
    var regx = /^[A-Za-z & ' ']+$/;
    if (abacus_managerName.match(regx)) {
        document.getElementById('existmanagername').innerHTML = '';
        err_manager_name = true;
    } else {
        document.getElementById('existmanagername').innerHTML = 'Only alphabets allowed';
        err_manager_name = false;
    }
}
// #####################################################################################################################################
function onlyNumberKey(e) {
    var x = e.which || e.keycode;
    if ((x >= 48 && x <= 57))
        return true;
    else
        return false;
}
// #####################################################################################################################################
$('input[name="managerEmail"]').on('keypress', function (e) {
    if (e.which == 32) {
        console.log('Space Detected');
        return false;
    }
});
// #####################################################################################################################################
// #######################      SUPERVISOR NAME VALIDATION       #######################################################################
function EditSupName() {
    var supervisorName = document.getElementById('editSupName').value;
    document.getElementById('Supemail').innerHTML = '';
    var regx = /^[A-Za-z & ' ']+$/;
    if (supervisorName.match(regx)) {
        document.getElementById('Supemail').innerHTML = '';
        // err_supervisor_name = false;
    } else {
        document.getElementById('Supemail').innerHTML = 'Only alphabets allowed';
        // err_supervisor_name = false;
    }
}
// ###################################################################################################################################
// ##############################      SUPERVISOR CONTACT VALIDATION       ###########################################################
function EditSuperContact() {
    var supervisorContact = document.getElementById('editsupcon').value;
    var ManagerContact = document.getElementById('checkManagerContact').value;
    var regx = /^[6789]\d{9}$/;
    if (supervisorContact.match(regx)) {
        document.getElementById('SuperContactExist').innerHTML = '';
        if (ManagerContact === supervisorContact) {
            document.getElementById('SuperContactExist').innerHTML = "Manager and Supervisor contact can't be same";
            document.getElementById('update_btn').readonly = true;
        } else {
            document.getElementById('SuperContactExist').innerHTML = '';
            document.getElementById('update_btn').readonly = false;
        }
    } else if (supervisorContact.charAt(0) == 0 || supervisorContact.charAt(0) == 1 || supervisorContact.charAt(0) == 2 || supervisorContact.charAt(0) == 3 || supervisorContact.charAt(0) == 4 || supervisorContact.charAt(0) == 5) {
        if (supervisorContact.length == 0) {
            document.getElementById('SuperContactExist').innerHTML = '';
            document.getElementById('update_btn').readonly = false;
        } else {
            (document.getElementById('SuperContactExist').innerHTML = 'Invalid contact');
            document.getElementById('update_btn').readonly = true;
        }
    } else if (supervisorContact.length != 10) {
        document.getElementById('SuperContactExist').innerHTML = 'Contact must be of 10 digit';
        document.getElementById('update_btn').readonly = true;
    } else {
        document.getElementById('SuperContactExist').innerHTML = 'Invalid contact';
        document.getElementById('update_btn').readonly = true;
    }
}
// #####################################################################################################################################
// ##################################      SUPERVISOR EMAIL VALIDATION       ###########################################################
function EditSupervisorEmail() {
    var email = document.getElementById('emailsup').value;
    var memail = $('#existEmail').val();
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (email.match(regx)) {
        document.getElementById('SuperemailExist').innerHTML = '';
        if (email === memail) {
            document.getElementById('SuperemailExist').innerHTML = "Manager And Supervisor email can't be same";
        }
        else {
            document.getElementById('SuperemailExist').innerHTML = '';
        }
    } else {
        document.getElementById('SuperemailExist').innerHTML = 'Invalid Email';
    }
}
// #####################################################################################################################################
// #################################      EDIT STORE DETAIL VALIDATION         #########################################################
// #####################################################################################################################################
// #######################      EDIT STORE LOCATION VALIDATION       ###################################################################
function editStorelocat() {
    var abacus_StoreLoc = document.getElementById('editStorelocation').value;
    var regx = /^[A-Za-z0-9 & ' ']+$/;
    if (abacus_StoreLoc.match(regx)) {
        document.getElementById('existStorelocedit').innerHTML = '';
    } else {
        document.getElementById('existStorelocedit').innerHTML = 'Only alphabets and numbers allowed';
    }
}
// #####################################################################################################################################
// #######################      EDIT STORE CITY/TOWN VALIDATION       ##################################################################
function editStorec() {
    var abacus_StoreTown = document.getElementById('editStorecity').value;
    var regx = /^[A-Za-z & ' ']+$/;
    if (abacus_StoreTown.match(regx)) {
        document.getElementById('existStorecityedit').innerHTML = '';
    } else {
        document.getElementById('existStorecityedit').innerHTML = 'Only alphabets allowed';
    }
}
// #####################################################################################################################################
// #######################      EDIT STORE STATE VALIDATION       ######################################################################
function editStorest() {
    var abacus_StoreState = document.getElementById('editStorestate').value;
    var regx = /^[A-Za-z & ' ']+$/;
    if (abacus_StoreState.match(regx)) {
        document.getElementById('existStorestateedit').innerHTML = '';
    } else {
        document.getElementById('existStorestateedit').innerHTML = 'Only alphabets allowed';
    }
}
// #####################################################################################################################################
// #################################      STORE MANAGER PASSWORD VALIDATION      #######################################################
// #####################################################################################################################################
function validateeditPassowrd() {
    $('#passwordeditCondition').show();
}

// #####################################################################################################################################
function editpassValidation(){
    var pwd = $('#validateManagerpass').val();
    console.log(pwd);
    var f1 = false;
    var f2 = false;
    var f3 = false;
    var f4 = false;
    // length must be minimun 8 char long
    if(pwd.length >= 8){
        document.getElementById('charlen').classList.remove('fa-times');
        document.getElementById('charlen').classList.add('fa-check');
        document.getElementById('charlen').style.color = 'green';
        f1 = true;
    }else{
        document.getElementById('charlen').classList.remove('fa-check');
        document.getElementById('charlen').classList.add('fa-times');
        document.getElementById('charlen').style.color = 'red';
        f1 = false;
    }

    //  atleast 1 Upper case alphabet
    if(pwd.match(/[A-Z]/)){
        document.getElementById('upercase').classList.remove('fa-times');
        document.getElementById('upercase').classList.add('fa-check');
        document.getElementById('upercase').style.color = 'green';
        f2 = true;
    }else{
        document.getElementById('upercase').classList.remove('fa-check');
        document.getElementById('upercase').classList.add('fa-times');
        document.getElementById('upercase').style.color = 'red';
        f2 = false;
    }

    // atleast 1 numeric value
    if(pwd.match(/[0-9]/)){
        document.getElementById('numbers').classList.remove('fa-times');
        document.getElementById('numbers').classList.add('fa-check');
        document.getElementById('numbers').style.color = 'green';
        f3 = true;
    }else{
        document.getElementById('numbers').classList.remove('fa-check');
        document.getElementById('numbers').classList.add('fa-times');
        document.getElementById('numbers').style.color = 'red';
        f3 = false;
    }

    // atleast 1 Special character 
    if(pwd.match(/[!\@\#\$\%\^\&\*\(\)\_\-\+\=]/)){
        document.getElementById('sym').classList.remove('fa-times');
        document.getElementById('sym').classList.add('fa-check');
        document.getElementById('sym').style.color = 'green';
        f4 = true;
    }else{
        document.getElementById('sym').classList.remove('fa-check');
        document.getElementById('sym').classList.add('fa-times');
        document.getElementById('sym').style.color = 'red';
        f4 = false;
    }

    if (f1 == true & f2 == true & f3 == true & f4 == true ){
        document.getElementById('update_btn').disabled = false;
    }else{
        document.getElementById('update_btn').disabled = true;
    }
}