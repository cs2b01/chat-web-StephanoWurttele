from flask import Flask,render_template, request, session, Response, redirect
from database import connector
from model import entities
import json
import time

db = connector.Manager()
engine = db.createEngine()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<content>')
def static_content(content):
    return render_template(content)





@app.route('/messages', methods = ['GET'])
def get_messages():
    session = db.getSession(engine)
    dbResponse = session.query(entities.Message)
    data = []
    for message in dbResponse:
        data.append(message)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype='application/json')

@app.route('/messages/<id>', methods = ['GET'])
def get_message(id):
    db_session = db.getSession(engine)
    messages = db_session.query(entities.Message).filter(entities.Message.id == id)
    for message in messages:
        js = json.dumps(message, cls=connector.AlchemyEncoder)
        return  Response(js, status=200, mimetype='application/json')

    message = { 'status': 404, 'message': 'Not Found'}
    return Response(message, status=404, mimetype='application/json')


@app.route('/messages', methods = ['POST'])
def create_ ():
        c =  json.loads(request.form['values'])
        message = entities.Message(
            content=c['content'],
            user_from_id=c['user_from']['username']['id'],
            user_to_id=c['user_to']['username']['id']
            )
        print(message.user_from)
        print(message.user_from_id)
        session = db.getSession(engine)
        session.add(message)
        session.commit()
        return 'Created Message'

@app.route('/messages2', methods = ['POST'])
def create_messages ():
        c =  json.loads(request.data)
        message = entities.Message(
            content=c['content'],
            user_from_id=c['user_from_id'],
            user_to_id=c['user_to_id']
            )
        session = db.getSession(engine)
        session.add(message)
        session.commit()
        return 'Created Message'

@app.route('/messages', methods = ['PUT'])
def update_message():
        session = db.getSession(engine)
        id = request.form['key']
        message = session.query(entities.Message).filter(entities.Message.id == id).first()
        c =  json.loads(request.form['values'])
        for key in c.keys():
            setattr(message, key, c[key])
        session.add(message)
        session.commit()
        return 'Updated Message Form'



@app.route('/messages', methods = ['DELETE'])
def delete_message():
        id = request.form['key']
        session = db.getSession(engine)
        messages = session.query(entities.Message).filter(entities.Message.id == id).one()
        session.delete(messages)
        session.commit()
        return "Deleted Message"


@app.route('/messagesdel', methods = ['DELETE'])
def delete_message2():
        id = json.loads(request.data)
        print("id recibido es")
        print(id)
        print(id['content'])
        session = db.getSession(engine)
        messages = session.query(entities.Message).filter(entities.Message.id == id['content']).first()
        print(messages)
        session.delete(messages)
        session.commit()
        return "Deleted Message"


############################################################


############################################################



@app.route('/users', methods = ['GET'])
def get_users():
    session = db.getSession(engine)
    dbResponse = session.query(entities.User)
    data = []
    for user in dbResponse:
        data.append(user)
    return Response(json.dumps(data, cls=connector.AlchemyEncoder), mimetype='application/json')

@app.route('/users/<id>', methods = ['GET'])
def get_user(id):   
    db_session = db.getSession(engine)
    users = db_session.query(entities.User).filter(entities.User.id == id)
    for user in users:
        js = json.dumps(user, cls=connector.AlchemyEncoder)
        return  Response(js, status=200, mimetype='application/json')

    message = { 'status': 404, 'message': 'Not Found'}
    return Response(message, status=404, mimetype='application/json')



@app.route('/users', methods = ['POST'])
def create_user():
        c =  json.loads(request.form['values'])
        user = entities.User(
            username=c['username'],
            name=c['name'],
            fullname=c['fullname'],
            password=c['password']
            )
        session = db.getSession(engine)
        session.add(user)
        session.commit()
        return 'Created User'


@app.route('/users', methods = ['PUT'])
def update_user():
        session = db.getSession(engine)
        id = request.form['key']
        user = session.query(entities.User).filter(entities.User.id == id).first()
        c =  json.loads(request.form['values'])
        for key in c.keys():
            setattr(user, key, c[key])
        session.add(user)
        session.commit()
        return 'Updated User'


@app.route('/users', methods = ['DELETE'])
def delete_user():
        id = request.form['key']
        session = db.getSession(engine)
        messages = session.query(entities.User).filter(entities.User.id == id).one()
        session.delete(messages)
        session.commit()
        return "Deleted Message"

############################################################


############################################################


@app.route('/authenticate',methods=['POST'])
def authenticate():
    time.sleep(2)
    #1. Get data from request
    message = json.loads(request.data)
    username=message['username']
    password=message['password']
    #2. Get user from database
    db_session=db.getSession(engine)
    #users=db_session.query(entities.User.username)

    #3. Search the user in collection (not efficient) :c

    #for user in users:
    #    if (user.username == username and user.password == password):
    #        return render_template("success.html")
    #return render_template("fail.html")
    
    #1.2. Again, but more efficient (from engine call)
    try:
        user=db_session.query(entities.User
            ).filter(entities.User.username==username
            ).filter(entities.User.password==password
            ).one()
        session['logged_user'] = user.id
        message={'message':'Authorized'}
        return Response(message,status=200,mimetype='application/json')
    except Exception:
        message={'message':'Unauthorized'}
        return Response(message,status=401,mimetype='application/json')

@app.route('/current')
def current():
    db_session = db.getSession(engine)
    user = db_session.query(entities.User).filter(
        entities.User.id == session['logged_user']
        ).first()
    return Response(json.dumps(user,cls=connector.AlchemyEncoder),
    mimetype='application/json'
    )


if __name__ == '__main__':
    app.secret_key = ".."
    app.run(port=8080, threaded=True, host=('127.0.0.1'))