var childProcess = require('child_process'),
    os           = require('os'),
    code         = require('./code')

const ADB_PORT_USE_TEXT =
	      'adb server is out of date.  killing...\n'

const ADB_PORT_USE_ERRTEXT =
	      "ADB server didn't ACK\n" +
	      '* failed to start daemon *\n' +
	      'error: unknown host service\n'


/** callback:
 **     err: null if success
 **         code: compare by adbCheck.CODE
 **     stdout:
 */
var adbCheck = function (callback) {
	// use adb devices to check
	childProcess.exec('adb devices', function (err, stdout, stderr) {
		stdout = stdout.replace(new RegExp(os.EOL, 'g'), '\n') // replace \r\n or \r -> \n
		stderr = stderr.replace(new RegExp(os.EOL, 'g'), '\n')

		if (stderr && stderr == ADB_PORT_USE_ERRTEXT && stdout == ADB_PORT_USE_TEXT) {
			callback({
				code: code.ADB_PORT_USE,
				msg : 'need to kill adb daemon'
			}, {
				stdout: stdout
			})
		} else {
			callback(null, {
				stdout: stdout
			})
		}
	})
}


module.exports = adbCheck