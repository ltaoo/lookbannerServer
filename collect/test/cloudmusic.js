var expect = require('chai').expect
var request = require('request')

var module = require('../rules/cloudmusic.js')

function fetch(module) {
	return new Promise((resolve, reject) => {
	  	// 请求地址
	  	request(module.cloudmusic.url, function (err, res, body) {
	  		if(err) return reject(err)
  			module.cloudmusic.rule.call(null, body)
		  		.then(ary => {
		  			resolve(ary)
		  		})
		  		.catch(err => {
		  			reject(err)
		  		})
	  	})   	
	})
}


describe('测试采集 cloudmusic', function() {
	it('module.url 是字符串', () => {
		expect(module.cloudmusic.url).to.be.an('string')
	})

	it('module.rule 是函数', () => {
		expect(module.cloudmusic.rule).to.be.an('function')
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

	it('数组中每一个元素都为真', () => {
		// 设置超时时间
		this.timeout(15000)
		return fetch(module)
			.then(ary => {
				// 
				expect(ary).not.include(undefined)
			})
			.catch(err => {
				expect(err).to.be.an('object')
			})
	})
})