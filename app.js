var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const session = require('express-session')
const bodyParser = require('body-parser')
const cr = require('./context-recognizer')
let rec = new cr()

app.use(session({secret: 'chatSecret'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let user_session

// Обработчик сообщения для бота
app.post('/message', function(req, res) {
  	// Сохранение сессии
	user_session = req.session

	// Сохранение контекста 
	if (user_session.context){
		user_session.context.push(req.body.text)
	} else {
		user_session.context = [req.body.text]
	}

	console.log(req.body)

	// Распознание команды ботом
	let func = rec.recognize(user_session.context)
	res.setHeader('Access-Control-Allow-Origin', '*');
	func((response) => res.send(response))	 	
})

// Обработчик сообщения для поддержки
io.on('connection', function(socket){
  socket.on('chat message', function(msg, sender){
    io.emit('chat message', msg, sender)
  })
})

// Прослушивание порта
http.listen(3000, () => {
	console.log("Server started!")
})
