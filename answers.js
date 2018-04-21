const request = require('request')
const api = 'localhost:3001'

module.exports = [
	{
		reg: /(.)*/g,
		func: () => {
			return (process) => {
				console.log("Извините, такая команда отсуствует\nНужна помощь? Введите 'Помощь'")
				process({type: 'message', text: "Извините, такая команда отсуствует\nНужна помощь? Введите 'Помощь'"})
			}			
		}
	}, {
		reg: /(((Пополнить)|(зачислить (деньги )?на )) счёт)|(\d+)/ig,
		func: (parse) => {
			return (process) => {
				console.log(`Пополнение счёта ${parse[1]}`)
				process({type: 'form', title: 'Введите сумму', card: parse[1]})
			}			
		}
	}, {
		reg: /((Список )?карт(ы)?)/ig,
		func: () => {
			return (process) => {
				request(`http://${api}/card/card.json/?id=7`, function (error, response, body) {
		  			console.log(`Список карт: ${body}`)
		  			const arr = JSON.parse(body)
		  			process({type: 'message', text: '<b>Список карт:</b>\n' + arr.join(', ')})
				})
			}
		}
	}, {
		reg: /(Подключить ((SMS)|(СМС)) уведомления (\d+)?)/ig,
		func: (parse) => {
			const number = parse[0].match(/\d+/g)
			return(process) => {
				if (number){
					process({type: 'message', text: "Уведомления подключены для номера ${number}"})
					console.log("Уведомления подключены для номера " + number)
				} else {
					console.log("На какой номер подключить уведомления?")
				}
			}
		}
	}, {
		reg: /((.)*Услуг(и)?)/ig,
		func: (parse) => {
			return(process) => {
				console.log("Доступные услуги:\nАвтотрекинг, E-mail рассылка, Приобретение транспортных карт")
				process({type: 'message', text: "<b>Доступные услуги:</b>\nАвтотрекинг, E-mail рассылка, Приобретение транспортных карт"})
			}
		}
	}, {
		reg: /(Техподдержка)|(Живой чат)/ig,
		func: (parse) => {
			return (process) => {
				console.log("Сотрудник подключен")
				process({type: 'support'})
			}
		}
	}, {
		reg: /(Баланс)|((Сколько )?(оста((лось)|(ток)) )?средств(а)?)(на счету)?/ig,
		func: (parse) => {
			return (process) => {
				request(`http://${api}/balance/balance.json/?id=7`, function (error, response, body) {
		  			console.log(`Ваш баланс: ${body} рублей`)
		  			process({type: 'message', text: `Ваш баланс: ${body} рублей`})
				})
			}
		}
	}, {
		reg: /(Баланс карты \d+)/ig,
		func: (parse) => {
			const number = parse.match(/\d+/g)
			return (process) => {
				request(`http://${api}/card/show.json/?card_number=${parse[1]}`, function (error, response, body) {
		  			console.log(`Баланс данной карты: ${body} рублей`)
		  			process(body)
				})
			}
		}
	}
]