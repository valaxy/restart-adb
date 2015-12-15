var assert = require('assert'),
    pid    = require('../lib/pid')


describe('pid', function () {
	it('findPID()', function () {
		pid.findPID('5037', function (err, pid) {
			assert.ok(!err)
			assert.ok(pid)
		})
	})
})