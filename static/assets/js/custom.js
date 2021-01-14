// manual entry form$
$('.card.form-card-1  .next').click(function () {
    $('.card.form-card-1').hide();
    $('.card.form-card-2').show();
});


$('.upload label input').change(function (e) {
    var fileName = e.target.files[0].name;
    $('#file').show();
    $('#file').html(fileName);
});

$('.upload .btn-upload').click(function () {
    $(this).parent().hide();
    $('.col-assign').show();
    $('.btn-send').show();
});


$('.col-assign .btn-next').click(function () {
    $(this).parent().find('h5.active').hide();
    $(this).parent().find('h5.active').next().addClass('active');

});

// change pass
$(".otp-text").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next('.otp-text').focus();
    }
});
$('#confirm1 .btn-success').click(function () {
    $('.old-pass').hide();
    $('.otp').fadeIn();
    $('#dig-1').focus();
});


$('.pass').click(function () {
    $('.login-pass').fadeIn();
    $('.login-otp').hide();
});

// #########################################################################################################################################################
// #########################################################################################################################################################
// #########################################################################################################################################################


// $(".mobile_nos span a").click(function(){ 
//    $(this).parent().remove();
//  });
// $('#camp_tbl td:nth-child(1), #camp_tbl td:nth-child(2), #cust_tbl td:nth-child(3), #cust_tbl td:nth-child(4), #cust_tbl td:nth-child(5)').click(function () {
//     window.open("campaign-detail.php", "_self");
// });
// $('#camp_det td:nth-child(1), #camp_det td:nth-child(2),  #camp_det td:nth-child(3), #camp_det td:nth-child(4),  #camp_det td:nth-child(5)').click(function () {
//     window.open("send-sms-campaign.php", "_self");
// });
// $('.camp_tbl.email td:nth-child(1), .camp_tbl.email td:nth-child(2), .cust_tbl.email td:nth-child(3),.cust_tbl.email td:nth-child(4), .cust_tbl.email td:nth-child(5)').click(function () {
//     window.open("send-email-campaign.php", "_self");
// });
// $(".edit-cont").click(function () {
//     $('.sms_text').removeClass('view');
//     var strr = $('.sms_text textarea').val();
//     $('.sms_text textarea').focus().val("").val(strr);;

// });
