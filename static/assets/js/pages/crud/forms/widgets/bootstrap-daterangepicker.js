// Class definition

// var KTBootstrapDaterangepicker = function () {

//     // Private functions
//     var demos = function () {
//         // minimum setup
//         // $('#kt_daterangepicker_1, #kt_daterangepicker_1_modal').daterangepicker({
//         //     buttonClasses: ' btn',
//         //     applyClass: 'btn-primary',
//         //     cancelClass: 'btn-secondary'
//         // });

//         // input group and left alignment setup
//         $('#kt_daterangepicker_2').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_2 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });

//         $('#kt_daterangepicker_2_modal').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_2 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });

//         // left alignment setup
//         $('#kt_daterangepicker_3').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_3 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });

//         $('#kt_daterangepicker_3_modal').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_3 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });


//         // date & time
//         $('#kt_daterangepicker_4').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary',

//             timePicker: true,
//             timePickerIncrement: 30,
//             locale: {
//                 format: 'MM/DD/YYYY h:mm A'
//             }
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_4 .form-control').val(start.format('MM/DD/YYYY h:mm A') + ' / ' + end.format('MM/DD/YYYY h:mm A'));
//         });
//         // ######################################################################################################################################################################
//         // #########################################            EMAIL BROADCAST DATE FILTER          ############################################################################
//         // ######################################################################################################################################################################
//         // date picker
//         var estart = moment().subtract(6, 'days');
//         var eend = moment();
//         $('#kt_daterangepicker_5').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary',

//             startDate: estart,
//             endDate: eend,

//         }, function (estart, eend, label) {
//             $('#kt_daterangepicker_5 .form-control').val(estart.format('YYYY-MM-DD') + ' / ' + eend.format('YYYY-MM-DD'));
//             start_date = estart.format('YYYY-MM-DD');
//             end_date = eend.format('YYYY-MM-DD');
//             $.ajax({
//                 type: 'GET',
//                 data: { 'start_date': start_date, 'end_date': end_date },
//                 url: "/filterEmailDate",
//                 success: function (response) {
//                     $("#email_camp_table_body").html("");
//                     console.log(response);
//                     console.log('email');
//                     if (response.length > 0) {
//                         $('#ShowErrmsgemail').hide();
//                         $('#email_camp_table_body').show();
//                         for (var i = 0; i < response.length; i++) {
//                             console.log(response[i]['id'], response[i]['campName'], response[i]['time_stamp']);
//                             $("#email_camp_table_body").append('<tr> <td>' + response[i]['campName'] + '</td> <td>' + response[i]['time_stamp'] + '</td><td>' + "-" + '</td> <td> -</td><td> -</td><td class= "text-center"><form method="GET" action=""><a href="#" %}"><i class="fa fa-eye text-dark pr-3"></i></a></form></td></tr>');
//                         }
//                     } else {
//                         $('#email_camp_table_body').hide();
//                         $('#ShowErrmsgemail').show();

//                     }
//                 }
//             });
//         });
//         // ######################################################################################################################################################################
//         // #########################################            SMS BROADCAST DATE FILTER          ##############################################################################
//         // ######################################################################################################################################################################
//         // predefined ranges
//         var start = moment().subtract(6, 'days');
//         var end = moment();

//         $('#kt_daterangepicker_1').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary',
//             startDate: start,
//             endDate: end,
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_1.form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//             start_date = start.format('YYYY-MM-DD');
//             end_date = end.format('YYYY-MM-DD');
//             $.ajax({
//                 type: 'GET',
//                 data: { 'start_date': start_date, 'end_date': end_date },
//                 url: "/filterSmSDate",
//                 success: function (response) {

//                     $("#sms_camp_table_body").html("");
//                     console.log(response);
//                     console.log('email');
//                     if (response.length > 0) {
//                         $('#ShowErrmsgSMS').hide();
//                         $('#sms_camp_table_body').show();
//                         for (var i = 0; i < response.length; i++) {
//                             console.log(response[i]['id'], response[i]['campName'], response[i]['time_stamp']);
//                             $("#sms_camp_table_body").append('<tr> <td>' + response[i]['campName'] + '</td> <td>' + response[i]['time_stamp'] + '</td><td>' + "-" + '</td> <td> -</td><td> -</td><td class= "text-center"><form method="GET" action=""><a href="{% url "campaignDetailEmail" ' + response[i]['id'] + ' %}"><i class="fa fa-eye text-dark pr-3"></i></a></form></td></tr>');
//                         }
//                     } else {
//                         $('#sms_camp_table_body').hide();
//                         $('#ShowErrmsgSMS').show();
//                     }
//                 }
//             });
//         });
//     }
//     // ######################################################################################################################################################################
//     // ######################################################################################################################################################################


//     var validationDemos = function () {
//         // input group and left alignment setup
//         $('#kt_daterangepicker_1_validate').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_1_validate .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });

//         // input group and left alignment setup
//         $('#kt_daterangepicker_2_validate').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_3_validate .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });

//         // input group and left alignment setup
//         $('#kt_daterangepicker_3_validate').daterangepicker({
//             buttonClasses: ' btn',
//             applyClass: 'btn-primary',
//             cancelClass: 'btn-secondary'
//         }, function (start, end, label) {
//             $('#kt_daterangepicker_3_validate .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
//         });
//     }

//     return {
//         // public functions
//         init: function () {
//             demos();
//             validationDemos();
//         }
//     };
// }();

// jQuery(document).ready(function () {
//     KTBootstrapDaterangepicker.init();
// });
