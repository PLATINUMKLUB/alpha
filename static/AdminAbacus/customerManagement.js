$(".sel_all").click(function () {
    $("#kt_select2_3 > option").prop("selected", "selected");
    $("#kt_select2_3").trigger("change");

});
// ########################################################################################################
// ##############################  SLIDER FOR FILTER   ####################################################
// ########################################################################################################
$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500000,
        values: [0, 500000],
        // step: 100,
        slide: function (event, ui) {
            $("#minval").val(ui.values[0]);
            $("#maxval").val(ui.values[1]);
            $("#amount").val("Rs." + ui.values[0] + " - Rs." + ui.values[1]);

        }
    });
    $("#minval").change(function () {
        $("#slider-range").slider('values', 0, $(this).val());
    });
    $("#maxval").change(function () {
        $("#slider-range").slider('values', 1, $(this).val());
    });
    $("#minval").val($("#slider-range").slider('values', 0));
    $("#maxval").val($("#slider-range").slider('values', 1));

    $("#amount").val("Rs." + $("#slider-range").slider("values", 0) +
        " - Rs." + $("#slider-range").slider("values", 1));
});


function checkAmtRange() {
    var start = $("#minval").val();
    var end = $("#maxval").val();
    var startAmt = parseInt(start);
    var endAmt = parseInt(end);

    console.log(typeof (startAmt), end);
    if (startAmt <= endAmt) {
        $('#erroramt').html('');
        $('#FilterCustomerManagementID').prop('disabled', false);
        $("#amount").val("Rs." + startAmt +
            " - Rs." + endAmt);

    } else if (startAmt > endAmt) {
        $('#erroramt').html('Starting amount must be less than End amount!');
        $('#FilterCustomerManagementID').prop('disabled', true);
        $("#amount").val("Rs." + startAmt +
            " - Rs." + endAmt);
    }
}

// ##############################################################################
$('.filter').click(function () {
    $('.filters').toggleClass('show');
});
$('.filters .btn').click(function () {
    $('.filters').removeClass('show');
});
$('.cust_tbl td:nth-child(2), .cust_tbl td:nth-child(3),.cust_tbl td:nth-child(3),.cust_tbl td:nth-child(4), .cust_tbl td:nth-child(5)').on('click', function () {
    $('#cust_det').modal('show');

});

// ########################################################################################################
// ##############################   CSRF TOKEN GENERATION   ###############################################

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

// ########################################################################################################
// #############################   EXPORTING CSV FILE   ###################################################
// ########################################################################################################
function exportCSVData(thisKeyWord) {

    var checkAllCustFlag = $('#Allcust').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcust').is(':checked');
    var checkunselectAllFlag = $('#unselectAll').is(':checked');
    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomers",
            success: function (response) {
                var dataList = response;

                // console.log(dataList);
                let csvContent = "data:text/csv;charset=utf-8,"
                    + dataList.map(e => e.join(",")).join("\n");


                var encodedUri = encodeURI(csvContent);
                console.log(dataList);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                var name = getFileName();
                if (name != false) {
                    link.setAttribute("download", name + ".csv");
                    document.body.appendChild(link); // Required for FF

                    link.click(); // This will download the data file named "my_data.csv".
                    $('.close').click();
                    return false;
                }
            }
        });
    }
    else if (checkselectAllcustFlag) {
        var dataList = [];
        dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOM', 'DOB']);
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            dataList.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });
        console.log(dataList);
        // console.log(dataList.length);
        if (dataList.length <= 1) {
            Swal.fire('Please select atleast one customer!');
            $('.close').click();
            return false;
        }
        let csvContent = "data:text/csv;charset=utf-8,"
            + dataList.map(e => e.join(",")).join("\n");

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        var name = getFileName();
        if (name != false) {
            link.setAttribute("download", name + ".csv");
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv".
            $('.close').click();
            return false;
        }
    }
    else if (checkunselectAllFlag) {
        var dataList = [];
        dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOM', 'DOB']);
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            // console.log("---->", row.cells[1].innerHTML);
            dataList.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });
        if (dataList.length <= 1) {
            Swal.fire('Please unselect atleast one customer!');
            $('.close').click();
            return false;
        }
        let csvContent = "data:text/csv;charset=utf-8,"
            + dataList.map(e => e.join(",")).join("\n");

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        var name = getFileName();
        if (name != false) {
            link.setAttribute("download", name + ".csv");
            document.body.appendChild(link);

            link.click();
            $('.close').click();
            return false;
        }
    }
}
// ########################################################################################################
// ######################    ALL CUSTOMER SELECTION   #####################################################
// ########################################################################################################
function SelectAll_Customer(txt) {
    var checked = $(txt).is(':checked');
    if (checked) {
        $('#sel_users input').each(function () {
            $(this).prop('checked', true);
        });
    } else {
        $('#sel_users input').each(function () {
            $(this).prop('checked', false);
        });
    }
}

// ########################################################################################################
// #######################   FILE NAME FOR DOWNLOADING CSV  ###############################################
// ########################################################################################################
function getFileName() {
    var name = prompt("Please enter file name:", "");
    if (name == null) {
        if (name == "") {
            txt = "User cancelled the prompt.";
            return false;
        }
    } else {
        txt = name;
        if (txt.length < 1) {
            alert('Enter file name');
            getFileName();
        }
    }
    return txt
}
// ####################################################################################################
// ###############################   TIER FILTER    ###################################################
// ####################################################################################################

