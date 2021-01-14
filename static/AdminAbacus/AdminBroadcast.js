$('#smsSearch').on('keyup', function () {
    var value = $(this).val();
    console.log(value);

    $('table tr').each(function (records) {
        if (records !== 0) {
            var id = $(this).find('td').text();
            if (id.indexOf(value) !== 0 && id.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    })
})
// #########################################################################################################################
$('#emailSearch').on('keyup', function () {
    var value = $(this).val();
    console.log(value);

    $('table tr').each(function (records) {
        if (records !== 0) {
            var id = $(this).find('td').text();
            if (id.indexOf(value) !== 0 && id.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    })
})
// #########################################################################################################################
function send_email_campaign(thistxt) {
    var s = $(thistxt).text();
    $.ajax({
        type: 'GET',
        url: "check_email_campaign",
        data: { s: s },
        success: function (response) {
            console.log(response);
            if (response) {
                console.log(response[0]);
                $('#campaignDetails').hide();
                $('#cap_text').show();
                $('#send_email_campaign_text').html(response[0]);
            }
            else {
                alert('There is no Campaign associated with this Master Campaign!');
                // Swal.fire('There is no Campaign associated with this Master Campaign!');
            }
        }
    });
}
// #########################################################################################################################
function broad_send_email_campaign(thistxt) {
    var s = $(thistxt).text();
    $.ajax({
        type: 'GET',
        url: "check_email_campaign",
        data: { s: s },
        success: function (response) {
            if (response) {
                console.log(response[0]);
                $('#campaignDetails').hide();
                $('#cap_text').show();
                $('#broad_send_email_campaign_text').html(response[0]);
            }
            else {
                alert('There is no Campaign associated with this Master Campaign!');
                // Swal.fire('There is no Campaign associated with this Master Campaign!');
            }
        }
    });
}
// #########################################################################################################################
function send_sms_campaign(thistxt) {
    var s = $(thistxt).text();
    console.log(s);

    $.ajax({
        type: 'GET',
        url: "check_sms_campaign",
        data: { s: s },
        success: function (response) {
            console.log(response);
            if (response) {
                console.log(response[0]);
                $('#smsCampDetails').hide();
                $('#SmsCamptext').show();
                $('#send_sms_campaign_text').html(response[0]);
            } else {
                alert('There is no Campaign associated with this Master Campaign!');
                // Swal.fire('There is no Campaign associated with this Master Campaign!');
            }
        }
    });
}
// #########################################################################################################################
function broad_send_sms_campaign(thistxt) {
    var s = $(thistxt).text();
    $.ajax({
        type: 'GET',
        url: "check_email_campaign",
        data: { s: s },
        success: function (response) {
            if (response) {
                console.log(response[0]);
                $('#campaignDetails').hide();
                $('#cap_text').show();
                $('#broad_send_email_campaign_text').html(response[0]);
            }
            else {
                alert('There is no Campaign associated with this Master Campaign!');
                // Swal.fire('There is no Campaign associated with this Master Campaign!');
            }
        }
    });
}
// #########################################################################################################################
function removeEmailReadOnly() {
    var rBtnVal = $('#broad_send_email_campaign_text').is('[readonly]')
    if (rBtnVal == true) {
        $("#broad_send_email_campaign_text").attr("readonly", false);
        $('#editContent').html("Disable Edit Content");
    }
    else {
        $("#broad_send_email_campaign_text").attr("readonly", true);
        $('#editContent').html("Edit Content");
    }
}
// #########################################################################################################################
function removeSmsReadOnly() {
    var rBtnVal = $('#send_sms_campaign_text').is('[readonly]')
    if (rBtnVal == true) {
        $("#send_sms_campaign_text").attr("readonly", false);
        $('#editsmsContent').html("Disable Edit Content");
    }
    else {
        $("#send_sms_campaign_text").attr("readonly", true);
        $('#editsmsContent').html("Edit Content");
    }
}
// #########################################################################################################################
function selectSmsCampaignCustomer() {
    let mailText = $("#send_sms_campaign_text").val();
    localStorage.setItem('broadSmstext', mailText);
    $('#CampaignCustomerSMSData').hide();
    $('#CampaignCustomerSMSData').show();
    $('#sendcampaignSms').hide();
    $('#SmsCamptext').hide();

}
// #########################################################################################################################
function selectEmialCampaignCustomer() {
    let mailText = $("#broad_send_email_campaign_text").val();
    localStorage.setItem('broadEmailtext', mailText);
    $('#CampaignCustomerData').hide();
    $('#CampaignCustomerData').show();
    $('#sendcampaignEmail').hide();
    $('#cap_text').hide();

}
// #########################################################################################################################
function getdynamictextCampaignEmail(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("broad_send_email_campaign_text").selectionStart;
    let x = $("#broad_send_email_campaign_text").val();
    let text_to_insert = dynamicText;
    $("#broad_send_email_campaign_text").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}
// #########################################################################################################################
function getdynamictextCampaignsms(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("send_sms_campaign_text").selectionStart;
    let x = $("#send_sms_campaign_text").val();
    let text_to_insert = dynamicText;
    $("#send_sms_campaign_text").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}
// #########################################################################################################################
function CampaignFilterCustomerManagement() {
    var storCategory = $("select[name='StorenameFilter']").val();
    var tierList = [];
    if (storCategory.length === 0) {
        Swal.fire("Please Select Store Name");
        return false;
    }
    $.each($("input[name='tier']:checked"), function () {
        tierList.push($(this).val());
    });
    if (tierList.length === 0) {
        var Category = storCategory;
        var dateRangeFilter = $('input[name="dateFilter"]').val();
        if (dateRangeFilter.length === 0) {
            Swal.fire("Please Select Date Range");
            return false;
        }
        var amountfilter = $('input[name="amount"]').val();
        $.ajax({
            type: 'GET',
            url: "campaignEmailFilterApply",
            data: { 'cate': Category, 'date': dateRangeFilter, 'amt': amountfilter, "tierSelect": "NoTierSelect" },
            success: function (response) {
                $('#loadmoreemailcampaignBtn').hide();
                $("#getTabledata").html("");
                console.log(response);
                $('#paginater').hide();
                if (response.length === 0) {
                    $("#getTabledata").show();
                    $("#getTabledata").html('<tr onclick="customer_detailed_info({{item.id}})">\
                          <td colspan="7" style="text-align:center;">No Data Found</td>\
                        </tr>');

                } else {
                    console.log(response);;
                    $("#getTabledata").show();
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {
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
        $.ajax({
            type: 'GET',
            url: "campaignEmailFilterApply",
            data: { 'Category': Category, 'tierType': tierType, 'ListTier': ListTier, "tierSelect": "TierSelect" },
            success: function (response) {
                $('#loadmoreemailcampaignBtn').hide();
                $("#getTabledata").html("");
                if (response.length === 0) {
                    $("#getTabledata").show();
                    $("#getTabledata").html('<tr>)">\
                          <td colspan="7" style="text-align:center;">No Data Found</td>\
                        </tr>');
                } else {
                    console.log(response);
                    $("#getTabledata").show();
                    $('#loadmoresmscampaignBtn').hide();
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {
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
// #########################################################################################################################
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
                for (var dt = 1; dt < response.length; dt++) {
                    if (dataList != '') {
                        dataList = dataList + "|" + response[dt];
                    } else {
                        dataList = response[dt]
                    }
                    $('#emailBind').append("<span>" + response[dt][1] + "<a  href='javascript:;'></a></span>");
                }
                localStorage.setItem('DataListForEmail', dataList)
                $('#emailModule').show();
                perviewEmailCamp();
            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please Select At Least One Cutomer");
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
            $('#emailBind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListForEmail', dataList)
        $('#emailModule').show();
        perviewEmailCamp();
    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please UnSelect At Least One Cutomer");
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
            $('#emailBind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListForEmail', dataList)
        $('#emailModule').show();
        perviewEmailCamp();
    }
}
// #########################################################################################################################
String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};
// #########################################################################################################################
function perviewEmailCamp() {
    var getDataList = localStorage.getItem('DataListForEmail');
    var list_data = getDataList.split('|');
    var listDatat = [];
    var completeEmail = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#broad_send_email_campaign_text").val();
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
    console.log('#######completeEmail######completeEmail', completeEmail);
    for (var di = 0; di < completeEmail.length; di++) {
        $('#final_mail_PreviewCamp').append('<div class="card-header">\
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
    localStorage.setItem('email_Syntax', mailText);
}
// #########################################################################################################################
function sendAllSMSCamp() {
    var completesms = [];
    const csrftoken = getCookie('csrftoken');
    var getDataList = localStorage.getItem('DataListForsms');
    var listDatat = [];
    var smsList = [];
    var list_data = getDataList.split('|');
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    console.log(listDatat);
    let mailText = $("#send_sms_campaign_text").val();

    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completesms.push(addDynTxt)
    }
    console.log(completesms);
    for (var pre = 0; pre < listDatat.length; pre++) {
        smsList.push(listDatat[pre][1])
    }
    console.log('smsList', smsList);
    var mailSubject = $('input[name="smsSubject"]').val();
    let sms_syntax_Text = localStorage.getItem('sms_Syntax');
    console.log();
    swal.fire({
        title: 'Are you sure!!',
        confirmButtonText: 'Send SMS',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'some-class',
        cancelButtonClass: 'some-other-class',
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            $('.loaders').show();
            $.ajax({
                type: 'POST',
                url: "SendSMSToCustomer",
                headers: { 'X-CSRFToken': csrftoken },
                data: { All_Mob_No: smsList, completeSms: completesms, smsSub: 'SMSSubject', smsText: sms_syntax_Text },
                success: function (response) {
                    console.log(typeof (response), response);
                    $('.loaders').hide();
                    console.log('finish');
                    swal.fire("DONE!", "SMS Sent Successfully.", "success").then(function () {
                        // window.location.href = "http://project-x.herokuapp.com/sms_broadcast";
                        window.location.href = "/sms_broadcast";
                    })
                }
            });
        } else {
            console.log('Cancel')
        }
    })
}

function Under() {
    Swal.fire('Under Development!');

}
// #########################################################################################################################
function CampaignsendSmstoCustomer() {
    var checkAllCustFlag = $('#Allcustsmscamp').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcustsmscamp').is(':checked');
    var checkunselectAllFlag = $('#unselectAllsmscamp').is(':checked');
    $('#CampaignCustomerSMSData').hide();
    $('#sendcampaignSms').show();
    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomersemailCamp",
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
                    $('#emailBind').append("<span>" + response[dt][1] + "<a  href='javascript:;'></a></span>");
                }
                localStorage.setItem('DataListForsms', dataList)
                $('#emailModule').show();
                perviewSMSCamp();
            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please Select At Least One Cutomer");
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
            $('#emailBind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListForsms', dataList)
        $('#emailModule').show();
        perviewSMSCamp();
    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please UnSelect At Least One Cutomer");
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
            $('#emailBind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListForsms', dataList)
        $('#emailModule').show();
        perviewSMSCamp();
    }
}
// #########################################################################################################################
function perviewSMSCamp() {
    var getDataList = localStorage.getItem('DataListForsms');
    var list_data = getDataList.split('|');
    var listDatat = [];
    var completesms = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#send_sms_campaign_text").val();
    console.log("Mail Text====>", mailText);
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completesms.push(addDynTxt)
    }
    console.log('#######completeEmail######completeEmail', completesms);
    for (var di = 0; di < completesms.length; di++) {
        $('#final_mail_PreviewCamp').append('<div class="card-header">\
                        <h3 class="card-title">\
                            <strong>To:</strong>'+ listDatat[di][1] + ' \
                        </h3>\
                  </div>\
                <div class="card-body pt-3 pb-0">\
                  <div class="row">\
                    <div class="col-lg-12">\
                      <div class="sms_text">\
                     '+ completesms[di] + '\
                      </div>\
                       </div>\
                       </div>\
                       </div>');
        $('#emailModule').hide();
        $('#mailPreview').show()
    }
    localStorage.setItem('sms_Syntax', mailText);
}
// #########################################################################################################################
function sendAllEmailCamp() {
    var completeEmail = [];
    const csrftoken = getCookie('csrftoken');
    var getDataList = localStorage.getItem('DataListForEmail');
    var listDatat = [];
    var mailList = [];
    var list_data = getDataList.split('|');
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    console.log(listDatat);
    let mailText = $("#broad_send_email_campaign_text").val();
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
    console.log('........', completeEmail);
    for (var pre = 0; pre < listDatat.length; pre++) {
        mailList.push(listDatat[pre][2])
    }
    console.log('mailList', mailList);
    var mailSubject = $('input[name="mailSubject"]').val();
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@', mailSubject);
    var campaignsub = mailSubject.split('Campaign')
    let mail_syntax_Text = localStorage.getItem('email_Syntax');
    console.log();
    swal.fire({
        title: 'Are you sure!',
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
                data: { AllEmail: mailList, completeEMAIL: completeEmail, mailSubject: campaignsub[0], EMAILText: mail_syntax_Text },
                success: function (response) {
                    console.log(typeof (response), response);
                    $('.loaders').hide();
                    console.log('finish');
                    swal.fire("DONE!", "Email Sent Successfully.", "success").then(function () {
                        // window.location.href = "http://project-x.herokuapp.com/email_broadcast";
                        window.location.href = "/email_broadcast";
                    })
                }
            });
        } else {
            console.log('Cancel')
        }
    })
}
// #############################################################################################################
// #####################################  BROADCAST SEARCH   ###################################################
// #############################################################################################################
// ####################################  BROADCAST SMS SERACH ##################################################
$('#smsSearch').on('keyup', function () {
    var value = $(this).val();
    console.log(value);

    $('table tr').each(function (records) {
        if (records !== 0) {
            var id = $(this).find('td').text();
            if (id.indexOf(value) !== 0 && id.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    })
})
// ####################################  BROADCAST EMAIL SERACH #################################################
$('#emailSearch').on('keyup', function () {
    var value = $(this).val();
    console.log(value);

    $('table tr').each(function (records) {
        if (records !== 0) {
            var id = $(this).find('td').text();
            if (id.indexOf(value) !== 0 && id.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    })
})
// ##############################################################################################################################################
$('#smscampSearch').on('keyup', function () {
    var value = $(this).val();
    console.log(value);

    $('table tr').each(function (records) {
        if (records !== 0) {
            var id = $(this).find('td').text();
            if (id.indexOf(value) !== 0 && id.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    })
})
// ####################################  BROADCAST EMAIL SERACH #################################################
$('#emailcampSearch').on('keyup', function () {
    var value = $(this).val();
    console.log(value);

    $('table tr').each(function (records) {
        if (records !== 0) {
            var id = $(this).find('td').text();
            if (id.indexOf(value) !== 0 && id.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }
    })
})
// #############################################################################################################
// #######################################  Create New Campaign  ###############################################
// #############################################################################################################
// ####################################  BROADCAST New Create EMAIL Campaign ###################################
function checkExistCampaignNameSMS(thistxt) {
    var NewCampaignNameSMS = $(thistxt).val();
    $.ajax({
        type: 'GET',
        url: "NewCampaignNameSMS",
        data: { 'name': NewCampaignNameSMS },
        success: function (response) {
            if (response === true) {
                $('#showEmailcampaignExist').css('display', '')
                $('#SelectCustNewCreateCamp').prop('disabled', true);
                $('#CreateCampaignTextSMS').prop('readonly', true);
            } else {
                $('#showEmailcampaignExist').css('display', 'none')
                $('#CreateCampaignTextSMS').attr('readonly', false);
            }
        }
    });
}
// #########################################################################################################################
function getDyanamicTextCreateSMS(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("CreateCampaignTextSMS").selectionStart;
    let x = $("#CreateCampaignTextSMS").val();
    let text_to_insert = dynamicText;
    $("#CreateCampaignTextSMS").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}
// #########################################################################################################################
function selectNEWSCampaignCustomerSMS() {
    let TextSMS = $("#CreateCampaignTextSMS").val();
    $('#newCampaignSMS').hide();
    $('#SelectCustmerCreateCamp').show();

}
// #########################################################################################################################
function FilterCustomerManagementIDNEWSMS() {
    var storCategory = $("select[name='StorenameFilter']").val();
    console.log(storCategory);
    var tierList = [];
    if (storCategory.length === 0) {
        Swal.fire("Please select atleast one store");
        clickEvent.stopPropagation();
        return false;
    }
    $.each($("input[name='tier']:checked"), function () {
        tierList.push($(this).val());
    });
    if (tierList.length === 0) {
        var Category = storCategory;
        var dateRangeFilter = $('input[name="dateFilter"]').val();
        if (dateRangeFilter.length === 0) {
            Swal.fire("Please Select Date Range");
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
                $('#loadmoresmsmCampBtn').hide();
                $("#getTabledata").html("");

                $('#paginater').hide();
                if (response.length === 0) {
                    $("#getTabledata").show();
                    $("#getTabledata").html('<tr onclick="customer_detailed_info({{item.id}})">\
                          <td colspan="7" style="text-align:center;">No Data Found</td>\
                        </tr>');
                } else {
                    console.log(response);
                    $("#getTabledata").show();
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {
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
        $.ajax({
            type: 'GET',
            url: "customerFilterApply",
            data: { 'Category': Category, 'tierType': tierType, 'ListTier': ListTier, "tierSelect": "TierSelect" },
            success: function (response) {
                $('#loadmoresmsmCampBtn').hide();
                $("#getTabledata").html("");
                if (response.length === 0) {
                    $("#getTabledata").show();
                    $("#getTabledata").html('<tr>)">\
                          <td colspan="7" style="text-align:center;">No Data Found</td>\
                        </tr>');
                } else {
                    console.log(response);
                    $("#getTabledata").show();
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {

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
// #########################################################################################################################
String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};
// #########################################################################################################################
function sendSmstoCustomerNEWSMS() {
    var checkAllCustFlag = $('#AllcustNEWSMS').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcustNEWSMS').is(':checked');
    var checkunselectAllFlag = $('#unselectAllNEWSMS').is(':checked');
    $('#newCampaignSMS').hide();
    $('#SelectCustmerCreateCamp').hide();
    $('#previewNewCampSMS').show();
    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomersemailCamp",
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
                    $('#emailBind').append("<span>" + response[dt][1] + "<a  href='javascript:;'></a></span>");
                }
                localStorage.setItem('DataListNEWSMS', dataList)
                $('#emailModule').show();
                perviewCampNEWSMS();
            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please Select At Least One Cutomer");
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
            $('#emailBind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListNEWSMS', dataList)
        $('#emailModule').show();
        perviewCampNEWSMS();
    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please UnSelect At Least One Cutomer");
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
            $('#emailBind').append("<span>" + datalist[dt][1] + "</span>");
        }
        localStorage.setItem('DataListNEWSMS', dataList)
        $('#emailModule').show();
        perviewCampNEWSMS();
    }
}
// #########################################################################################################################
function perviewCampNEWSMS() {
    var getDataList = localStorage.getItem('DataListNEWSMS');
    var list_data = getDataList.split('|');
    var listDatat = [];
    var completesms = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#CreateCampaignTextSMS").val();
    console.log("Mail Text====>", mailText);
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completesms.push(addDynTxt)
    }
    console.log('#######completeEmail######completeEmail', completesms);
    for (var di = 0; di < completesms.length; di++) {
        $('#final_PreviewCampNEWSMS').append('<div class="card-header">\
                        <h3 class="card-title">\
                            <strong>To:</strong>'+ listDatat[di][1] + ' \
                        </h3>\
                  </div>\
                <div class="card-body pt-3 pb-0">\
                  <div class="row">\
                    <div class="col-lg-12">\
                      <div class="sms_text">\
                     '+ completesms[di] + '\
                      </div>\
                       </div>\
                       </div>\
                       </div>');
        $('#emailModule').hide();
        $('#mailPreview').show()
    }
    localStorage.setItem('sms_Syntax', mailText);
}
// #########################################################################################################################
function sendAllNEWSMS() {
    var completeSMS = [];
    var getDataList = localStorage.getItem('DataListNEWSMS');
    var listDatat = [];
    var smsList = [];
    var list_data = getDataList.split('|');
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let smsText = $("#CreateCampaignTextSMS").val();
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = smsText.allReplace({
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
    console.log('AAAA smsList', smsList)
    var smsSubject = $('input[name="newCreateCampaignSMS"]').val();
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
            console.log('completeSMS', completeSMS);
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                type: 'POST',
                url: "SendSMSToCustomer",
                headers: { 'X-CSRFToken': csrftoken },
                data: { All_Mob_No: smsList, completeSms: completeSMS, smsSub: smsSubject, smsText: smsText },
                success: function (response) {
                    console.log(response);
                    $('.loaders').hide();
                    swal.fire("DONE!", "SMS Sent Successfully.", "success").then(function () {
                        // window.location.href = "http://project-x.herokuapp.com/customer_management";
                        window.location.href = "/create_sms_campaign";
                    })
                }
            });
        }
    });
}
// #############################################################################################################
// #######################################  Create New Campaign  ###############################################
// #############################################################################################################
// ####################################  BROADCAST New Create EMAIL Campaign ###################################
function checkExistCampaignNameEMAIL(thistxt) {
    var NewCampaignNameEMAIL = $(thistxt).val();
    $.ajax({
        type: 'GET',
        url: "NewCampaignNameEMAIL",
        data: { 'name': NewCampaignNameEMAIL },
        success: function (response) {
            if (response === true) {
                $('#showEmailcampaignExist').css('display', '')
                $('#SelectCustNewCreateCamp').prop('disabled', true);
                $('#CreateCampaignTextEMAIL').attr('readonly', true);
            } else {
                $('#showEmailcampaignExist').css('display', 'none');
                $('#CreateCampaignTextEMAIL').attr('readonly', false);
                // $('#SelectCustNewCreateCamp').prop('disabled', false);
            }
        }
    });
}
// #########################################################################################################################
function validMsg() {
    var campaign_msg = $('#CreateCampaignTextEMAIL').val();
    var NewCampaignNameEMAIL = $('#checkExistCampaignNameEMAIL').val();

    if (campaign_msg.length > 1) {
        if (NewCampaignNameEMAIL.length > 1) {
            $('#SelectCustNewCreateCamp').prop('disabled', false);
        }
    } else {
        $('#SelectCustNewCreateCamp').prop('disabled', true);
    }

}
// #########################################################################################################################
function validMsgsms() {
    var campaign_msg = $('#CreateCampaignTextSMS').val();
    var NewCampaignNameEMAIL = $('#checkExistCampaignNameSMS').val();
    if (campaign_msg.length > 1) {
        if (NewCampaignNameEMAIL.length > 1) {
            $('#SelectCustNewCreateCamp').prop('disabled', false);
        }
    } else {
        $('#SelectCustNewCreateCamp').prop('disabled', true);
    }

}
// #########################################################################################################################
function getDyanamicTextCreateEMAIL(thisattr) {
    var text = thisattr.value.trim();
    var dynamicText = ' {{' + text + '}} ';
    var curPos = document.getElementById("CreateCampaignTextEMAIL").selectionStart;
    let x = $("#CreateCampaignTextEMAIL").val();
    let text_to_insert = dynamicText;
    $("#CreateCampaignTextEMAIL").val(x.slice(0, curPos) + text_to_insert + x.slice(curPos));
}
// #########################################################################################################################
function selectNEWSCampaignCustomerEMAIL() {
    let TextEMAIL = $("#CreateCampaignTextEMAIL").val();
    $('#newCampaignEMAIL').hide();
    $('#SelectCustmerCreateCamp').show();

}
// #########################################################################################################################
function FilterCustomerManagementIDNEWEMAIL() {
    var storCategory = $("select[name='StorenameFilter']").val();
    console.log(storCategory);
    var tierList = [];
    if (storCategory.length === 0) {
        Swal.fire("Please select atleast one store");
        clickEvent.stopPropagation();
        return false;
    }
    $.each($("input[name='tier']:checked"), function () {
        tierList.push($(this).val());
    });
    if (tierList.length === 0) {
        console.log("Email");
        var Category = storCategory;
        var dateRangeFilter = $('input[name="dateFilter"]').val();
        if (dateRangeFilter.length === 0) {
            Swal.fire("Please Select Date Range");
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
                $('#loadmoreemailCampBtn').hide();
                $('#getTabledata').html("");
                $('#paginater').hide();
                if (response.length === 0) {
                    // $('#getTabledata').remove();
                    // $('#getTabledata').hide();
                    $("#getTabledata").show();
                    $("#getTabledata").html('<tr onclick="customer_detailed_info({{item.id}})">\
                          <td colspan="7" style="text-align:center;">No Data Found</td>\
                        </tr>');
                } else {
                    console.log(response);
                    // $('#getTabledata').remove();
                    // $('#getTabledata').hide();
                    $("#getTabledata").show();
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {

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
        $.ajax({
            type: 'GET',
            url: "customerFilterApply",
            data: { 'Category': Category, 'tierType': tierType, 'ListTier': ListTier, "tierSelect": "TierSelect" },
            success: function (response) {
                $('#loadmoreemailCampBtn').hide();
                $('#getTabledata').html("");
                if (response.length === 0) {
                    $("#getTabledata").show();
                    $("#getTabledata").html('<tr>)">\
                          <td colspan="7" style="text-align:center;">No Data Found</td>\
                        </tr>');
                } else {
                    console.log(response);
                    $("#getTabledata").show();
                    var html = '';
                    for (const [key, value] of Object.entries(response)) {
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
// #########################################################################################################################
String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};
// #########################################################################################################################
function sendemailtoCustomerNEWEMAIL() {
    var checkAllCustFlag = $('#AllcustNEWEMAIL').is(':checked');
    var checkselectAllcustFlag = $('#selectAllcustNEWEMAIL').is(':checked');
    var checkunselectAllFlag = $('#unselectAllNEWEMAIL').is(':checked');
    $('#newCampaignEMAIL').hide();
    $('#SelectCustmerCreateCamp').hide();
    $('#previewNewCampEMAIL').show();
    if (checkAllCustFlag) {
        $.ajax({
            type: 'GET',
            url: "allCsvCustomersemailCamp",
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
                    $('#emailBind').append("<span>" + response[dt][2] + "<a  href='javascript:;'></a></span>");
                }
                localStorage.setItem('DataListNEWEMAIL', dataList)
                $('#emailModule').show();

                perviewCampNEWEMAIL();
            }
        });
    }
    else if (checkselectAllcustFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:checked").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[4].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });
        if (datalist.length === 0) {
            Swal.fire("Please Select At Least One Cutomer");
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
        localStorage.setItem('DataListNEWEMAIL', dataList)
        $('#emailModule').show();
        perviewCampNEWEMAIL();
    }
    else if (checkunselectAllFlag) {
        var datalist = [];
        // dataList.push(['Name', 'Contact', 'Email', 'Gender', 'DOB']);
        $("#getTabledata input[type=checkbox]:not(:checked)").each(function () {
            var row = $(this).closest("tr")[0];
            datalist.push([row.cells[2].innerHTML, row.cells[3].innerHTML, row.cells[5].innerHTML, row.cells[5].innerHTML, row.cells[6].innerHTML]);
        });

        if (datalist.length === 0) {
            Swal.fire("Please UnSelect At Least One Cutomer");
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
        localStorage.setItem('DataListNEWEMAIL', dataList)
        $('#emailModule').show();
        perviewCampNEWEMAIL();
    }
}
// #########################################################################################################################
function perviewCampNEWEMAIL() {
    var getDataList = localStorage.getItem('DataListNEWEMAIL');
    var list_data = getDataList.split('|');
    var listDatat = [];
    var completeEMAIL = [];
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let mailText = $("#CreateCampaignTextEMAIL").val();
    console.log("Mail Text====>", mailText);
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = mailText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeEMAIL.push(addDynTxt)
    }
    console.log('#######completeEmail######completeEmail', completeEMAIL);
    for (var di = 0; di < completeEMAIL.length; di++) {
        $('#final_PreviewCampNEWEMAIL').append('<div class="card-header">\
                        <h3 class="card-title">\
                            <strong>To:</strong>'+ listDatat[di][2] + ' \
                        </h3>\
                  </div>\
                <div class="card-body pt-3 pb-0">\
                  <div class="row">\
                    <div class="col-lg-12">\
                      <div class="EMAIL_text">\
                     '+ completeEMAIL[di] + '\
                      </div>\
                       </div>\
                       </div>\
                       </div>');
        $('#emailModule').hide();
        $('#mailPreview').show()
    }
    localStorage.setItem('EMAIL_Syntax', mailText);
}
// #########################################################################################################################
function sendAllNEWEMAIL() {
    var completeEMAIL = [];
    var getDataList = localStorage.getItem('DataListNEWEMAIL');
    var listDatat = [];
    var EMAILList = [];
    var list_data = getDataList.split('|');
    for (var data = 0; data < list_data.length; data++) {
        listDatat.push(list_data[data].split(","))
    }
    let EMAILText = $("#CreateCampaignTextEMAIL").val();
    for (var pre = 0; pre < listDatat.length; pre++) {
        var addDynTxt = EMAILText.allReplace({
            '{{name}}': listDatat[pre][0],
            '{{mob_number}}': listDatat[pre][1],
            '{{email}}': listDatat[pre][2],
            '{{dob}}': listDatat[pre][3],
            '{{gender}}': listDatat[pre][4]
        })
        completeEMAIL.push(addDynTxt)
    }
    console.log('>>>>>>', completeEMAIL)
    for (var pre = 0; pre < listDatat.length; pre++) {
        EMAILList.push(listDatat[pre][2])
    }
    console.log('AAAA EMAILList', EMAILList)
    var EMAILSubject = $('input[name="newCreateCampaignEMAIL"]').val();
    swal.fire({
        title: 'Are you Sure ?',
        confirmButtonText: 'Send EMAIL',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'some-class',
        cancelButtonClass: 'some-other-class',
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            $('.loaders').show();
            console.log('completeEMAIL', completeEMAIL);
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                type: 'POST',
                url: "SendEmailToCustomer",
                headers: { 'X-CSRFToken': csrftoken },
                data: { AllEmail: EMAILList, completeEMAIL: completeEMAIL, mailSubject: EMAILSubject, EMAILText: EMAILText },
                success: function (response) {
                    console.log(response);
                    $('.loaders').hide();
                    swal.fire("DONE!", "EMAIL Sent Successfully.", "success").then(function () {
                        // window.location.href = "http://project-x.herokuapp.com/customer_management";
                        window.location.href = "/email_broadcast";
                    })
                }
            });
        }
    });
}
// ###################################  FILTER   ####################################################################

var KTBootstrapDaterangepicker = function () {
    var demos = function () {
        $('#kt_daterangepicker_2').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_2 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });

        $('#kt_daterangepicker_2_modal').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_2 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });

        // left alignment setup
        $('#kt_daterangepicker_3').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_3 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });

        $('#kt_daterangepicker_3_modal').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_3 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });

        // date & time
        $('#kt_daterangepicker_4').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary',

            timePicker: true,
            timePickerIncrement: 30,
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        }, function (start, end, label) {
            $('#kt_daterangepicker_4 .form-control').val(start.format('MM/DD/YYYY h:mm A') + ' / ' + end.format('MM/DD/YYYY h:mm A'));
        });
        // ######################################################################################################################################################################
        // #########################################            EMAIL BROADCAST DATE FILTER          ############################################################################
        // ######################################################################################################################################################################
        // date picker
        var estart = moment().subtract(6, 'days');
        var eend = moment();
        $('#kt_daterangepicker_5').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary',

            startDate: estart,
            endDate: eend,

        }, function (estart, eend, label) {
            $('#kt_daterangepicker_5 .form-control').val(estart.format('YYYY-MM-DD') + ' / ' + eend.format('YYYY-MM-DD'));
            start_date = estart.format('YYYY-MM-DD');
            end_date = eend.format('YYYY-MM-DD');
            $.ajax({
                type: 'GET',
                data: { 'start_date': start_date, 'end_date': end_date },
                url: "/filterEmailDate",
                success: function (response) {
                    $("#email_camp_table_body").html("");
                    console.log(response);
                    console.log('email');
                    if (response.length > 0) {
                        $('#ShowErrmsgemail').hide();
                        $('#email_camp_table_body').show();
                        for (var i = 0; i < response.length; i++) {
                            console.log(response[i]['id'], response[i]['campName'], response[i]['time_stamp']);
                            $("#email_camp_table_body").append('<tr> <td>' + response[i]['campName'] + '</td> <td>' + response[i]['time_stamp'] + '</td><td>' + "-" + '</td> <td> -</td><td> -</td><td class= "text-center"><form method="GET" action="">\
                            <a href="/campaignDetailEmail/' + response[i]['id'] + '"><i class="fa fa-eye text-dark pr-3"></i></a></form></td></tr>');
                        }
                    } else {
                        $('#email_camp_table_body').hide();
                        $('#ShowErrmsgemail').show();

                    }
                }
            });
        });
        // ######################################################################################################################################################################
        // #########################################            SMS BROADCAST DATE FILTER          ##############################################################################
        // ######################################################################################################################################################################
        // predefined ranges
        var start = moment().subtract(6, 'days');
        var end = moment();

        $('#kt_daterangepicker_1').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary',
            startDate: start,
            endDate: end,
        }, function (start, end, label) {
            $('#kt_daterangepicker_1.form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
            start_date = start.format('YYYY-MM-DD');
            end_date = end.format('YYYY-MM-DD');
            $.ajax({
                type: 'GET',
                data: { 'start_date': start_date, 'end_date': end_date },
                url: "/filterSmSDate",
                success: function (response) {

                    $("#sms_camp_table_body").html("");
                    console.log(response);
                    console.log('email');
                    if (response.length > 0) {
                        $('#ShowErrmsgSMS').hide();
                        $('#sms_camp_table_body').show();
                        for (var i = 0; i < response.length; i++) {
                            console.log(response[i]['id'], response[i]['campName'], response[i]['time_stamp']);
                            $("#sms_camp_table_body").append('<tr> <td>' + response[i]['campName'] + '</td> <td>' + response[i]['time_stamp'] + '</td><td>' + "-" + '</td> <td> -</td><td> -</td><td class= "text-center"><form method="GET" action="">\
                            <a href="/campaignDetailSMS/' + response[i]['id'] + '"><i class="fa fa-eye text-dark pr-3"></i></a></form></td></tr>');
                        }
                    } else {
                        $('#sms_camp_table_body').hide();
                        $('#ShowErrmsgSMS').show();
                    }
                }
            });
        });
    }
    // ######################################################################################################################################################################
    // ######################################################################################################################################################################


    var validationDemos = function () {
        // input group and left alignment setup
        $('#kt_daterangepicker_1_validate').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_1_validate .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });

        // input group and left alignment setup
        $('#kt_daterangepicker_2_validate').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_3_validate .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });

        // input group and left alignment setup
        $('#kt_daterangepicker_3_validate').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {
            $('#kt_daterangepicker_3_validate .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
        });
    }

    return {
        // public functions
        init: function () {
            demos();
            validationDemos();
        }
    };
}();

jQuery(document).ready(function () {
    KTBootstrapDaterangepicker.init();
});
// #########################################################################################################################

function checkAmtRange() {
    var start = $("#minval").val();
    var end = $("#maxval").val();
    var startAmt = parseInt(start);
    var endAmt = parseInt(end);

    console.log(typeof (startAmt), end);
    if (startAmt <= endAmt) {
        $('#erroramt').html('');
        $('.applybtnn').prop('disabled', false);
        $("#amount").val("Rs." + startAmt +
            " - Rs." + endAmt);

    } else if (startAmt > endAmt) {
        $('#erroramt').html('Starting amount must be less than End amount!');
        $('.applybtnn').prop('disabled', true);
        $("#amount").val("Rs." + startAmt +
            " - Rs." + endAmt);
    }
}

