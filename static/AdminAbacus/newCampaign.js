function newEmailCampaignName() {
    var campaign_name = $('#newEmailCampaign').val();
    $.ajax({
        type: 'GET',
        data: { 'campaignName': campaign_name },
        url: "/checkCampaign",
        success: function (response) {
            if (response == 'True') {
                document.getElementById('duplicateEmailCampaign').innerHTML = 'Email already exist!';
            } else {
                // err_manager_email = true;
            }
        }
    });
}
// ##########################################################################################################################################################
// ########################################  CREATE NEW CAMPAING SEARCH  ####################################################################################
// ##########################################################################################################################################################
// #######################################  CREATE NEW EMAIL CAMPAING SEARCH   ##############################################################################
$('#createemailSearch').on('keyup', function () {
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
// #######################################  CREATE NEW SMS CAMPAING SEARCH   ##############################################################################
$('#createSmsSearch').on('keyup', function () {
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
// #####################################################################################################################################

