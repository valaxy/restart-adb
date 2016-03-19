"use strict"

var os           = require('os'),
    childProcess = require('child_process')


var trim = function (str) {
	var match = str.match(/^[ \t\n\r]*([\w\W]*?)[ \t\n\r]*$/)
	return match[1]
}


module.exports = {
	/** get pid or null of the adb.exe */
	findPID: function (port, cb) {
		if (os.platform().indexOf('win') >= 0) {
			childProcess.exec('netstat -ano | findstr ' + port, function (err, stdout, stderr) {
				if (err || stderr) return cb(err || stderr)

				var lines = stdout.split(os.EOL)
				var find = false
				for (var line of lines) {
					var blocks = trim(line).split(/\s+/)
					var ipport = blocks[1]
					var status = blocks[3]
					var pid = blocks[4]
					if ((ipport == '127.0.0.1:' + port || ipport == '0.0.0.1:' + port) && status == 'LISTENING') {
						cb(null, pid)
						find = true
						break
					}
				}
				if (!find) {
					cb(null, null)
				}
			})
		} else {
			cb('Doesn\'t support unix/liunx/mac, not implemented')
		}
	},

	killPID: function (pid) {
		process.kill(pid)
	}
}
