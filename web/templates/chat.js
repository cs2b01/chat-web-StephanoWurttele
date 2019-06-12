
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
                            console.log("uwu");
                            f = f + '<div class="recibido col row s2">';
                            console.log(f)
                        }
                        else{
                            console.log("owo");
                            f = f + '<div class= "mensaje col row s2 right">';
                            console.log(f);
                        }
                        f = f + response[i].content;
                        f = f + '</div></div></div>';
                        console.log(f);
                        $('#mensajes').append(f);
                    }
                    i = i+1;
                });
                $('#mensajes').append('<div><td><input type="text" name="message" id="message"/></td>')
                $('#mensajes').append('<input type="button" value="Send" onclick="Sendmessage()"/></div>')
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


function Sendmessage(){
    var url = "http://127.0.0.1:8080/messages";
    var x={ dataSource: DevExpress.data.AspNet.createStore({
        key:"id",
        insertUrl:url,
        url:'/messages',
        type:'POST',
        contentType: 'application/json',
        dataType:'json',
        onBeforeSend: function(method, ajaxOptions) {
            ajaxOptions.xhrFields = { withCredentials: true };
        }
    }),
    editing:{
        allowAdding:true
    },
    columns: [{
        dataField: "id",
        dataType: "number",
        allowEditing: false
    }, {
        dataField: "content"
    }, {
        dataField: "sent_on",
        allowEditing:false
    }, {
        dataField: "user_from.username",
        
    }, {
        dataField: "user_to.username",
    },]
};
    $.ajax({
        success: function(response){
            console.log($('#message'))
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