function filterTier() {
    var flag = false;
    var flag2 = false;
    var flag3 = false;
    $("#tierMethod input[type=checkbox]:checked").each(function () {
        flag = true;
    });

    flag === true ? $('.removeSectionOnTierSelect').hide() : $('.removeSectionOnTierSelect').show();

    if (flag == true) {
    } else {
        Swal.fire('please select atleast 1 Tier method!');
        $('#tier1').prop('checked', false);
        $('#tier2').prop('checked', false);
        $('#tier3').prop('checked', false);

        return false;
    }
}

// ####################################################################################################
// ###############################   RESET CUSTOMER FILTER    #########################################
// ####################################################################################################

$('#stopDefaultAction').off('click').click(function (clickEvent) {
    clickEvent.stopPropagation();
    $("select[name='StorenameFilter']").val('');

    $('#collective').prop('checked', false);
    $('#individual').prop('checked', false);
    $('#tier1').prop('checked', false);
    $('#tier2').prop('checked', false);
    $('#tier3').prop('checked', false);

    $('.removeSectionOnTierSelect').show();

    $(".select2-selection__rendered").html("");
    $('input[name="dateFilter"]').val("");
    $(function () {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 500000,
            values: [0, 5000000],
            slide: function (event, ui) {
                $("#minval").val(ui.values[0]);
                $("#maxval").val(ui.values[1]);
                $("#amount").val("Rs." + ui.values[0] + " - Rs." + ui.values[1]);
            }
        });
        $("#minval").change(function () {
            $("#slider-range").slider('values', 0, $(this).val());
        });
        $("#maxval").change(function () {
            $("#slider-range").slider('values', 1, $(this).val());
        });
        $("#minval").val($("#slider-range").slider('values', 0));
        $("#maxval").val($("#slider-range").slider('values', 1));
        $("#amount").val("Rs." + $("#slider-range").slider("values", 0) +
            " - Rs." + $("#slider-range").slider("values", 1));
    });
});

