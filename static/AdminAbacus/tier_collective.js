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

// #################################################################################################################################################################
// ###############################################      COLLECTIVE TIER ADD      ###################################################################################
// #################################################################################################################################################################
function collective_tierAdd() {
    var checkTier = $('select[name="tier_rule"]').text();
    if (checkTier.trim().length === 0) { 
        // alert('You can not add More Tier');
        // Swal.fire('OOPs\n\n\nYou can only add maximum 3 Tiers');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You can only add maximum 3 tiers!',
          })

        return false;
    }
    var tierFromAMT = $('input[name="tier_fromAMT"]').val();
    var tierToAMT = $('input[name="tier_toAMT"]').val();
    var tierTimePeriod = $('select[name="tier_timePeriod"]').val();
    var tierRule = $('select[name="tier_rule"]').val();

    if (tierFromAMT.length == 0) {
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
            url: "CollectiveAddTiersRule",
            headers: { "X-CSRFToken": csrftoken },
            data: {
                tierFromAMT: tierFromAMT,
                tierToAMT: tierToAMT,
                tierTimePeriod: tierTimePeriod,
                tierRule: tierRule,
            },
            success: function (response) {
                $('select[name="tier_timePeriod"]').html(
                    "<option>" + tierTimePeriod + "</option>"
                );
                if (tierRule.trim() === "3") {
                    $("#tier_rule option:selected").remove();
                    $("#add-tier").append(
                        '<div class="form-group">\
        <div class="col-lg-12 pl-0" >\
        <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier_collective(this,' +
                        response +
                        "," +
                        tierRule +
                        ')"><i class="fa fa-minus-circle"></i></a>\
        <p>If any customer of  <label style="color:red;" class="StoreNameTire">' +
                        "All Store" +
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
                    var AMTto = $("input[name='tier_toAMT']").val("");
                    var AMTfrom = $("input[name='tier_fromAMT']").val("");
                }
                else if (tierRule.trim() === "2") {
                    $("#tier_rule option:selected").remove();
                    $("#add-tier").append(
                        '<div class="form-group">\
        <div class="col-lg-12 pl-0" >\
        <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier_collective(this,' +
                        response +
                        "," +
                        tierRule +
                        ')"><i class="fa fa-minus-circle"></i></a>\
        <p>If any customer of  <label style="color:blue;" class="StoreNameTire">' +
                        "All Store" +
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
                    var AMTto = $("input[name='tier_toAMT']").val("");
                    var AMTfrom = $("input[name='tier_fromAMT']").val("");
                } else if (tierRule.trim() === "1") {
                    $("#tier_rule option:selected").remove();
                    $("#add-tier").append(
                        '<div class="form-group">\
        <div class="col-lg-12 pl-0" >\
        <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier_collective(this,' +
                        response +
                        "," +
                        tierRule +
                        ')"><i class="fa fa-minus-circle"></i></a>\
        <p>If any customer of  <label style="color:green;" class="StoreNameTire">' +
                        "All Store" +
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
                    var AMTto = $("input[name='tier_toAMT']").val("");
                    var AMTfrom = $("input[name='tier_fromAMT']").val("");
                }
            },
        });
    }
}
// #################################################################################################################################################################
// ########################################################     REMOVE TIER      ###################################################################################
// #################################################################################################################################################################
function removeTier_collective(txt, id, TIEID) {
    var tierID = parseInt(id);
    var assID = parseInt(TIEID);
    var timePeriod_1 = $("#timePeriod_1").text();
    var timePeriod_2 = $("#timePeriod_2").text();
    var timePeriod_3 = $("#timePeriod_3").text();
    Swal.fire({
        title: "Do you want to Delete ?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Delete`,
        denyButtonText: `Don't Delete`,
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "GET",
                url: "collective_deleteTier",
                data: { tierID: tierID },
                success: function (response) {
                    response === "True"
                        ? Swal.fire("Deleted", "", "success")
                        : Swal.fire("Something Went Wrong", "", "danger");
                    $(txt).parent().parent().parent().remove();
                    if (assID === 1) {
                        $('select[name="tier_rule"]').append(
                            "<option>" + assID.toString() + "</option>"
                        );

                    } else if (assID === 2) {
                        $('select[name="tier_rule"]').append(
                            "<option>" + assID.toString() + "</option>"
                        );
                    } else if (assID === 3) {
                        $('select[name="tier_rule"]').append(
                            "<option>" + assID.toString() + "</option>"
                        );
                    }
                    var t1 = timePeriod_1.trim() === "" ? "0" : timePeriod_1;
                    var t2 = timePeriod_2.trim() === "" ? "0" : timePeriod_2;
                    var t3 = timePeriod_3.trim() === "" ? "0" : timePeriod_3;
                    var sum = parseInt(t1) + parseInt(t2) + parseInt(t3);
              
                    if (sum === 1) {
                        $('select[name="tier_timePeriod"]').html(
                            "<option>1</option>\
                            <option>2</option>\
                            <option>3</option>\
                            <option>4</option>"
                        );
                    }
                        $('input[name="tier_fromAMT"]').val("");
                      $('input[name="tier_toAMT"]').val("");
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
    var amtTier3from = $("#tierAMT_from_3").text();
    var amtTier3to = $("#tierAMT_to_3").text();

    var amtTier2from = $("#tierAMT_from_2").text();
    var amtTier2to = $("#tierAMT_to_2").text();

    var amtTier1from = $("#tierAMT_from_1").text();
    var amtTier1to = $("#tierAMT_to_1").text();

    var amtTier1 = $("#Tier_1").text();
    var amtTier2 = $("#Tier_2").text();
    var amtTier3 = $("#Tier_3").text();

    var assignTier = $("select[name='tier_rule']").val();
    var AMTto = $("input[name='tier_toAMT']").val();
    var AMTfrom = $("input[name='tier_fromAMT']").val();

    var AF = $('#beginAMT').val();
    var AT = $('#lastAMT').val();

    var regx = /^[0-9]+$/;
    if (AF.match(regx)) {
        document.getElementById('beginAMT').style.border = "";
        $("#colBUTTON").show(); 
    } else {
        if (AF.length == 0){
            document.getElementById('beginAMT').style.border = "";
            $("#colBUTTON").show(); 
        }else{
        document.getElementById('beginAMT').style.border = "1px solid red";
        $("#colBUTTON").hide();
        }
    }
    if (AT.match(regx)) {
        document.getElementById('lastAMT').style.border = "";
        $("#colBUTTON").show();
    } else {
        if (AT.length == 0) {
            document.getElementById('beginAMT').style.border = "";
            $("#colBUTTON").show(); 
        } else {
            document.getElementById('beginAMT').style.border = "1px solid red";
            $("#colBUTTON").hide();
        }
    }
    if (parseInt(AMTfrom) >= parseInt(AMTto)) {
        $("#colBUTTON").show(); 
        $("#CheckCollectiveTierRange").html(
            '<t style="color:red;">Check Amount Range(From -- TO )</t>'
        );
        $("#collectiveButn").hide();
    }
    else { 
        $("#CheckCollectiveTierRange").html(
            '<t >Shopping Amount (in Rs.)</t>'
        );
        $("#collectiveButn").show();
    }
    if (parseInt(assignTier) === 1) {
        $("#colBUTTON").show(); 
        if (parseInt(AMTfrom) >= parseInt(AMTto)) {
            $("#CheckCollectiveTierRange").html(
                '<t style="color:red;">Check Amount Range(From -- TO )</t>'
            );
            $("#collectiveButn").hide();
        } else {
            $("#CheckCollectiveTierRange").html("<t>Shopping Amount (in Rs.)</t>");
            $("#collectiveButn").show();
                if (amtTier2to.trim() != "") {
                    $("#colBUTTON").show(); 
                    if (parseInt(amtTier2to.trim()) >= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    } else {
                        $("#CheckCollectiveTierRange").html(
                            "<t >Shopping Amount (in Rs.)</t>"
                        );
                        $("#collectiveButn").show();
                    }
                } else if (amtTier3to.trim() != "") {
                    if (parseInt(amtTier3to.trim()) >= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 3</t>'
                        );
                        $("#collectiveButn").hide();
                    }
                }
        }
    }
    if (parseInt(assignTier) === 2) {
        $("#colBUTTON").show(); 
        if (parseInt(AMTfrom) >= parseInt(AMTto)) {
            $("#CheckCollectiveTierRange").html(
                '<t style="color:red;">Check Amount Range(From -- TO )</t>'
            );
            $("#collectiveButn").hide();
        } else {
            $("#collectiveButn").show();
                if (amtTier1to.trim() != "") {
                    $("#colBUTTON").show(); 
                    if (parseInt(amtTier1from.trim()) <= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 1</t>'
                        );
                        $("#collectiveButn").hide();
                    } else if (parseInt(amtTier1from.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 1</t>'
                        );
                        $("#collectiveButn").hide();
                    } else {
                        $("#CheckCollectiveTierRange").html(
                            "<t >Shopping Amount (in Rs.)</t>"
                        );
                        $("#collectiveButn").show();
                    }
                }
                if (amtTier3to.trim() != "") {
                    $("#colBUTTON").show(); 
                    if (parseInt(amtTier3to.trim()) >= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 3</t>'
                        );
                        $("#collectiveButn").hide();
                    } else if (
                        parseInt(amtTier2from.trim()) >= parseInt(AMTfrom.trim())
                    ) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    } else {
                        $("#CheckCollectiveTierRange").html(
                            "<t >Shopping Amount (in Rs.)</t>"
                        );
                        $("#collectiveButn").show();
                    }
                }
        }
    } else if (parseInt(assignTier) === 3) {
        $("#colBUTTON").show(); 
        if (parseInt(AMTfrom) >= parseInt(AMTto)) {
            $("#CheckCollectiveTierRange").html(
                '<t style="color:red;">Check Amount Range(From -- TO )</t>'
            );
            $("#collectiveButn").hide();
        } else {
             $("#collectiveButn").show();
                if (amtTier1to.trim() != "") {
                    $("#colBUTTON").show(); 
                    if (parseInt(amtTier1from.trim()) <= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    } else if (parseInt(amtTier1to.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    }
                         else if (parseInt(amtTier2to.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    }
                              else if (parseInt(amtTier2from.trim()) <= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    }
                    else if (parseInt(amtTier1from.trim()) <= parseInt(AMTto.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 1</t>'
                        );
                        $("#collectiveButn").hide();
                    }
                }
                if (amtTier2to.trim() != "") {
                    $("#colBUTTON").show(); 
                    if (parseInt(amtTier2from.trim()) <= parseInt(AMTfrom.trim())) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    } else if (
                        parseInt(amtTier2from.trim()) <= parseInt(AMTto.trim())
                    ) {
                        $("#CheckCollectiveTierRange").html(
                            '<t style="color:red;">Check Shopping Range Amount (in Rs.) With Tier 2</t>'
                        );
                        $("#collectiveButn").hide();
                    } else {
                        $("#CheckCollectiveTierRange").html(
                            "<t >Shopping Amount (in Rs.)</t>"
                        );
                        $("#collectiveButn").show();
                    }
                }
        }
    }
}
// #################################################################################################################################################################
// ###########################################################      ONREADY      ###################################################################################
// #################################################################################################################################################################
$(document).ready(function getStorename(txt) {
    $("#add-tier").html("");
    $.ajax({
        type: "GET",
        url: "CheckExixtingTierRule_collective",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                $("#tier_rule option[value=" + parseInt(response[i]["tierRuleNo"]) + "]").remove();
                $('select[name="tier_timePeriod"]').html("<option>" + response[i]["time_period"] + "</option>");
                if (response[i]["tierRuleNo"] == "1") {
                    $("#add-tier").append(
                        '<div class="form-group">\
                <div class="col-lg-12 pl-0" >\
                <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier_collective(this,' +
                        response[i]["id"] +
                        "," +
                        response[i]["tierRuleNo"] +
                        ')"><i class="fa fa-minus-circle"></i></a>\
                <p>If any customer of <label style="color:green;" class="StoreNameTire">' +
                        "All Stores" +
                        '</label>, shop amount between   Rs.<label style="color:green;" id="tierAMT_from_1"> ' +
                        response[i]["shop_start_amt"] +
                        ' </label>\
            to  Rs.<label style="color:green;" id="tierAMT_to_1">' +
                        response[i]["shop_end_amt"] +
                        '</label> within the period of last <label style="color:green;" id="timePeriod_1">' +
                        response[i]["time_period"] +
                        ' </label> years then subject the user to tier\
            <label style="color:green;" id="Tier_3"> ' +
                        response[i]["tierRuleNo"] +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                } else if (response[i]["tierRuleNo"] == "2") {
                    $("#add-tier").append(
                        '<div class="form-group">\
                <div class="col-lg-12 pl-0" >\
                <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier_collective(this,' +
                        response[i]["id"] +
                        "," +
                        response[i]["tierRuleNo"] +
                        ')"><i class="fa fa-minus-circle"></i></a>\
                <p>If any customer of <label style="color:blue;" class="StoreNameTire">' +
                        "All Stores" +
                        '</label>, shop amount between   Rs.<label style="color:blue;" id="tierAMT_from_2"> ' +
                        response[i]["shop_start_amt"] +
                        ' </label>\
            to  Rs.<label style="color:blue;" id="tierAMT_to_2">' +
                        response[i]["shop_end_amt"] +
                        '</label> within the period of last <label style="color:blue;" id="timePeriod_2">' +
                        response[i]["time_period"] +
                        ' </label> years then subject the user to tier\
            <label style="color:blue;" id="Tier_3"> ' +
                        response[i]["tierRuleNo"] +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                } else if (response[i]["tierRuleNo"] == "3") {
                    $("#add-tier").append(
                        '<div class="form-group">\
                <div class="col-lg-12 pl-0" >\
                <div class="tier_info"><a href="#" class="removeTier" onclick="removeTier_collective(this,' +
                        response[i]["id"] +
                        "," +
                        response[i]["tierRuleNo"] +
                        ')"><i class="fa fa-minus-circle"></i></a>\
                <p>If any customer of <label style="color:red;" class="StoreNameTire">' +
                        "All Stores" +
                        '</label>, shop amount between   Rs.<label style="color:red;" id="tierAMT_from_3"> ' +
                        response[i]["shop_start_amt"] +
                        ' </label>\
            to  Rs.<label style="color:red;" id="tierAMT_to_3">' +
                        response[i]["shop_end_amt"] +
                        '</label> within the period of last <label style="color:red;" id="timePeriod_3">' +
                        response[i]["time_period"] +
                        ' </label> years then subject the user to tier\
            <label style="color:red;" id="Tier_3"> ' +
                        response[i]["tierRuleNo"] +
                        "</label> in individual store  category.</p></div></div></div>"
                    );
                }
            }
        },
    });
});
// #####################################################################################################################################
$('select[name="tier_rule"]').on('change', function() {
    $('input[name="tier_fromAMT"]').val("");
    $('input[name="tier_toAMT"]').val("");
    $("#CheckCollectiveTierRange").html("<t >Shopping Amount (in Rs.)</t>");
      $("#collectiveButn").show();
});
// #####################################################################################################################################
