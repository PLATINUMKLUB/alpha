var count = 0;

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
// #########################################################################################################################
$(function () {
    $('#catGRY').selectpicker();
    $("#catGRY").on("changed.bs.select", function (e, clickedIndex, isSelected, oldValue) {
        var selectedItems = ($(this).selectpicker('val') || []);
        const csrftoken = getCookie('csrftoken');
        $.ajax({
            type: 'POST',
            url: "AddSubCategoryDropDown/",
            headers: { 'X-CSRFToken': csrftoken },
            data: { dataList: selectedItems.toString() },
            success: function (response) {
                var listData = [];
                var optionStr = '';
                var Data = eval(response);
                for (var i = 0; i < Data.length; i++) {
                    for (var j = 0; j < Data[i].length; j++) {
                        listData.push(Data[i][j]);
                    }
                }
                $('#subcatGRY').empty();
                for (var k = 0; k < listData.length; k++) {
                    $('#subcatGRY').append($('<option>').text(listData[k]).attr('value', listData[k]));
                }
                $('#subcatGRY').selectpicker('refresh');
                $('#subcatGRY').selectpicker('render');
            }
        })
    });
});
// #########################################################################################################################
// A $( document ).ready() block.
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: "getLatestStoreID",
        success: function (response) {
            if (parseInt(response) != 0) {
                var no = parseInt(response) + 1;
                $('input[name="StoreIDAbacusSHop"]').val("ABX_00" + no.toString());
            } else {
                var no = parseInt(response) + 1;
                $('input[name="StoreIDAbacusSHop"]').val("ABX_00" + no.toString());
            }

        }
    })
    localStorage.clear();
    localStorage.setItem('StepNO', 1);
});
// #########################################################################################################################
function nextFormAddCategory() {
    var StepNO = localStorage.getItem('StepNO');
    // Step_1
    var storeName = $("input[name='storeName']").val();
    var storeLocation = $("input[name='storeLocation']").val();
    var storState = $("input[name='storState']").val();
    var storeCity = $("input[name='storeCity']").val();
    var storCategory = $("select[name='storCategory']").val();
    var storSubCategory = $("select[name='storSubCategory']").val();
    // Step_2
    var managerProfileImage = $("input[name='managerProfileImage']").val();
    var mangerName = $("input[name='mangerName']").val();
    var mangerContactNo = $("input[name='mangerContactNo']").val();
    var userUinqueID = $("input[name='userUinqueID']").val();
    var managerGender = $("input[name='managerGender']").val();
    var managerEmail = $("input[name='managerEmail']").val();
    var managerPass = $("input[name='managerPass']").val();
    var managerConfirmPass = $("input[name='managerConfirmPass']").val();
    var supervisorName = $("input[name='supervisorName']").val();
    var supervisorContactNO = $("input[name='supervisorContactNO']").val();
    var supervisorEmail = $("input[name='supervisorEmail']").val();
    var supervisorGender = $("input[name='supervisorGender']").val();
    var accessEntryOfData = $("input[name='accessEntryOfData']").val();
    // Step_3
    var NewStoreName = storeName;
    var AMTto = $("input[name='AMTto']").val();
    var AMTfrom = $("input[name='AMTfrom']").val();
    var selectYear = $("select[name='selectYear']").val();
    var assignTier = $("select[name='assignTier']").val();

    if (parseInt(StepNO) == 1) {
        if (storeName.trim() == '' || storeCity.trim() == '' || storeLocation.trim() == '' || storState.trim() == '') {
            $('#ShowValidationIssue').html('Store Details  <em style="color:red;"> &nbsp; &nbsp;&nbsp;  Please Fill Mandatory  Filled *<em>')
            return false;
        }
    } else if (parseInt(StepNO) == 2) {
        if (managerEmail.trim() == '' || mangerName.trim() == '' || mangerContactNo.trim() == '' || userUinqueID.trim() == '' || managerPass.trim() == '' || managerConfirmPass.trim() == '') {
            // alert("Please fill up mandatory fields with correct info (*)");
            Swal.fire('Please fill up mandatory fields with correct info (*)');
            return false;
        }
    }
    var increaseStepNo = parseInt(StepNO) + 1;
    localStorage.setItem('StepNO', increaseStepNo);
    var StepNOnew = localStorage.getItem('StepNO');
    if (parseInt(StepNOnew) === 2) {
        $('#Step1').hide();
        $('#Step2').show();
        $('#Step4').hide();
    } else if (parseInt(StepNOnew) === 3) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        $('#Step1').show();
        $('#Step2').show();
        $('#Step4').show();
        $("#nextAddChangeSubmit").html("<button type='submit' class='btn btn-primary  mt-4' id='NextButton'\
                                    >Submit</button>");
    }
    else {
        localStorage.setItem('StepNO', 1);
    }
}
// #########################################################################################################################
function getPassword_Manager(cPass) {
    var managerPass = $("input[name='managerPass']").val();
    cPass.value.trim() != managerPass.trim() ? $('#checkPassmanager').html("Check Confirm Password<span style='color:red;'>*Password not matched!</span>") : $('#checkPassmanager').html("Confirm Password<span>*</span>")
}
// #########################################################################################################################
function AddStoreName(txt) {
    var abacus_StoreName = txt.value.trim();
    $.ajax({
        type: 'GET',
        url: "checkStoreName",
        data: { 'abacus_StoreName': abacus_StoreName },
        success: function (response) {
            response.toString() == 'False' ? $('#StoreNameLabel').html("<label>Store Name  *</label>") : $('#StoreNameLabel').html("<label style='color:red;'>Store Name Already Registered *</label>");
            response.toString() == 'False' ? $('#NextButton').prop('disabled', false) : $('#NextButton').prop('disabled', true);
        }
    })
}
// #########################################################################################################################
function submitStoreDetail() {
    // Step_1
    var storeName = $("input[name='storeName']").val();
    var storeLocation = $("input[name='storeLocation']").val();
    var storState = $("input[name='storState']").val();
    var storeCity = $("input[name='storeCity']").val();
    var storCategory = $("select[name='storCategory']").val();
    var storSubCategory = $("select[name='storSubCategory']").val();

    // Step_2
    var managerProfileImage = $("input[name='managerProfileImage']").prop("files");
    var mangerName = $("input[name='mangerName']").val();
    var mangerContactNo = $("input[name='mangerContactNo']").val();
    var userUinqueID = $("input[name='userUinqueID']").val();
    var managerGender = $("input[name='managerGender']").val();
    var managerEmail = $("input[name='managerEmail']").val();
    var managerPass = $("input[name='managerPass']").val();
    var managerConfirmPass = $("input[name='managerConfirmPass']").val();
    var supervisorName = $("input[name='supervisorName']").val();
    var supervisorContactNO = $("input[name='supervisorContactNO']").val();
    var supervisorEmail = $("input[name='supervisorEmail']").val();
    var supervisorGender = $("input[name='supervisorGender']").val();
    var accessEntryOfData = $("input[name='accessEntryOfData']").val();
    // Step_3
    var NewStoreName = storeName;
    var AMTto = $("input[name='AMTto']").val();
    var AMTfrom = $("input[name='AMTfrom']").val();
    var selectYear = $("select[name='selectYear']").val();
    var assignTier = $("select[name='assignTier']").val();
    var addStoreData = {
        'storeName': storeName.trim(),
        'storeLocation': storeLocation.trim(),
        'storState': storState.trim(),
        'storeCity': storeCity.trim(),
        'storCategory': storCategory,
        'storSubCategory': storSubCategory,
        'managerProfileImage': managerProfileImage,
        'mangerName': mangerName.trim(),
        'mangerContactNo': mangerContactNo.trim(),
        'userUinqueID': userUinqueID.trim(),
        'managerGender': managerGender.trim(),
        'managerEmail': managerEmail.trim(),
        'managerPass': managerPass.trim(),
        'managerConfirmPass': managerConfirmPass.trim(),
        'supervisorName': supervisorName.trim(),
        'supervisorContactNO': supervisorContactNO.trim(),
        'supervisorEmail': supervisorEmail.trim(),
        'supervisorGender': supervisorGender.trim(),
        'accessEntryOfData': accessEntryOfData.trim(),
        'NewStoreName': NewStoreName.trim(),
        'AMTto': AMTto.trim(),
        'AMTfrom': AMTfrom.trim(),
        'selectYear': selectYear.trim(),
        'assignTier': assignTier.trim()
    }
    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: "AddStoreDeatil",
        headers: { 'X-CSRFToken': csrftoken },
        data: addStoreData,
        success: function (response) {
            console.log("Aditya Shukla");
        }
    })

}
// #########################################################################################################################


