function getData(){
    var username = $('#username').val();
    var password = $('#password').val();
    var message = JSON.stringify({
            "username": username,
            "password": password
        });
    var x = document.getElementById("gif");
    x.style.display='inline';     
    $.ajax({
        url:'/authenticate',
        type:'POST',
        contentType: 'application/json',
        data : message,
        dataType:'json',
        success: function(response){
            x.style.display='none';
            y.style.display='inline';     
            console.log("hello");
            alert(JSON.stringify(response));
            $('#action').html(response['statusText']);
        },
        error: function(response){
            if(response['status']==401){
                $('#gif').hide();
            }
            else{
                $('#gif').hide();
            }
            //alert(JSON.stringify(response));   
            $('#action').html(response['statusText']);
            var a=username;
            var c="http://127.0.0.1:8080/chat"+"/"+a;
            window.location=c;
        }
    });
}