function getMessages(){
    var username = $('#$a.username').val();
    x.style.display='inline';
    $.ajax({
        url:'/loadmessages',
        type:'GET',
        contentType: 'application/json',
        data : username,
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
            var c="http://127.0.0.1:8080/chatwith"+"/"+"a";
            window.location=c;
        }
    });
}