// ########################################################################################################
// ##################################   CUSTOMERER MANAGEMENT FILTER  #####################################
// ########################################################################################################
function FilterCustomerManagement() {
    var storCategory = $("select[name='StorenameFilter']").val();
    var minval = $('#minval').val();
    var maxval = $('#maxval').val();

    var tierList = [];
    if (storCategory.length === 0) {
        Swal.fire('Please select store name');
        return false;
    }
    $.each($("input[name='tier']:checked"), function () {
        tierList.push($(this).val());
    });
    if (tierList.length === 0) {
        var Category = storCategory;
        var dateRangeFilter = $('input[name="dateFilter"]').val();
        if (dateRangeFilter.length === 0) {
            Swal.fire('Please Select Date Range');
            return false;
        }
        if (minval == "") {
            Swal.fire('Please Select Min Amount value');
            return false;
        }
        if (maxval == "") {
            Swal.fire('Please Select Max Amount value');
            return false;
        }
        var amountfilter = $('input[name="amount"]').val();
        console.log(typeof (dateRangeFilter));
        console.log(typeof (amountfilter));
        $.ajax({
            type: 'GET',
            url: "customerFilterApply",
            data: { 'cate': Category, 'date': dateRangeFilter, 'amt': amountfilter, "tierSelect": "NoTierSelect" },
            success: function (response) {
                $("#getTabledata").html("");
                $('#paginater').hide();
                $('#LoadMoreBtn').hide();
                if (response.length === 0) {
                    $("#getTabledata").html('<tr onclick="customer_detailed_info({{item.id}})">\
                    <td colspan="7" style="text-align:center;">No Data Found</td>\
                    </tr>');

                } else {
                    console.log(response);
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {
                        console.log("<<<<<<<<<<<<<<<<<<<<", value['CutomerName']);

                        if (value['CutomerName'] == "" & value['CutomerEMAIL'] == "" & value['CutomerDOB'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ 'Customer' + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ 'NA' + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ 'NA' + '</td>\
                        </tr>';
                        } else if (value['CutomerName'] == "" & value['CutomerEMAIL'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ 'Customer' + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ 'NA' + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ value['CutomerDOB'] + '</td>\
                        </tr>';
                        } else if (value['CutomerEMAIL'] == "" & value['CutomerDOB'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ value['CutomerName'] + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ 'NA' + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ 'NA' + '</td>\
                        </tr>';
                        } else if (value['CutomerName'] == "" & value['CutomerDOB'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ 'Customer' + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ value['CutomerEMAIL'] + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ 'NA' + '</td>\
                        </tr>';
                        } else {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ value['CutomerName'] + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ value['CutomerEMAIL'] + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ value['CutomerDOB'] + '</td>\
                        </tr>';
                        }
                    }
                    $("#getTabledata").html(html);
                }
            }
        })
    }
    else {
        var Category = storCategory;
        var tierType = $('input[name="tierType"]:checked').val();
        var ListTier = tierList
        console.log('These are tier filteration system data : ', Category, tierType, ListTier);
        $.ajax({
            type: 'GET',
            url: "customerFilterApply",
            data: { 'Category': Category, 'tierType': tierType, 'ListTier': ListTier, "tierSelect": "TierSelect" },
            success: function (response) {
                $('#LoadMoreBtn').hide();
                $("#getTabledata").html("");
                if (response.length === 0) {
                    $("#getTabledata").html('<tr>)">\
                    <td colspan="7" style="text-align:center;">No Data Found</td>\
                    </tr>');
                } else {
                    console.log(response);
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {
                        console.log(">>>>>>>>>>>>>>>>>>>", value['CutomerName']);
                        if (value['CutomerName'] == "" & value['CutomerEMAIL'] == "" & value['CutomerDOB'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ 'Customer' + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ 'NA' + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ 'NA' + '</td>\
                        </tr>';
                        } else if (value['CutomerName'] == "" & value['CutomerEMAIL'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ 'Customer' + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ 'NA' + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ value['CutomerDOB'] + '</td>\
                        </tr>';
                        } else if (value['CutomerEMAIL'] == "" & value['CutomerDOB'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ value['CutomerName'] + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ 'NA' + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ 'NA' + '</td>\
                        </tr>';
                        } else if (value['CutomerName'] == "" & value['CutomerDOB'] == "") {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ 'Customer' + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ value['CutomerEMAIL'] + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ 'NA' + '</td>\
                        </tr>';
                        } else {
                            html = html + '<tr onclick="customer_detailed_info(' + value['id'] + ')">\
                        <td><label id="sel_users"><input type="checkbox" name="" class="chckbx" /></label></td>\
                        <td id="rowName">'+ value['CutomerName'] + '</td>\
                        <td id="rowContact">'+ value['CutomerCONTACT'] + '</td>\
                        <td id="rowEmail">'+ value['CutomerEMAIL'] + '</td>\
                        <td id="rowGender">'+ value['CutomerGENDER'] + '</td>\
                        <td id="rowDom">'+ value['CutomerDOM'] + '</td>\
                        <td id="rowDob">'+ value['CutomerDOB'] + '</td>\
                        </tr>';
                        }
                    }
                    $("#getTabledata").html(html);
                }
            }
        })
    }
}
// ########################################################################################################
// ###########################   CUSTOMER DETAILED INFO.  #################################################
// ########################################################################################################
function customer_detailed_info(txt) {
    $('#tierInfoData').html("");
    var customer_id = parseInt(txt);
    $.ajax({
        type: 'GET',
        url: "customer_detailed_info",
        data: { id: customer_id },
        success: function (response) {
            console.log('customer deatiled info : ', response);
            // return false;

            $('.cust_tbl td:nth-child(2), .cust_tbl td:nth-child(3),.cust_tbl td:nth-child(3),.cust_tbl td:nth-child(4), .cust_tbl td:nth-child(5)').on('click', function () {
                $('#cust_det').modal('show');

            });
            // ------------------------------------------------------------------------
            if (response[0]['name'] == "" & response[0]['email'] == "" & response[0]['DOB'] == "") {
                $('#customer_info_name').val('Customer');
                $('#customer_info_contact').val(response[0]['contact']);
                $('#customer_info_email').val('NA');
                $('#customer_info_dob').val('NA');
                $('#customer_info_dom').val(response[0]['DOM']);
                $('#customer_info_gender').attr('checked', 'checked');
            } else if (response[0]['name'] == "" & response[0]['email'] == "") {
                $('#customer_info_name').val('Customer');
                $('#customer_info_contact').val(response[0]['contact']);
                $('#customer_info_email').val('NA');
                $('#customer_info_dob').val(response[0]['DOB']);
                $('#customer_info_dom').val(response[0]['DOM']);
                $('#customer_info_gender').attr('checked', 'checked');
            } else if (response[0]['email'] == "" & response[0]['DOB'] == "") {
                $('#customer_info_name').val(response[0]['name']);
                $('#customer_info_contact').val(response[0]['contact']);
                $('#customer_info_email').val('NA');
                $('#customer_info_dob').val('NA');
                $('#customer_info_dom').val(response[0]['DOM']);
                $('#customer_info_gender').attr('checked', 'checked');
            } else if (response[0]['name'] == "" & response[0]['DOB'] == "") {
                $('#customer_info_name').val('Customer');
                $('#customer_info_contact').val(response[0]['contact']);
                $('#customer_info_email').val(response[0]['email']);
                $('#customer_info_dob').val('NA');
                $('#customer_info_dom').val(response[0]['DOM']);
                $('#customer_info_gender').attr('checked', 'checked');
            } else {
                $('#customer_info_name').val(response[0]['name']);
                $('#customer_info_contact').val(response[0]['contact']);
                $('#customer_info_email').val(response[0]['email']);
                $('#customer_info_dob').val(response[0]['DOB']);
                $('#customer_info_dom').val(response[0]['DOM']);
                $('#customer_info_gender').attr('checked', 'checked');
            }
            // ------------------------------------------------------------------------
            if (response[5].length == 0 && response[6].length == 0 && response[7].length == 0) {
                for (var i = 0; i < response[1].length; i++) {
                    var tierDet = response[3][i] == "NA" ? "NA" : "Tier-" + response[3][i];
                    $('#tierInfoData').append("<tr>\
                        <td><b>"+ response[1][i] + "</b></td>\
                         <td>"+ response[2][i]['storeID'] + "</td>\
                        <td>"+ response[2][i]['amount'] + "</td>\
                        <td>"+ tierDet + "</td>\
                        </tr>");
                }
            } else {
                for (var i = 0; i < response[1].length; i++) {
                    var tierDet = response[3][i] == "NA" ? "NA" : "Tier-" + response[3][i];
                    $('#tierInfoData').append("<tr>\
                        <td><b>"+ response[1][i] + "</b></td>\
                         <td>"+ response[2][i]['storeID'] + "</td>\
                        <td>"+ response[2][i]['amount'] + "</td>\
                        <td>"+ tierDet + "</td>\
                        </tr>");
                }

                for (var i = 0; i < response[5].length; i++) {
                    var tierDet = response[7][i] == "NA" ? "NA" : "Tier-" + response[7][i];
                    $('#tierInfoData').append("<tr>\
                        <td><b>"+ response[5][i] + "</b><small><strong>&nbsp;- (Onboard Entry Customer)</strong></small></td>\
                         <td>"+ response[6][i]['storeID'] + "</td>\
                        <td>"+ response[6][i]['amount'] + "</td>\
                        <td>"+ tierDet + "</td>\
                        </tr>");
                }
            }
            // --------------------------------------------------------------------------
        }
    });
}
// ########################################################################################################
// ##########################    TIER SELECTION AND HIDING RANGE BAR   ####################################
// ########################################################################################################
function collectiveClick() {
    flag = false;
    flag2 = false;
    flag3 = false;

    $("#tierMethod input[id=collective]:checked").each(function () {
        flag = true;

    });
    $("#tierMethod input[id=individual]:checked").each(function () {
        flag2 = true;

    });
    $("#tierMethod input[id=onboard]:checked").each(function () {
        flag3 = true;

    });
    if (flag == true) {
        $('#individual').prop('checked', false);
        $('#onboard').prop('checked', false);
        $('#collective').prop('checked', true);

    } else {
        $('#individual').prop('checked', false);
        $('#onboard').prop('checked', false);
        $('#collective').prop('checked', false);
        flag = false;
    }
    flag === true ? $('.removeSectionOnTierSelect').hide() : $('.removeSectionOnTierSelect').show();
    flag === true ? $('#collective').attr('checked', '') : $('#collective').attr('checked', 'checked');
    flag === true ? $('#onboard').attr('checked', '') : $('#onboard').attr('checked', 'checked');
    flag === true ? $('#tier1').attr('checked', 'checked') : $('#tier1').attr('checked', 'checked');
    if (flag == true) {
        $('#tier1').prop('checked', true);
    } else {
        $('#tier1').prop('checked', false);
        $('#tier2').prop('checked', false);
        $('#tier3').prop('checked', false);
    }

}

function individualClick() {
    flag = false;
    flag2 = false;
    flag3 = false;
    $("#tierMethod input[id=collective]:checked").each(function () {
        flag = true;
    });
    $("#tierMethod input[id=individual]:checked").each(function () {
        flag2 = true;
    });
    $("#tierMethod input[id=onboard]:checked").each(function () {
        flag3 = true;

    });
    if (flag2 == true) {
        $('#individual').prop('checked', true);
        $('#onboard').prop('checked', false);
        $('#collective').prop('checked', false);
    } else {
        $('#individual').prop('checked', false);
        $('#collective').prop('checked', false);
        $('#onboard').prop('checked', false);
        flag2 = false;
    }
    flag2 === true ? $('.removeSectionOnTierSelect').hide() : $('.removeSectionOnTierSelect').show();
    flag2 === true ? $('#individual').attr('checked', '') : $('#individual').attr('checked', 'checked');
    flag2 === true ? $('#onboard').attr('checked', '') : $('#onboard').attr('checked', 'checked');
    flag2 === true ? $('#tier1').attr('checked', 'checked') : $('#tier1').attr('checked', 'checked');

    if (flag2 == true) {
        $('#tier1').prop('checked', true);
    } else {
        $('#tier1').prop('checked', false);
        $('#tier2').prop('checked', false);
        $('#tier3').prop('checked', false);
    }
}



function onboardClick() {
    flag = false;
    flag2 = false;
    flag3 = false;

    $("#tierMethod input[id=collective]:checked").each(function () {
        flag = true;
    });
    $("#tierMethod input[id=individual]:checked").each(function () {
        flag2 = true;
    });
    $("#tierMethod input[id=onboard]:checked").each(function () {
        flag3 = true;

    });
    if (flag3 == true) {
        $('#onboard').prop('checked', true);
        $('#individual').prop('checked', false);
        $('#collective').prop('checked', false);
    } else {
        $('#onboard').prop('checked', false);
        $('#individual').prop('checked', false);
        $('#collective').prop('checked', false);
        flag3 = false;
    }
    flag3 === true ? $('.removeSectionOnTierSelect').hide() : $('.removeSectionOnTierSelect').show();
    flag3 === true ? $('#individual').attr('checked', '') : $('#individual').attr('checked', 'checked');
    flag3 === true ? $('#onboard').attr('checked', '') : $('#onboard').attr('checked', 'checked');
    flag3 === true ? $('#tier1').attr('checked', 'checked') : $('#tier1').attr('checked', 'checked');

    if (flag3 == true) {
        $('#tier1').prop('checked', true);
    } else {
        $('#tier1').prop('checked', false);
        $('#tier2').prop('checked', false);
        $('#tier3').prop('checked', false);
    }
}


//###################################################################################################################
//###################################################################################################################
//####################################     Email && SMS Module          #############################################
//###################################################################################################################
//###################################################################################################################



function campeignNameEmail() {
    $.ajax({
        type: 'GET',
        url: "campeignNameEmail",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                $('select[name="emailCampaignName"]').append('<option value="' + response[i] + '">' + response[i] + '</option>');
            }
        }
    });
}



function campeignNameSms() {
    $.ajax({
        type: 'GET',
        url: "campeignNameSms",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                $('select[name="smsCampaignName"]').append('<option value="' + response[i] + '">' + response[i] + '</option>');
            }
        }
    });
}

function sleep(milisec) {
    const date = Date.now();
    let current = null;
    do {
        current = Date.now();
    } while (current - date < milisec);
}


function sendEmailtoCustomer() {
    var checkAllCustFlag = $('#Allcustmail').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcustmail').is(':checked');
    var checkunselectAllFlag = $('#unselectAllmail').is(':checked');
    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomers",
            success: function (response) {
                console.log('To Checking .....', response);
                var dataList = ''
                $('#cutomerPannel').hide();
                for (var dt = 1; dt < response.length; dt++) {
                    if (dataList != '') {
                        dataList = dataList + "|" + response[dt];
                    } else {
                        dataList = response[dt]
                    }
                    if (response[dt][2] != '') {
                        $('#emailBind').append("<span>" + response[dt][2] + "<a  href='javascript:;'></a></span>");
                    }
                }
                // ---------------------------------------------------------------------------------------------------------------
                localStorage.setItem('DataListForEmail', dataList)
                // ---------------------------------------------------------------------------------------------------------------
                $('#emailModule').show();
                campeignNameEmail();

            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });

        if (datalist.length === 0) {
            Swal.fire('Please select atleast one customer!')
            return false;
        }
        var dataList = ''
        $('#cutomerPannel').hide();
        for (var dt = 0; dt < datalist.length; dt++) {
            if (dataList != '') {
                dataList = dataList + "|" + datalist[dt];
            } else {
                dataList = datalist[dt]
            }
            if (datalist[dt][2] == "NA") {
                if (datalist.length == 1) {
                    alert('No email associated with this customer! Choose another customer.')

                    window.location.href = "/customer_management";
                }
            } else {
                $('#emailBind').append("<span>" + datalist[dt][2] + "</span>");
            }
        }
        // ---------------------------------------------------------------------------------------------------------------
        localStorage.setItem('DataListForEmail', dataList)
        // ---------------------------------------------------------------------------------------------------------------
        $('#emailModule').show();
        campeignNameEmail();

    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });

        if (datalist.length === 0) {
            Swal.fire('Please unselect at least one customer!')
            return false;
        }
        var dataList = ''
        $('#cutomerPannel').hide();
        for (var dt = 0; dt < datalist.length; dt++) {
            if (dataList != '') {
                dataList = dataList + "|" + datalist[dt];
            } else {
                dataList = datalist[dt]
            } if (datalist[dt][2] == "NA") {
                if (datalist.length == 1) {
                    alert('No email associated with this customer! Choose another customer.')

                    window.location.href = "/customer_management";
                }
            } else {
                $('#emailBind').append("<span>" + datalist[dt][2] + "</span>");
            }
        }
        // ---------------------------------------------------------------------------------------------------------------
        localStorage.setItem('DataListForEmail', dataList)
        // ---------------------------------------------------------------------------------------------------------------
        $('#emailModule').show();
        campeignNameEmail();


    }
}

