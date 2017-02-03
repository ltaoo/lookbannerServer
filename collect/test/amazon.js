var expect = require('chai').expect
var request = require('request')

var module = require('../rules/amazon.js')

function fetch(module) {
	return new Promise((resolve, reject) => {
	  	// 请求地址
	  	request(module.amazon.url, function (err, res, body) {
	  		if(err) return reject(err)
  			module.amazon.rule.call(null, body)
		  		.then(ary => {
		  			resolve(ary)
		  		})
		  		.catch(err => {
		  			reject(err)
		  		})
	  	})   	
	})
}


describe('测试采集 amazon', function() {
	it('module.url 是字符串', () => {
		expect(module.amazon.url).to.be.an('string')
	})

	it('module.rule 是函数', () => {
		expect(module.amazon.rule).to.be.an('function')
	})

	it('结果应该是数组', function() {
		this.timeout(15000)	
		return fetch(module)
			.then(ary => {
				expect(ary).to.be.an('array')
			})
			.catch(err => {
				expect(err).to.be.an('object')
			})
	})
})