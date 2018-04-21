const answers = require('./answers')

let ContextRecognizer = function () {
	this.recognize = function(context) {
		// Текущая команда
		command = context[context.length - 1]
		let parse = []

		// Подбор регулярного выражения для команды
		for (let i = answers.length - 1; i >= 0; i--) {
			// Проверка на соответствие регулярному выражению
			parse = command.match(answers[i].reg)
			if (parse) {
				// Вызов соотвествующей функции в случае совпадения
				return (response) => answers[i].func(parse)(response)
				break
			}
		}
	}
}

module.exports = ContextRecognizer