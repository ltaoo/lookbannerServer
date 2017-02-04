require('babel-core/register')

var expect = require('chai').expect
var request = require('request')

var module = require('../rules/mogujie.js')

function fetch(module) {
	return new Promise((resolve, reject) => {
	  	// 请求地址
	  	request(module.mogujie.url, function (err, res, body) {
	  		if(err) return reject(err)
  			module.mogujie.rule.call(null, body)
		  		.then(ary => {
		  			resolve(ary)
		  		})
		  		.catch(err => {
		  			reject(err)
		  		})
	  	})   	
	})
}


describe('测试采集 mogujie', function() {
	it('module.url 是字符串', () => {
		expect(module.mogujie.url).to.be.an('string')
	})

	it('module.rule 是函数', () => {
		expect(module.mogujie.rule).to.be.an('function')
	})

	it('结果应该是数组', function() {
		this.timeout(100000)	
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
		this.timeout(100000)
		return fetch(module)
			.then(ary => {
				// 
				expect(ary).to.not.include.members([undefined])
			})
			.catch(err => {
				expect(err).to.be.an('object')
			})
	})
})