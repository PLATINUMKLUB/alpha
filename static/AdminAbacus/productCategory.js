function searchCategory() {
    var category = document.getElementById('storeCategory').value;
    var regx = /^[A-Za-z]+$/;
    if (category.match(regx)) {
        document.getElementById('catError').innerHTML = ''
        flag = false;
        $.ajax({
            type: 'GET',
            url: "checkCtagory",
            data: { storeCategory: category },
            success: function (response) {
                console.log(response);
                response.trim() === 'True' ? $('.checkCat').html('Category Name Exist').css('color', 'red') : $('.checkCat').html('Category Name').css('color', 'black')
                response.trim() === 'True' ? $("#CategoryFlag").attr("disabled", true) : $("#CategoryFlag").attr("disabled", false)
                response.trim() === 'True' ? $('#sub_cat_edit').attr("disabled", true) : $("#sub_cat_edit").attr("disabled", false)
            }
        })
    } else {
        document.getElementById('catError').innerHTML = 'Category name only contains alphabets'
        document.getElementById('CategoryFlag').disabled = true;
    }
};
// #####################################################################################################################################
var num2 = 1;
$(".add-more-c").click(function () {
    var arr_length = window.localStorage.getItem('arr_length');
    console.log('local arr_length : ' + arr_length);
            $("#add-cats").append('<div class="row">   <div class="col-lg-11 mt-3 mb-3">   <input type="text" class="form-control " name="Store_sub_category" onkeyup="subCategory_validate()" id="id="sub_cat_edit""  placeholder="Enter sub category name" value="" required/> </div><div class="col-lg-1 mt-3 pt-2 "> <a href="#" class="remove_c"><i class="fa fa-minus-circle"></i></a> </div>  </div>');
            $('.btn-primary').removeClass('disabled');
});
// #####################################################################################################################################
$(document).on("click", ".remove_c", function () {
    $(this).parent().parent('.row').remove();
    num2--;
    var arr_length = window.localStorage.getItem('arr_length');
    arr_length--;
    window.localStorage.setItem('arr_length', arr_length);
});
// #####################################################################################################################################
$(".add-cat").click(function () {
    $("#add-cats").html("");
    $('#add-cat').toggle(300);
});
$(".cancel_c").click(function () {
    $('#add-cat').toggle(300);
});
$(".mobile_nos span a").click(function () {
    $(this).parent().remove();
});
// #####################################################################################################################################
function editCategory(id) {
    let ID = id;
    $.ajax({
        type: 'GET',
        url: 'editCategory',
        data: { 'id': ID },
        success: successfunction
    })
    function successfunction(response) {
        $("#add-cats").html("");
        console.log(response);
        var category = response['cat_data'];
        console.log(category);
        for (const [key, value] of Object.entries(category)) {
            console.log(key, value);
            dict_value = value.split(",");
            document.getElementById('storeCategory').value = key;
            sub_cat = value.split(",");
            arr = []
            category_arr = {}
            for (var i = 0; i < sub_cat.length; i++) {
                x = sub_cat[i];
                new_str = x.replace('[', '').replace(']', '').replace("'", '').replace("'", '');
                arr.push(new_str);
            }
            category_arr[key] = arr;
            console.log(category_arr);
            document.getElementById('sub_cat_edit').value = arr[0];
            window.localStorage.setItem('arr_length', arr.length);
            for (var j = 1; j < arr.length; j++) {
                console.log(arr[j]);
                $("#add-cats").append('<div class="row">   <div class="col-lg-11 mt-3 mb-3">   <input type="text" class="form-control" name="Store_sub_category" placeholder="Enter sub category name" value=' + arr[j].trim() + ' required/> </div><div class="col-lg-1 mt-3 pt-2 "> <a href="#" class="  remove_c"><i class="fa fa-minus-circle"></i></a> </div>  </div>');
            };

        }
    }
}
// #####################################################################################################################################
function newCategory() {
    document.getElementById('storeCategory').value = '';
    document.getElementById('sub_cat_edit').value = "";
}
// #####################################################################################################################################
function subCategory_validate(){
    var regx = /^[A-Za-z]+$/;
    var sub_cat_name = $('#sub_cat_edit').val();
        if (sub_cat_name.match(regx)) {
            $("#addmoreSubCategory").show();
            document.getElementById('catError').innerHTML = ''
            document.getElementById('CategoryFlag').disabled = false; 
        } else {
            $("#addmoreSubCategory").hide();
            document.getElementById('catError').innerHTML = 'Sub Category name only contains alphabets'
            document.getElementById('CategoryFlag').disabled = true;
        }
    }
// #####################################################################################################################################
