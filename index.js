var childProcess = require('child_process'),
    os           = require('os'),
    findPID      = require('./src/find-pid')


var CODE = {
	SUCCESS     : 0,
	ADB_PORT_USE: 1
}


var ADB_PORT_USE_TEXT =
	    'adb server is out of date.  killing...\n'

var ADB_PORT_USE_ERRTEXT =
	    "ADB server didn't ACK\n" +
	    '* failed to start daemon *\n' +
	    'error: unknown host service\n'


/** callback:
 **     code:
 **     stdout:
 */
var adbCheck = function (callback) {
	// use adb devices to check
	childProcess.exec('adb devices', function (err, stdout, stderr) {
		stdout = stdout.replace(new RegExp(os.EOL, 'g'), '\n') // replace \r\n or \r -> \n
		stderr = stderr.replace(new RegExp(os.EOL, 'g'), '\n')

		if (stderr && stderr == ADB_PORT_USE_ERRTEXT && stdout == ADB_PORT_USE_TEXT) {
			callback(CODE.ADB_PORT_USE, stdout)
		} else {
			callback(CODE.SUCCESS, stdout)
		}
	})
}


var killPID = function (pid) {
	console.log('ready to kill pid=%s', pid)
	process.kill(pid)
	console.log('kill pid=%s finish', pid)
}


module.exports = adbCheck


if (!module.parent) {
	var PORT = '5037'
	adbCheck(function (code) {
		if (code == CODE.SUCCESS) {
			console.log('adb work fine, no need to restart')
		} else {
			console.log('adb port %s use', PORT)
			findPID('5037', function (err, pid) {
				if (err) {
					return console.error('find pid error: ' + err)
				}

				if (pid === null) {
					console.log('dont\'t find pid, no need to kill')
					return
				}
				killPID(pid)
			})
		}
	})
}


//check(function (code) {
//	console.log(code)
//})

//findPID(function (pid) {
//	console.log(pid)
//})
