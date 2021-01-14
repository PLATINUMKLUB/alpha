function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var counter = 0;
// #################################################################################################################################################################
// ###############################################      INDIVIDUAL TIER ADD      ###################################################################################
// #################################################################################################################################################################
function tierAdd() {
    if(counter >= 3){
        // alert('You can only add 3 tiers');
        // Swal.fire('OOPs!\n\n\nYou can only add maximum 3 tiers');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You can only add maximum 3 tiers!',
          })
        return false;
    }
    var storeName = $('select[name="StoreList"]').val();
    var tierFromAMT = $('input[name="tierFromAMT"]').val();
    var tierToAMT = $('input[name="tierToAMT"]').val();
    var tierTimePeriod = $('select[name="tierTimePeriod"]').val();
    var tierRule = $('select[name="tierRule"]').val();

    if (storeName.trim() == "--Select--") {
        // alert("Please Select Store Name");
        Swal.fire("Please Select Store Name");

        return false;
    } else if (tierFromAMT.length == 0) {
        // alert("Please Enter Amount (FROM)");
        Swal.fire("Please Enter Amount (FROM)");

        return false;
    } else if (tierToAMT.length == 0) {
        // alert("Please Enter Amount (TO)");
        Swal.fire("Please Enter Amount (TO)");

        return false;
    } else {
        const csrftoken = getCookie("csrftoken");
        $.ajax({
            type: "POST",
            url: "AddTiersRule",
            headers: { "X-CSRFToken": csrftoken },
            data: {
                storeName: storeName,
                tierFromAMT: tierFromAMT,
                tierToAMT: tierToAMT,
                tierTimePeriod: tierTimePeriod,
                tierRule: tierRule,
            },
            success: function (response) {
                $('select[name="tierTimePeriod"]').html(
                    "<option>" + tierTimePeriod + "</option>"
                );
                if (tierRule.trim() === "3") {
                    $("#tierRule option:selected").remove();
                    $("#add-tier").append(
                        '<div class="form-group">\
        <div class="col-lg-12 pl-0" >\
        <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier(this,' +
                        response +
                        "," +
                        tierRule +
                        ')"><i class="fa fa-minus-circle"></i></a>\
        <p>If any customer of Store <label style="color:red;" class="StoreNameTire">' +
                        storeName +
                        '</label>, shop amount between   Rs.<label style="color:red;" id="tierAMT_from_3"> ' +
                        tierFromAMT +
                        ' </label>\
     to  Rs.<label style="color:red;" id="tierAMT_to_3">' +
                        tierToAMT +
                        '</label> within the period of last <label style="color:red;" id="timePeriod_3">' +
                        tierTimePeriod +
                        ' </label> years then subject the user to tier\
    <label style="color:red;" id="Tier_3"> ' +
                        tierRule +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                    counter += 1;
                    var AMTto = $("input[name='tierToAMT']").val("");
                    var AMTfrom = $("input[name='tierFromAMT']").val("");
                } else if (tierRule.trim() === "2") {
                    $("#tierRule option:selected").remove();
                    $("#add-tier").append(
                        '<div class="form-group">\
        <div class="col-lg-12 pl-0" >\
        <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier(this,' +
                        response +
                        "," +
                        tierRule +
                        ')"><i class="fa fa-minus-circle"></i></a>\
        <p>If any customer of Store <label style="color:blue;" class="StoreNameTire">' +
                        storeName +
                        '</label>, shop amount between Rs.<label style="color:blue;" id="tierAMT_from_2">' +
                        tierFromAMT +
                        ' </label>\
     to  Rs.<label style="color:blue;" id="tierAMT_to_2">' +
                        tierToAMT +
                        '</label> within the period of last <label style="color:blue;" id="timePeriod_2">' +
                        tierTimePeriod +
                        ' </label> years then subject the user to tier\
    <label style="color:blue;" id="Tier_2"> ' +
                        tierRule +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                    counter += 1;
                    var AMTto = $("input[name='tierToAMT']").val("");
                    var AMTfrom = $("input[name='tierFromAMT']").val("");
                } else if (tierRule.trim() === "1") {
                    $("#tierRule option:selected").remove();
                    $("#add-tier").append(
                        '<div class="form-group">\
        <div class="col-lg-12 pl-0" >\
        <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier(this,' +
                        response +
                        "," +
                        tierRule +
                        ')"><i class="fa fa-minus-circle"></i></a>\
        <p>If any customer of Store <label style="color:green;" class="StoreNameTire">' +
                        storeName +
                        '</label>, shop amount between  Rs.<label style="color:green;" id="tierAMT_from_1"> ' +
                        tierFromAMT +
                        ' </label>\
     to  Rs.<label style="color:green;" id="tierAMT_to_1">' +
                        tierToAMT +
                        '</label> within the period of last <label style="color:green;" id="timePeriod_1">' +
                        tierTimePeriod +
                        ' </label> years then subject the user to tier\
    <label style="color:green;" id="Tier_1"> ' +
                        tierRule +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                    counter += 1;
                    var AMTto = $("input[name='tierToAMT']").val("");
                    var AMTfrom = $("input[name='tierFromAMT']").val("");
                }
            },
        });
    }
}
// #################################################################################################################################################################
// ####################################################      GET STORE NAME      ###################################################################################
// #################################################################################################################################################################
function getStorename(txt) {
    $('#AMOUNTFROM').val("");
    $('#AMOUNTTO').val("");

    $('select[name="tierTimePeriod"]').html(
        "<option>1</option>\
        <option>2</option>\
        <option>3</option>\
        <option>4</option>"
    );
    $("#tierRule").html(
        "<option value='1'>1</option>\
      <option value='2'>2</option><option value='3'>3</option>"
    );
    var StoreName = txt.value.trim();
    $("#add-tier").html("");
    $.ajax({
        type: "GET",
        url: "CheckExixtingTierRule",
        data: {
            storeName: StoreName,
        },
        success: function (response) {
            if (response.length == 3) {
                counter = 3;
        // alert("You can add only 3 tier.");

            }
            else {
                $('#addbutton').show();
                counter = response.length;
                // $('#AMOUNTFROM').prop('readonly', false);
                // $('#AMOUNTTO').prop('readonly', false);
            }
            for (var i = 0; i < response.length; i++) {
                $(
                    "#tierRule option[value=" + parseInt(response[i]["4"]) + "]"
                ).remove();
                $('select[name="tierTimePeriod"]').html(
                    "<option>" + response[i]["3"] + "</option>"
                );
                if (response[i]["4"] == "1") {
                    $("#add-tier").append(
                        '<div class="form-group">\
                <div class="col-lg-12 pl-0" >\
                <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier(this,' +
                        response[i]["5"] +
                        "," +
                        response[i]["4"] +
                        ')"><i class="fa fa-minus-circle"></i></a>\
                <p>If any customer of Store <label style="color:green;" class="StoreNameTire">' +
                        response[i]["0"] +
                        '</label>, shop amount between   Rs.<label style="color:green;" id="tierAMT_from_1"> ' +
                        response[i]["1"] +
                        ' </label>\
            to  Rs.<label style="color:green;" id="tierAMT_to_1">' +
                        response[i]["2"] +
                        '</label> within the period of last <label style="color:green;" id="timePeriod_1">' +
                        response[i]["3"] +
                        ' </label> years then subject the user to tier\
            <label style="color:green;" id="Tier_3"> ' +
                        response[i]["4"] +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                } else if (response[i]["4"] == "2") {
                    $("#add-tier").append(
                        '<div class="form-group">\
                <div class="col-lg-12 pl-0" >\
                <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier(this,' +
                        response[i]["5"] +
                        "," +
                        response[i]["4"] +
                        ')"><i class="fa fa-minus-circle"></i></a>\
                <p>If any customer of Store <label style="color:blue;" class="StoreNameTire">' +
                        response[i]["0"] +
                        '</label>, shop amount between   Rs.<label style="color:blue;" id="tierAMT_from_2"> ' +
                        response[i]["1"] +
                        ' </label>\
            to  Rs.<label style="color:blue;" id="tierAMT_to_2">' +
                        response[i]["2"] +
                        '</label> within the period of last <label style="color:blue;" id="timePeriod_2">' +
                        response[i]["3"] +
                        ' </label> years then subject the user to tier\
            <label style="color:blue;" id="Tier_3"> ' +
                        response[i]["4"] +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                } else if (response[i]["4"] == "3") {
                    $("#add-tier").append(
                        '<div class="form-group">\
                <div class="col-lg-12 pl-0" >\
                <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier(this,' +
                        response[i]["5"] +
                        "," +
                        response[i]["4"] +
                        ')"><i class="fa fa-minus-circle"></i></a>\
                <p>If any customer of Store <label style="color:red;" class="StoreNameTire">' +
                        response[i]["0"] +
                        '</label>, shop amount between   Rs.<label style="color:red;" id="tierAMT_from_3"> ' +
                        response[i]["1"] +
                        ' </label>\
            to  Rs.<label style="color:red;" id="tierAMT_to_3">' +
                        response[i]["2"] +
                        '</label> within the period of last <label style="color:red;" id="timePeriod_3">' +
                        response[i]["3"] +
                        ' </label> years then subject the user to tier\
            <label style="color:red;" id="Tier_3"> ' +
                        response[i]["4"] +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                }
            }
        },
    });
}
// #################################################################################################################################################################
// ########################################################     REMOVE TIER      ###################################################################################
// #################################################################################################################################################################
function removeTier(txt, id, TIEID) {
    var tierID = parseInt(id);
    var assID = parseInt(TIEID);
    var timePeriod_1 = $("#timePeriod_1").text();
    var timePeriod_2 = $("#timePeriod_2").text();
    var timePeriod_3 = $("#timePeriod_3").text();
    Swal.fire({
        title: "Do you want to Delete this Tier?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Delete`,
        denyButtonText: `Don't Delete`,
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "GET",
                url: "deleteTier",
                data: { tierID: tierID },
                success: function (response) {
                    console.log(response);
                    response === "True"
                        ? Swal.fire("Deleted", "", "success")
                        : Swal.fire("Something Went Wrong", "", "danger");
                    $(txt).parent().parent().parent().remove();
                    if (assID === 1) {
                        $('select[name="tierRule"]').append(
                            "<option>" + assID.toString() + "</option>"
                        );
                        counter -= 1;
                    } else if (assID === 2) {
                        $('select[name="tierRule"]').append(
                            "<option>" + assID.toString() + "</option>"
                        );
                        counter -= 1;
                    } else if (assID === 3) {
                        $('select[name="tierRule"]').append(
                            "<option>" + assID.toString() + "</option>"
                        );
                        counter -= 1;
                    }
                    var t1 = timePeriod_1.trim() === "" ? "0" : timePeriod_1;
                    var t2 = timePeriod_2.trim() === "" ? "0" : timePeriod_2;
                    var t3 = timePeriod_3.trim() === "" ? "0" : timePeriod_3;
                    var sum = parseInt(t1) + parseInt(t2) + parseInt(t3);
                    if (sum === 1) {
                        $('select[name="tierTimePeriod"]').html(
                            "<option>1</option>\
                            <option>2</option>\
                            <option>3</option>\
                            <option>4</option>"
                        );
                    }
                    $('input[name="tierFromAMT"]').val("");
                    $('input[name="tierToAMT"]').val("");
                    $("#CheckTierRange").html("<t>Shopping Range Amount (in Rs.)</t>");
                },
            });
        }
    });
}
// #####################################################################################################################################
// add tier
var num1 = 1;
$(".add-more").click(function () {
    if (num1 < 4) {
        $("#add-tier").append(
            '<div class="form-group  "> <div class="col-lg-12  pl-0  "><div class="tier_info"><a href="javasctipt:;" class="remove_tier"><i class="fa fa-minus-circle"></i></a><p>If any customer of Store <label>Adidas, Mahanagar</label>, shop amount between <label> Rs. 1,000 </label> to <label>Rs. 20,000</label> within the period of last <label>2 </label> years then subject the user to  <label>tier 3</label> in individual store category.</p>   </div> </div>   </div>'
        );
        $(".btn-primary").removeClass("disabled");
        num1++;
    } else {
        alert("You can add only 3 tier.");
    }
});
$(document).on("click", ".remove_tier", function () {
    $("#delete").modal("show");
    $(this).parent().parent().parent(".form-group").hide();
    num1--;
});
// #################################################################################################################################################################
// ################################################      CHECK AMOUNT RANGE      ###################################################################################
// #################################################################################################################################################################
function CheckRangeData(text) {
    var optionList = [];
    var amtTier3from = $("#tierAMT_from_3").text();
    var amtTier3to = $("#tierAMT_to_3").text();

    var amtTier2from = $("#tierAMT_from_2").text();
    var amtTier2to = $("#tierAMT_to_2").text();

    var amtTier1from = $("#tierAMT_from_1").text();
    var amtTier1to = $("#tierAMT_to_1").text();

    var amtTier1 = $("#Tier_1").text();
    var amtTier2 = $("#Tier_2").text();
    var amtTier3 = $("#Tier_3").text();

    var assignTier = $("select[name='tierRule']").val();
    var AMTto = $("input[name='tierToAMT']").val();
    var AMTfrom = $("input[name='tierFromAMT']").val();

    var AF = $('#AMOUNTFROM').val();
    var AT = $('#AMOUNTTO').val();

    var regx = /^[0-9]+$/;
    if (AF.match(regx)) {
        document.getElementById('AMOUNTFROM').style.border = "";
        $("#addbutton").show();

    } else {
        if (AF.length == 0) {
            document.getElementById('AMOUNTFROM').style.border = "";
            $("#addbutton").show();
        } else {
            document.getElementById('AMOUNTFROM').style.border = "1px solid red";
            // $("#addbutton").hide();
        }
    }
    if (AT.match(regx)) {
        document.getElementById('AMOUNTTO').style.border = "";
        $("#addbutton").show();
    } else {
        if (AT.length == 0) {
            document.getElementById('AMOUNTTO').style.border = "";
            $("#addbutton").show();

        } else {
            document.getElementById('AMOUNTTO').style.border = "1px solid red";
            $("#addbutton").hide();
        }
    }
    if (parseInt(AMTfrom) >= parseInt(AMTto)) {
        $("#CheckTierRange").html(
            '<t style="color:red;">Check Amount Range(From -- TO )</t>'
        );
        $("#addButn").hide();
    }
    else {
        $("#CheckTierRange").html(
            '<t >Shopping Amount (in Rs.)</t>'
        );
        // $("#addButn").hide();


    }
    if (parseInt(assignTier) === 1) {
        $("#addButn").show();
        if (parseInt(AMTfrom) >= parseInt(AMTto)) {
            $("#CheckTierRange").html(
                '<t style="color:red;">Check Amount Range(From -- TO )</t>'
            );
            $("#addButn").hide();
        } else {
            $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
            $("#addButn").show();

            if (optionList.length < 3) {
                if (amtTier2to.trim() != "") {
                    if (parseInt(amtTier2to.trim()) >= parseInt(AMTfrom.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#addButn").hide();
                    } else {
                        $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
                        $("#addButn").show();

                    }
                } else if (amtTier3to.trim() != "") {
                    if (parseInt(amtTier3to.trim()) >= parseInt(AMTfrom.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 3</t>'
                        );
                        $("#addButn").hide();
                    }
                }
            }
        }
    }
    if (parseInt(assignTier) === 2) {
        $("#addButn").show();
        if (parseInt(AMTfrom) >= parseInt(AMTto)) {
            $("#CheckTierRange").html(
                '<t style="color:red;">Check Amount Range(From -- TO )</t>'
            );
            $("#addButn").hide();
        } else {
            if (optionList.length < 3) {
                if (amtTier1to.trim() != "") {
                    if (parseInt(amtTier1from.trim()) <= parseInt(AMTfrom.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 1</t>'
                        );
                        $("#addButn").hide();
                    } else if (parseInt(amtTier1from.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 1</t>'
                        );
                        $("#addButn").hide();
                    } else {
                        $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
                        $("#addButn").show();

                    }
                }
                if (amtTier3to.trim() != "") {
                    console.log(AMTto);
                    console.log(amtTier1from);
                    if (parseInt(amtTier3to.trim()) >= parseInt(AMTfrom.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 3</t>'
                        );
                        $("#addButn").hide();
                    } else if (parseInt(amtTier1from.trim()) <= parseInt(AMTto.trim())) {
                        console.log("ASAS");
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#addButn").hide();
                    } else {
                        console.log('GAYA');
                        $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
                        $("#addButn").show();

                    }
                }
            }
        }
    } else if (parseInt(assignTier) === 3) {
        $("#addButn").show();
        if (parseInt(AMTfrom) >= parseInt(AMTto)) {
            $("#CheckTierRange").html(
                '<t style="color:red;">Check Amount Range(From -- TO )</t>'
            );
            $("#addButn").hide();
        } else {
            if (optionList.length < 3) {
                if (amtTier1to.trim() != "") {
                    if (parseInt(amtTier1from.trim()) <= parseInt(AMTfrom.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#addButn").hide();
                    } else if (parseInt(amtTier1to.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#addButn").hide();
                    } else {
                        $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
                        $("#addButn").show();

                    }
                }
                if (amtTier2to.trim() != "") {
                    if (parseInt(amtTier2from.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#addButn").hide();
                    } else if (
                        parseInt(amtTier2from.trim()) <= parseInt(AMTfrom.trim())
                    ) {
                        $("#CheckTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#addButn").hide();
                    } else {
                        $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
                        $("#addButn").show();

                    }
                }
            }
        }
    }
}
// #####################################################################################################################################
$('select[name="tierRule"]').on('change', function () {
    $('input[name="tierFromAMT"]').val("");
    $('input[name="tierToAMT"]').val("");
    $("#CheckTierRange").html("<t >Shopping Amount (in Rs.)</t>");
    $("#addButn").show();
});
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
