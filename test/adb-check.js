var assert   = require('assert'),
    adbCheck = require('../lib/adb-check')


describe('adbCheck()', function () {
	//
	// need clean adb port before test
	//
	it('case1', function (done) {
		adbCheck(function (err, data) {
			assert.equal(err, null)
			assert.ok(data)
			done()
		})
	})
})