function getdynamictextEmail(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("emailText").selectionStart;
    let x = $("#emailText").val();
    let text_to_insert = dynamicText;
    $("#emailText").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}


String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};


function perviewMail() {
    var getDataList = localStorage.getItem('DataListForEmail');
    console.log('>>>>>>>>>>>>', getDataList);
    var list_data = getDataList.split('|');
    console.log('!!!!!!!!!!!!!', list_data);
    var mail_sub = $('#mailSubject').val();
    var regx = /^[A-Za-z]+[A-Za-z & ' '-_]+$/;
    if (mail_sub.length > 0) {
        if (mail_sub.match(regx)) {
            document.getElementById('mailSubject').style.border = '';
        } else {
            Swal.fire('Enter a valid email subject');
            return false;
        }
    }
    else {
        Swal.fire('Please enter Email subject!');
        return false;

    }
    var listDatat = [];
    var completeEmail = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#emailText").val();
    console.log("Mail Text====>", mailText);
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeEmail.push(addDynTxt)
    }

    for (var di = 0; di < completeEmail.length; di++) {
        $('#final_mail_Preview').append('<div class="card-header">\
                        <h3 class="card-title">\
                            <strong>To:</strong>'+ listDatat[di][2] + ' \
                        </h3>\
                  </div>\
                <div class="card-body pt-3 pb-0">\
                  <div class="row">\
                    <div class="col-lg-12">\
                      <div class="sms_text">\
                     '+ completeEmail[di] + '\
                      </div>\
                       </div>\
                       </div>\
                       </div>');
        $('#emailModule').hide();
        $('#mailPreview').show()
    }
}



