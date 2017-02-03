var expect = require('chai').expect

describe('mocha 测试用例', function() {
	it('值类型', () => {
		expect('ltaoo').to.be.an('string')
	})

	it('是否包含某个元素', () => {
		expect([undefined, '123', 1]).to.include.members([undefined])
	})

	it('不包含某个元素', () => {
		expect(['123', 1]).to.not.include.members([undefined])
	})
})