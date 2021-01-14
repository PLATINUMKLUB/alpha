function searchEmail() {
    
    document.getElementById('forget_button').disabled = true;
    var valid_email = document.getElementById('id_email').value;
    var url = '/validate_email?email=' + valid_email;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = eval(req.responseText);
            console.log('response');
            if(data === true){
                console.log(data);
                document.getElementById('para_alert1').innerHTML = ''
                document.getElementById('forget_button').disabled = false;
            }else{
                console.log('error');
                
                document.getElementById('para_alert1').innerHTML = "Email doesn't exist!"
                document.getElementById('forget_button').disabled = true;    
            }
        }
    };
    req.open('GET', url, true)
    req.send()
    console.log('data sent successfully!')
}
