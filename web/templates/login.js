function getData(){
    var x = document.getElementById("gif");
    x.style.display='inline';     
    var username = $('#username').val();
    var password = $('#password').val();
    var message = JSON.stringify({
        "username": username,
        "password": password
    });
    console.log("xopowo")
    $('#fail').hide();
    $.ajax({
        url:'/authenticate',
        type:'POST',
        contentType: 'application/json',
        data : message,
        dataType:'json',
        success: function(response){

        },
        error: function(response){

            if(response['status']==401){
                $('#gif').hide();
                $('#fail').show();
            }
            else{
                $('#gif').hide();
                window.location="http://127.0.0.1:8080/static/chat.html";
            }
            //alert(JSON.stringify(response));
        }
    });
}