function sendAllEMail() {
    var completeEmail = [];
    const csrftoken = getCookie('csrftoken');
    var getDataList = localStorage.getItem('DataListForEmail');
    var listDatat = [];
    var mailList = [];
    var list_data = getDataList.split('|');
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#emailText").val();

    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeEmail.push(addDynTxt)
    }

    for (var pre = 0; pre < listDatat.length; pre++) {
        mailList.push(listDatat[pre][2])
    }

    var mailSubject = $('input[name="mailSubject"]').val();
    let mail_syntax_Text = $("#emailText").val();

    swal.fire({
        title: 'Are you Sure ?',
        confirmButtonText: 'Send Email',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'some-class',
        cancelButtonClass: 'some-other-class',
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            $('.loaders').show();

            $.ajax({
                type: 'POST',
                url: "SendEmailToCustomer",
                headers: { 'X-CSRFToken': csrftoken },
                data: { AllEmail: mailList, completeEMAIL: completeEmail, mailSubject: mailSubject, EMAILText: mail_syntax_Text },
                success: function (response) {
                    console.log(typeof (response), response);
                    $('.loaders').hide();
                    console.log('finish');
                    swal.fire("DONE!", "Emails Sent Successfully.", "success").then(function () {
                        // window.location.href = "http://project-x.herokuapp.com/customer_management";
                        window.location.href = "/customer_management";

                    })

                }
            });
        } else {
            console.log('Cancel')
        }
    })


}



// ################################################################################################################
// ###################################     SMS MODULE JS    #######################################################
// ################################################################################################################


