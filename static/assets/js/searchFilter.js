
$('#myInput').on('keyup', function () {
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




function checkAll() {
    var parent = document.getElementById('parent');
    var input = document.getElementsByClassName('chckbx');
    console.log('function called!')

    if (parent.checked == false) {
        for (var i = 0; i < input.length; i++) {
            if (input.type == 'checkbox' && input[i].className == 'chckbx' && input[i].checked == true) {
                input[i].checked = false;
                console.log('All selected');
            }
        }
    }

    else if (parent.checked == true) {
        for (var i = 0; i < input.length; i++) {
            if (input.type == 'checkbox' && input[i].className == 'chckbx' && input[i].checked == false) {
                input[i].checked = true;
                console.log('Select All');
            }
        }
    }
}