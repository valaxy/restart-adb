var childProcess = require('child_process'),
    os           = require('os')


var CODE = {
	SUCCESS     : 0,
	ADB_PORT_USE: 1
}

var trim = function (str) {
	var match = str.match(/^[ \t\n\r]*([\w\W]*?)[ \t\n\r]*$/)
	return match[1]
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


// get pid or -1
// only works in windows
var findPID = function (callback) {
	childProcess.exec('netstat -ano | findstr "5037"', function (err, stdout, stderr) {
		var lines = stdout.split(os.EOL)
		var find = false
		lines.forEach(function (line) {
			var blocks = trim(line).split(/\s+/)
			var ipport = blocks[1]
			var status = blocks[3]
			var pid = blocks[4]
			if (ipport == '127.0.0.1:5037' && status == 'LISTENING') {
				callback(pid)
				find = true
				return
			}
		})
		if (!find) {
			callback(-1)
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
	adbCheck(function (code) {
		if (code == CODE.SUCCESS) {
			console.log('adb work fine, no need to restart')
		} else {
			console.log('adb port use')
			findPID(function (pid) {
				if (pid == -1) {
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
