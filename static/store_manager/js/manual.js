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

function searchContact(txt) {
    var text = txt.value;
    document.getElementById('search_contact').style.border = '';
    document.getElementById('invalidContact').innerHTML = '';
    if (text == '') {
        document.getElementById('save_btn').disabled = true;
        document.getElementById('search_contact').style.border = '1px solid red';
        document.getElementById('invalidContact').innerHTML = 'Only numbers allowed starting with 6,7,8,9';
    } else {
        var regx = /^[6-9]\d{9}$/;
        if (text.match(regx)) {
            document.getElementById('search_contact').style.border = '';
            document.getElementById('invalidContact').innerHTML = '';
            document.getElementById('save_btn').disabled = false;
            $('#TitleCustomer').html("");
            $('#customerName').val("");
            $('#customerEmail').val("");
            $('#kt_datepicker_1').val("");
            $("input[name='CustomerGender']").prop("checked", false);
            var contact = document.getElementById('search_contact').value;
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                type: 'POST',
                url: "checkExistCustomer",
                headers: { 'X-CSRFToken': csrftoken },
                data: { "ContactNumber": contact },
                success: function (response) {
                    var flagHide = contact.length === 10 ? true : false;
                    flagHide === true ? $("#SetOpacity").css({ 'pointer-events': 'auto', 'opacity': '1' }) : $("#SetOpacity").css({ 'pointer-events': 'none', 'opacity': '.3' });;
                    if (response.length === 1 && flagHide) {
                        $('#TitleCustomer').html("Old Customer");
                        for (var key in response) {
                            $('#customerName').val(response[key]['name']);
                            $('#customerEmail').val(response[key]['email']);
                            $('#kt_datepicker_1').val(response[key]['DOB']);
                            $('#kt_datepicker_2').val(response[key]['DOM']);
                            if (response[0]['gender'] == 'NA') {
                                $("#Customer_male").prop("checked", false);
                                $("#Customer_female").prop("checked", false);
                            } else if (response[0]['gender'] == 'M' || response[0]['gender'] == 'm' || response[0]['gender'] == 'MALE' || response[0]['gender'] == 'Male') {
                                $("#Customer_male").prop("checked", true);
                            } else {
                                $("#Customer_female").prop("checked", true);
                            }
                        }
                    } else if (contact.length === 10 && response.length === 0) {
                        $('#TitleCustomer').html("New Customer");
                    }
                }
            })
        } else if ((text.length != 10)) {
            document.getElementById('save_btn').disabled = true;
            document.getElementById('search_contact').style.border = '1px solid red';
            document.getElementById('invalidContact').innerHTML = 'Contact must be 10 of digits';

        }
        else {
            document.getElementById('save_btn').disabled = true;
            document.getElementById('search_contact').style.border = '1px solid red';
            document.getElementById('invalidContact').innerHTML = 'Contact contains numbers only and starts with 6,7,8,9';

        }
    }
}





function searchInvoice() {
    var InVoiceNumber = document.getElementById('InvoiceNumber').value;
    var MobileNumber = document.getElementById('search_contact').value;
    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: "checkExistInVoiceNo",
        headers: { 'X-CSRFToken': csrftoken },
        data: { "InVoiceNumber": InVoiceNumber, "MobileNumber": MobileNumber },
        success: function (response) {
            if (response === 'True') {
                for (var key in response) {
                    $("#CheckInvoice").css({ 'color': 'red' });
                    document.getElementById('save_btn').disabled = true;
                }
            } else {
                $("#CheckInvoice").css({ 'color': '' });
                document.getElementById('save_btn').disabled = false;
            }
        }
    })

}


$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: "NewInVoiceNogenrate",
        success: function (response) {
            if (response['invoice'].length > 0) {
                var incoNum = response['invoice'].split(/(\d+)/);
                var noInVO = parseInt(incoNum[1]) + 1;
                var strInVO = incoNum[0] + noInVO.toString();
                $('#InvoiceNumber').val(strInVO);
            } else {
                console.log('B')
            }
        }
    })
});


