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
// =================================================================================================
function checkmanagerstatus(txt) {
   if($('#switch').prop('checked') === false){
       if (confirm('Are you sure you want to Disable store?')) {
            var storeId = $(txt).val();
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                type: 'POST',
                url: "checkmanagerstatus",
                headers: { 'X-CSRFToken': csrftoken },
                data: { 'storeId': storeId },
                success: function (response) {
                    $('#switch').prop('checked',false);
                }
            });
       } else {
           $('#switch').prop('checked', true);
           return false;
       }
   }else{
       var storeId = $(txt).val();
       const csrftoken = getCookie('csrftoken');
       $.ajax({
           type: 'POST',
           url: "checkmanagerstatus",
           headers: { 'X-CSRFToken': csrftoken },
           data: { 'storeId': storeId },
           success: function (response) {
               $('#switch').prop('checked', true);
           }
       });
   } 
}


// $(document).ready(function () {
//     console.log("ready!");
// });


// Swal.fire({
//     title: 'Do you want to save the changes?',
//     showDenyButton: true,
//     showCancelButton: true,
//     confirmButtonText: `Save`,
//     denyButtonText: `Don't save`,
// }).then((result) => {
//     /* Read more about isConfirmed, isDenied below */
//     if (result.isConfirmed) {
//         Swal.fire('Saved!', '', 'success')
//     } else if (result.isDenied) {
//         Swal.fire('Changes are not saved', '', 'info')
//     }
// })


// var storeId = $(txt).val();
// const csrftoken = getCookie('csrftoken');
// $.ajax({
//     type: 'POST',
//     url: "checkmanagerstatus",
//     headers: { 'X-CSRFToken': csrftoken },
//     data: { 'storeId': storeId },
//     success: function (response) {
//         console.log(response);
//     }
// });