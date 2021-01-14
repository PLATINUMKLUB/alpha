alert();
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

            for (var j = 1; j < arr.length; j++) {
                console.log(arr[j]);
                $("#add-cats").append('<div class="row">   <div class="col-lg-11 mt-3 mb-3">   <input type="text" class="form-control" placeholder="Enter sub category name" value=' + arr[j].trim() + ' /> </div><div class="col-lg-1 mt-3 pt-2 "> <a href="#" class="  remove_c"><i class="fa fa-minus-circle"></i></a> </div>  </div>');
            };

        }
    }
}