function validateName(txt) {
    var text = txt.value;
    var regx = /^[A-Za-z & ' ']+$/;
    document.getElementById('customerName').style.border = '';
    document.getElementById('invalidContact').innerHTML = '';
    if (text == '') {
        document.getElementById('save_btn').disabled = true;
        document.getElementById('customerName').style.border = '1px solid red';
        document.getElementById('invalidName').innerHTML = 'Only alphabets allowed';
    } else {
        if (text.match(regx)) {
            document.getElementById('customerName').style.border = '';
            document.getElementById('invalidName').innerHTML = '';
            document.getElementById('save_btn').disabled = false;
        } else {
            document.getElementById('customerName').style.border = '1px solid red';
            document.getElementById('invalidName').innerHTML = 'Only alphabets allowed';
            document.getElementById('save_btn').disabled = true;
        }
    }
}


function validateEmail(txt) {
    var emailData = txt.value;
    var regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.]{2,5})+\.([A-Za-z]{2,5})$/;
    if (emailData == '') {
        document.getElementById('save_btn').disabled = true;
        document.getElementById('customerEmail').style.border = '1px solid red';
        document.getElementById('invalidEmail').innerHTML = 'Invalid Email';
    } else {
        if (emailData.match(regx)) {
            document.getElementById('customerEmail').style.border = '';
            document.getElementById('invalidEmail').innerHTML = '';
            document.getElementById('save_btn').disabled = false;
        }
        else {
            document.getElementById('customerEmail').style.border = '1px solid red';
            document.getElementById('invalidEmail').innerHTML = 'Invalid Email';
        }
    }
}

function validateAmt(txt) {
    var amtData = txt.value;
    var pattern = /^(\$|)([1-9]\d{0,2}(\,\d{3})*|([1-9]\d*))(\.\d{2})?$/;
    if (amtData == "") {
        document.getElementById('amount').style.border = '1px solid red';
        document.getElementById('save_btn').disabled = true;
    } else {
        if (amtData.match(pattern)) {
            document.getElementById('amount').style.border = '';
            document.getElementById('save_btn').disabled = false;
        }
    }
}
// ##################################  MANUAL ENTRY USING AJAX  ######################################################
function manualentryAjax() {
    var contact = $('#search_contact').val();
    var invoice = $('#InvoiceNumber').val();
    var name = $('#customerName').val();
    var gender = $("input[name='CustomerGender']").val();
    var DOB = $('#kt_datepicker_1').val();
    var DOM = $('#kt_datepicker_2').val();
    var email = $('#customerEmail').val();
    var amount = $('#amount').val();
    const csrftoken = getCookie('csrftoken');
    if(amount == ''){
        Swal.fire('Enter shopping amount!');
        return false;
    }else if(amount == '' || contact == '' || invoice == ''){
        Swal.fire('Enter the essential fields(*) data!');
        return false;
    }else{
        $.ajax({
            type: 'POST',
            url: "manualEntryData",
            headers: { 'X-CSRFToken': csrftoken },
            data: { 'contact': contact, 'invoice': invoice, 'name': name, 'gender': gender, 'DOB': DOB, 'DOM': DOM, 'email': email, 'amount': amount },
            success: function (response) {
                console.log(response);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Entry saved successfully',
                    showConfirmButton: true,
                })
                var contact = $('#search_contact').val("");
                var name = $('#customerName').val("");
                var gender = $("input[name='CustomerGender']").val("");
                var DOB = $('#kt_datepicker_1').val("");
                var DOM = $('#kt_datepicker_2').val("");
                var email = $('#customerEmail').val("");
                var amount = $('#amount').val("");
                $.ajax({
                    type: 'GET',
                    url: "NewInVoiceNogenrate",
                    success: function (response) {
                        if (response['invoice'].length > 0) {
                            var incoNum = response['invoice'].split(/(\d+)/);
                            var noInVO = parseInt(incoNum[1]) + 1;
                            var strInVO = incoNum[0] + noInVO.toString();
                            $('#InvoiceNumber').val(strInVO);
                        }
                    }
                })
            }
        })
    }
}