function selectEmailCampaignName(thistxt) {
    console.log(thistxt);
    var campaignName = $(thistxt).val();
    $('input[name="mailSubject"]').val("");
    $('#emailText').html("");
    if (campaignName != 'none') {
        $.ajax({
            type: 'GET',
            url: "selectEmailCampaignName",
            data: { campaignName: campaignName.trim() },
            success: function (response) {
                console.log(response);
                $('input[name="mailSubject"]').val(campaignName);
                if (response.length > 0) {
                    $('#emailText').html(response[0]);
                } else {
                    $('#emailText').html('NA');
                }
                // for (var i = 0; i < response.length; i++) {
                //     $('input[name="mailSubject"]').val(response[i][0]);
                //     $('#emailText').html(response[i][1]);
                // }
            }
        });
    }

}



function selectSmsCampaignName(thistxt) {
    var campaignName = $(thistxt).val();
    console.log(campaignName);
    $('input[name="smsSubject"]').val("");
    $('#smsText').html("");
    if (campaignName != 'none') {
        $.ajax({
            type: 'GET',
            url: "selectSmsCampaignName",
            data: { campaignName: campaignName.trim() },
            success: function (response) {
                console.log(response);
                $('input[name="smsSubject"]').val(campaignName);
                if (response.length > 0) {
                    $('#smsText').html(response[0]);
                } else {
                    $('#smsText').html('NA');
                }
                // for (var i = 0; i < response.length; i++) {
                //     $('input[name="smsSubject"]').val(response[i][0]);
                //     $('#smsText').html(response[i][1]);
                // }
            }
        });
    }

}


function sendSmstoCustomer() {
    var checkAllCustFlag = $('#Allcustsms').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcustsms').is(':checked');
    var checkunselectAllFlag = $('#unselectAllsms').is(':checked');


    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomers",
            success: function (response) {
                console.log('To Checking .....', response);
                var dataList = '';
                $('#cutomerPannel').hide();
                for (var dt = 1; dt < response.length; dt++) {
                    if (dataList != '') {
                        dataList = dataList + "|" + response[dt];
                    } else {
                        dataList = response[dt]
                    }

                    if (response[dt][1] != '') {
                        $('#mobNO_Bind').append("<span>" + response[dt][1] + "</span>");
                    }
                }
                localStorage.setItem('DataListForSMS', dataList)
                $('#smsModule').show();
                campeignNameSms();

            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });
        var dataList = '';
        if (datalist.length === 0) {
            Swal.fire('Please Select At Least One Customer');
            return false;
        }
        $('#cutomerPannel').hide();
        for (var dt = 0; dt < datalist.length; dt++) {
            if (dataList != '') {
                dataList = dataList + "|" + datalist[dt];
            } else {
                dataList = datalist[dt]
            }
            $('#mobNO_Bind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListForSMS', dataList)
        $('#smsModule').show();
        campeignNameSms();


        console.log(dataList);

    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire('Please UnSelect At Least One Customer');
            return false;
        }
        var dataList = '';
        $('#cutomerPannel').hide();
        for (var dt = 0; dt < datalist.length; dt++) {
            if (dataList != '') {
                dataList = dataList + "|" + datalist[dt];
            } else {
                dataList = datalist[dt]
            }
            $('#mobNO_Bind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListForSMS', dataList)
        $('#smsModule').show();
        campeignNameSms();


    }

}



function getdynamictextSMS(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("smsText").selectionStart;
    let x = $("#smsText").val();
    let text_to_insert = dynamicText;
    $("#smsText").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}



function perviewSMS() {
    var smsSubjectData = $('#smsSubject').val();
    var regx = /^[A-Za-z]+[A-Za-z & ' '-_]+$/;
    if (smsSubjectData.length > 0) {
        if (smsSubjectData.match(regx)) {
            document.getElementById('smsSubject').style.border = '';
        } else {
            Swal.fire('Enter a valid sms subject\n\n*SMS subject must contain only alphabets!')
            return false;
        }
    }
    else {
        Swal.fire('Please enter SMS subject!');
        return false;

    }
    var getDataList = localStorage.getItem('DataListForSMS');
    var list_data = getDataList.split('|');
    var listDatat = [];
    var completeEmail = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#smsText").val();

    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeEmail.push(addDynTxt)
    }

    for (var di = 0; di < completeEmail.length; di++) {
        $('#final_sms_Preview').append('<div class="card-header">\
                        <h3 class="card-title">\
                            <strong>To:</strong>'+ listDatat[di][1] + ' \
                        </h3>\
                  </div>\
                <div class="card-body pt-3 pb-0">\
                  <div class="row">\
                    <div class="col-lg-12">\
                      <div class="sms_text">\
                     '+ completeEmail[di] + '\
                      </div>\
                       </div>\
                       </div>\
                       </div>');

        $('#smsModule').hide();
        $('#smsPreview').show()
    }

    localStorage.setItem('smsSyntax', mailText);
}



function sendAllSMS() {
    var completeSMS = [];
    var getDataList = localStorage.getItem('DataListForSMS');
    var listDatat = [];
    var smsList = [];
    var list_data = getDataList.split('|');
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#smsText").val();

    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeSMS.push(addDynTxt)
    }

    for (var pre = 0; pre < listDatat.length; pre++) {
        smsList.push(listDatat[pre][1])
    }

    var smsSubject = $('input[name="smsSubject"]').val();
    var smstext = localStorage.getItem('smsSyntax');

    swal.fire({
        title: 'Are you Sure ?',
        confirmButtonText: 'Send SMS',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'some-class',
        cancelButtonClass: 'some-other-class',
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            $('.loaders').show();

            const csrftoken = getCookie('csrftoken');
            $.ajax({
                type: 'POST',
                url: "SendSMSToCustomer",
                headers: { 'X-CSRFToken': csrftoken },
                data: { All_Mob_No: smsList, completeSms: completeSMS, smsSub: smsSubject, smsText: smstext },
                success: function (response) {
                    console.log(response);
                    $('.loaders').hide();
                    swal.fire("DONE!", "SMS Sent Successfully.", "success").then(function () {
                        // window.location.href = "http://project-x.herokuapp.com/customer_management";
                        window.location.href = "/customer_management";

                    })

                }
            });
        }
    });
}
function backToCustomerManagement() {
    $('#smsModule').hide();
    $('#emailModule').hide();
    $('#cutomerPannel').show();
    $('#emailBind').html("");
    $('#mobNO_Bind').html("");

}


