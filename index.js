var adbCheck = require('./lib/adb-check'),
    pid      = require('./lib/pid'),
    code     = require('./lib/code')

var PORT = '5037'

adbCheck(function (err) {
	if (!err) {
		console.info('adb work fine, no need to restart')
	} else {
		console.info('adb port %s use, killing', PORT)
		pid.findPID('5037', function (err, pid) {
			if (err) return console.error('find pid error: ' + err)
			if (pid === null) return console.info('dont\'t find pid, no need to kill')

			pid.killPID(pid)
			console.info('kill pid=%s finish', pid)
		})
	}
})
