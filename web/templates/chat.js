
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
    $('#container').hide();

    $.ajax({
        url:'/users',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            var i = 0;
            $.each(response, function(){
                if(response[i].id!=current){
                    f = '<div class="mensaje col s12" onclick="getMessages('+current+','+response[i].id+')">';
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
    $('#container').show();
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
                        f= '<div id="fila'+i+'" class="col row s12"><div id="burbuja'+i+'" class="col s12">';
                        if(response[i].user_from_id==messenger){
                            f = f + '<div class="recibido col row s2">';
                        }
                        else{
                            f = f + '</br><input id="message'+response[i].id+'" class="btn btn-secondary btn-block btn-small" type="button" value="Delete Message" onclick="delMessage('+current+','+messenger+','+response[i].id+')"/><div class= "mensaje col row s2 right">';
                        }
                        f = f + response[i].content;
                        f = f + '</div></div></div>';
                        $('#mensajes').append(f);
                    }
                    i = i+1;
                });
                $('#mensajes').append('<div><td><input type="text" name="message" id="newmessage"/></td>')
                $('#mensajes').append('<input type="button" value="Send" autocomplete="off" onclick="Sendmessage('+current+','+messenger+')"/></div>')
                $('#mensajes').append('<input type="button" value="Refresh" onclick="getMessages('+current+','+messenger+')"/></div>')
            }
            else{
                $("#mensajes").empty();
                getMessages(current,messenger);
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

function delMessage(current,messaged,messageid){
    var x=JSON.stringify({
        "content" : messageid,
        "user_from_id": current,
        "user_to_id": messaged
    });
        $.ajax({
        url:'/messagesdel',
        type:'DELETE',
        data : x,
        contentType: 'application/json',
        dataType:'json',
    });
    getMessages(current,messaged)
}



function Sendmessage(current,messaged){
    var mensaje=$('#newmessage').val();
    if (mensaje!=""){
        var x=JSON.stringify({
            "content" : mensaje,
            "user_from_id": current,
            "user_to_id": messaged
        });
            $.ajax({
                url:'/messages2',
                type:'POST',
                contentType:'application/json',
                data: x,
                dataType: 'json'
        });
        getMessages(current,messaged);
    }
};