// ######################################################################################################################
// ##################################   Broadcast & Delivery Campaign  ##################################################
// ######################################################################################################################


function getdynamictextCampaignEmail(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("send_email_campaign_text").selectionStart;
    let x = $("#send_email_campaign_text").val();
    let text_to_insert = dynamicText;
    $("#send_email_campaign_text").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}



function getdynamictextCampaignsms(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("send_sms_campaign_text").selectionStart;
    let x = $("#send_sms_campaign_text").val();
    let text_to_insert = dynamicText;
    $("#send_sms_campaign_text").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}


function SelectAll_CustomerCamp(txt) {
    var checked = $(txt).is(':checked');
    if (checked) {
        $('#sel_usersCamp input').each(function () {
            $(this).prop('checked', true);
        });
    } else {
        $('#sel_usersCamp input').each(function () {
            $(this).prop('checked', false);
        });
    }
}


function SelectAll_CustomerCampSms(txt) {
    var checked = $(txt).is(':checked');
    if (checked) {
        $('#sel_usersCampsms input').each(function () {
            $(this).prop('checked', true);
        });
    } else {
        $('#sel_usersCampsms input').each(function () {
            $(this).prop('checked', false);
        });
    }
}



function SelectAll_CustomerCampnewEMAIL(txt) {
    var checked = $(txt).is(':checked');
    if (checked) {
        $('#sel_usersCampEMAIL input').each(function () {
            $(this).prop('checked', true);
        });
    } else {
        $('#sel_usersCampEMAIL input').each(function () {
            $(this).prop('checked', false);
        });
    }
}



function CampaignsendEmailtoCustomer() {
    var checkAllCustFlag = $('#Allcustmailcamp').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcustmailcamp').is(':checked');
    var checkunselectAllFlag = $('#unselectAllmailcamp').is(':checked');

    $('#CampaignCustomerData').hide();
    $('#sendcampaignEmail').show();
    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomersemailCamp",
            success: function (response) {
                console.log('To Checking .....', response);
                var dataList = ''
                $('#cutomerPannel').hide();
                for (var dt = 0; dt < response.length; dt++) {
                    if (dataList != '') {
                        dataList = dataList + "|" + response[dt];
                    } else {
                        dataList = response[dt]
                    }
                    $('#emailBind').append("<span>" + response[dt][2] + "</span>");
                }
                localStorage.setItem('DataListForEmail', dataList)
                $('#emailModule').show();

                campeignNameEmail();

            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });

        if (datalist.length === 0) {
            Swal.fire('Please Select At Least One Cutomer');
            return false;
        }
        var dataList = ''
        $('#cutomerPannel').hide();
        for (var dt = 0; dt < datalist.length; dt++) {
            if (dataList != '') {
                dataList = dataList + "|" + datalist[dt];
            } else {
                dataList = datalist[dt]
            }
            $('#emailBind').append("<span>" + datalist[dt][2] + "</span>");
        }
        localStorage.setItem('DataListForEmail', dataList)
        $('#emailModule').show();
        campeignNameEmail();

    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });

        if (datalist.length === 0) {
            Swal.fire('Please UnSelect At Least One Cutomer');
            return false;
        }
        var dataList = ''
        $('#cutomerPannel').hide();
        for (var dt = 0; dt < datalist.length; dt++) {
            if (dataList != '') {
                dataList = dataList + "|" + datalist[dt];
            } else {
                dataList = datalist[dt]
            }
            $('#emailBind').append("<span>" + datalist[dt][2] + "</span>");
        }
        localStorage.setItem('DataListForEmail', dataList)
        $('#emailModule').show();
        campeignNameEmail();


    }
}

// #####################################################################################################################
// ################################     PAGINATION USING AJAX   ########################################################
// #####################################################################################################################
function previousPage(txt) {
    alert(txt);
}


function nextPage(txt) {
    alert(txt);
    $.ajax({
        type: 'GET',
        url: 'ajaxCustomer_management',
        data: { 'page': txt },
        success: function (response) {
            console.log(response);
            console.log(typeof (response));

        }
    })
}
// #####################################################################################################################
function func1() {
    var a = $("#data-select2-id").val();
    console.log(a);
}

// #####################################################################################################################
// ################################     SCHEDULING TASK USING SCHEDULER   ##############################################
// #####################################################################################################################
function emailschedule() {
    var date = $('#kt_datepicker_1_modal').val();
    var time = $('#kt_timepicker_1_modal').val();
    // var msg = $('#kt_timepicker_1_modal').val();
    // var EmailSubject = $('input[name="mailSubject"]').val();
    // var emailText = $("#emailText").val();



    // console.log("date : ", date, "time : ", time, "EmailSubject : ", EmailSubject, "emailText : ", emailText);
    // var emaildata = localStorage.getItem('DataListForEmail')
    // console.log("this is the email list of selected customers...... : ", emaildata);
    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        url: 'scheduleCustEmail',
        data: { 'date': date, 'time': time },
        success: function (response) {
            console.log(response);
        }
    })
}

