// This is JS file to handle STORE DETAILS AND RELATED DATA
$('#AddStore_Next').click(function () {

    var arr = {} // main store management array

    // Store Detail : Step 01 
    var store_name = $("input[name = store_name]").val();
    var store_location = $("input[name = store_location]").val();
    var store_town = $("input[name = store_town]").val();
    var store_city = $("input[name = store_city]").val();
    var store_state = $("input[name = store_state]").val();

    // Category details : Step 01
    category = {}
    var store_category = $("select[name = store_category]").val();
    var store_sub_category = $("select[name = store_sub_category]").val();

    console.log(store_category);
    console.log(store_sub_category);

    category[store_category] = store_sub_category

    // Store Manager Details : Step 02
    var profile_avatar = $("input[name = profile_avatar]").val();
    var manager_name = $("input[name = manager_name]").val();
    var UniqueID = $("input[name = UniqueID]").val();
    var manager_email = $("input[name = manager_email]").val();
    var manager_gender = $("input[name = manager_gender]").val();
    var manager_pass = $("input[name = manager_pass]").val();
    // var manager_confirm_pass = $("input[name = manager_confirm_pass]").val();

    // Store Supervisor Details : Step 02
    var supervisor_name = $("input[name = supervisor_name]").val();
    var supervisor_contact = $("input[name = supervisor_contact]").val();
    var supervisor_email = $("input[name = supervisor_email]").val();
    var supervisor_gender = $("input[name = supervisor_gender]").val();

    // Customer entry type : Step03
    var customer_entry_type = $("input[name = radios16]").val();

    // Define Tier : Step04


    // ###################################################################################################################################################################
    // creating key value pair (Store & Category Detail) : Step 01
    arr['store_name'] = store_name
    arr['store_location'] = store_location
    arr['store_town'] = store_town
    arr['store_city'] = store_city
    arr['store_state'] = store_state
    arr['category'] = category

    // creating key value pair (Store Manager & Supervisor Detail) : Step 02
    arr['profile_avatar'] = profile_avatar
    arr['manager_name'] = manager_name
    arr['UniqueID'] = UniqueID
    arr['manager_email'] = manager_email
    arr['manager_gender'] = manager_gender
    arr['manager_pass'] = manager_pass

    arr['supervisor_name'] = supervisor_name
    arr['supervisor_contact'] = supervisor_contact
    arr['supervisor_email'] = supervisor_email
    arr['supervisor_gender'] = supervisor_gender

    // creating key value pair (Customer entry type) : Step 03
    arr['customer_entry_type'] = customer_entry_type

    // creating key value pair (Define Tier) : Step 04
    // arr['customer_entry_type'] = customer_entry_type


    console.log(arr)

    localStorage.setItem('storeInfo', JSON.stringify(arr))

    var StoreInfo = localStorage.getItem('storeInfo')
    console.log(StoreInfo)

    var showStoreInfo = JSON.parse(StoreInfo)
    console.log(showStoreInfo)




    // ###################################################################################################################################################################
    var crtStep = localStorage.getItem("Steps");
    var newStepsVal = parseInt(crtStep) + 1;
    $('#Step_' + crtStep).show();
    for (var s = 1; s < 6; s++) {
        if (newStepsVal === s) {

            $('#Step_' + crtStep).hide();
            $('#Step_' + newStepsVal.toString()).show();

            if (newStepsVal === 5) {
                $('#AddStore_Next').hide();
                localStorage.setItem("Steps", 1);

            }
        } else {

            $('#Step_' + newStepsVal.toString()).show();
        }

        localStorage.setItem("Steps", newStepsVal.toString());
    }

});

$(document).ready(function () {
    var initialVal = 1;
    localStorage.setItem("Steps", initialVal);
    localStorage.removeItem('storeInfo');
});