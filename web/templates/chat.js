
function whoami(){
    $.ajax({
        url:'/current',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            $('#active_id').html(response['username'])
            var name = response['name']+" "+response['fullname'];
            $('#active_username').html(name);
            getUsers(response.id);
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

function getUsers(current){
    $.ajax({
        url:'/users',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            var i = 0;
            $.each(response, function(){
                if(response[i].id!=current){
                    f = '<div class="mensaje" onclick="getMessages('+current+','+response[i].id+')">';
                    f = f + response[i].username;
                    f = f + '</div>';
                    $('#users').append(f);
                }
                i = i+1;
            });
            
        },
        error: function(response){
            alert(JSON.stringify(current,response));
        }
    });
}

function getMessages(current,messenger){
    $.ajax({
        url:'/messages',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            var i = 0;
            if($("#mensajes").is(':empty')){
                $.each(response, function(){
                    if ((response[i].user_from_id==messenger | response[i].user_from_id==current) & (response[i].user_to_id==messenger | response[i].user_to_id==current)){
                        f = '<div class="mensaje recibido">';
                        f = f + response[i].content;
                        f = f + '</div>';
                        $('#mensajes').append(f);
                    }
                    i = i+1;
                });
                $('#mensajes').append('<td><input type="text" name="message" id="message"/></td>')
                $('#mensajes').append('<input type="button" value="Send" onclick="Sendmessage()"/>')
            }
            else{
                $("#mensajes").empty();
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}


function Sendmessage(){
    $.ajax({
        url:'/messages',
        type:'POST',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