// #########################################################################################################
// #########################################################################################################
function perviewScheduleMail() {
    var getDataList = localStorage.getItem('DataListForEmail');
    console.log('---------->', getDataList);
    var list_data = getDataList.split('|');
    console.log('========>', list_data);
    var mail_sub = $('#mailSubject').val();
    var regx = /^[A-Za-z]+[A-Za-z & ' '-_]+$/;
    if (mail_sub.length > 0) {
        if (mail_sub.match(regx)) {
            document.getElementById('mailSubject').style.border = '';
        } else {
            Swal.fire('Enter a valid email subject');
            return false;
        }
    }
    else {
        Swal.fire('Please enter Email subject!');
        return false;

    }
    var listDatat = [];
    var completeEmail = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#emailText").val();
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeEmail.push(addDynTxt)
    }
    console.log('>>>>>>>>>>>', completeEmail);
    $.ajax({
        type: 'GET',
        url: "formatScheduleEmailText",
        data: { "completeEmail": completeEmail, 'list_data': list_data },
        success: function (response) {
            console.log(response);
            if (response == 'True') {
            } else {
                return false;
            }
        }
    });
}
// #########################################################################################################
function Smsschedule() {
    var date = $('#kt_datepicker_2_modal').val();
    var time = $('#kt_timepicker_1_modal').val();
    // var msg = $('#kt_timepicker_1_modal').val();
    // var EmailSubject = $('input[name="mailSubject"]').val();
    // var emailText = $("#emailText").val();



    // console.log("date : ", date, "time : ", time, "EmailSubject : ", EmailSubject, "emailText : ", emailText);
    // var emaildata = localStorage.getItem('DataListForEmail')
    // console.log("this is the email list of selected customers...... : ", emaildata);
    const csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        url: 'scheduleCustSMS',
        data: { 'date': date, 'time': time },
        success: function (response) {
            console.log(response);
        }
    })
}




function perviewScheduleSMS() {
    var smsSubjectData = $('#smsSubject').val();
    var regx = /^[A-Za-z]+[A-Za-z & ' '-_]+$/;
    if (smsSubjectData.length > 0) {
        if (smsSubjectData.match(regx)) {
            document.getElementById('smsSubject').style.border = '';
        } else {
            Swal.fire('Enter a valid sms subject\n\n*SMS subject must contain only alphabets!')
            return false;
        }
    }
    else {
        Swal.fire('Please enter SMS subject!');
        return false;

    }
    var getDataList = localStorage.getItem('DataListForSMS');
    var list_data = getDataList.split('|');
    var listDatat = [];
    var completeSMS = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#smsText").val();

    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeSMS.push(addDynTxt)
    }
    $.ajax({
        type: 'GET',
        url: "formatScheduleSMSText",
        data: { "completeSMS": completeSMS, 'list_data': list_data },
        success: function (response) {
            console.log(response);
            if (response == 'True') {
            } else {
                return false;
            }
        }
    });


}

// =============================================================================================
// ++++++++++++++++++++++++    EXPORT EXCEL FILE    ++++++++++++++++++++++++++++++++++++++++++++


function exportExcelData(thisKeyWord) {
    var checkAllCustexcelFlag = $('#Allexcelcust').is(':checked');
    var checkselectAllcustFlag = $('#selectAllexcelcust').is(':checked');
    var checkunselectAllFlag = $('#unselectexcelAll').is(':checked');

    if (checkAllCustexcelFlag) {

        $.ajax({
            type: 'GET',
            url: "allCsvCustomers",
            success: function (response) {
                var dataList = response;
                const items = dataList
                const i = 0
                const filteredItems = items.slice(0, i).concat(items.slice(i + 1, items.length))
                var $btnDLtoExcel = $('#DLtoExcel');
                $("#dvjson").excelexportjs({
                    containerid: "dvjson"
                    , datatype: 'json'
                    , dataset: filteredItems
                    , columns: getColumns(dataList)
                });
                $('.close').click();
                return false;
            }
        });
    }
    else if (checkselectAllcustFlag) {
        var dataList = [];
        dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOM', 'DOB']);
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            dataList.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });
        if (dataList.length <= 1) {
            Swal.fire('Please select atleast one customer!');
            $('.close').click();
            return false;
        }
        const items = dataList
        const i = 0
        const filteredItems = items.slice(0, i).concat(items.slice(i + 1, items.length))
        var $btnDLtoExcel = $('#DLtoExcel');
        $("#dvjson").excelexportjs({
            containerid: "dvjson"
            , datatype: 'json'
            , dataset: filteredItems
            , columns: getColumns(dataList)
        });
        $('.close').click();
        return false;
    }
    else if (checkunselectAllFlag) {
        var dataList = [];
        dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOM', 'DOB']);
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            // console.log("---->", row.cells[1].innerHTML);
            dataList.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML, row.cells[7].innerHTML]);
        });
        if (dataList.length <= 1) {
            Swal.fire('Please unselect atleast one customer!');
            $('.close').click();
            return false;
        }

        const items = dataList
        const i = 0
        const filteredItems = items.slice(0, i).concat(items.slice(i + 1, items.length))
        var $btnDLtoExcel = $('#DLtoExcel');
        $("#dvjson").excelexportjs({
            containerid: "dvjson"
            , datatype: 'json'
            , dataset: filteredItems
            , columns: getColumns(dataList)
        });
        $('.close').click();
        return false;
    }
}
// =============================================================================================