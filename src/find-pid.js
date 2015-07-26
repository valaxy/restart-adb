var os           = require('os'),
    childProcess = require('child_process')


var trim = function (str) {
	var match = str.match(/^[ \t\n\r]*([\w\W]*?)[ \t\n\r]*$/)
	return match[1]
}


// get pid or null of the adb.exe
var findPID = function (port, cb) {
	if (os.platform().indexOf('win') >= 0) {
		childProcess.exec('netstat -ano | findstr ' + port, function (err, stdout, stderr) {
			if (err) {
				return cb(err)
			}

			var lines = stdout.split(os.EOL)
			var find = false
			lines.forEach(function (line) {
				var blocks = trim(line).split(/\s+/)
				var ipport = blocks[1]
				var status = blocks[3]
				var pid = blocks[4]
				if (ipport == '127.0.0.1:' + port && status == 'LISTENING') {
					cb(null, pid)
					return find = true
				}
			})
			if (!find) {
				cb(null, null)
			}
		})
	} else {
		cb('Doesn\'t support unix/liunx/mac, not implemented')
	}
}


module.exports = findPID


if (!module.parent) {
	findPID('5037', function (err, pid) {
		console.log(err, pid)
	})
}
