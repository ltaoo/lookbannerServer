require('babel-core/register')

var expect = require('chai').expect
var request = require('request')

function fetch(module, name) {
	return new Promise((resolve, reject) => {
	  	// 请求地址
	  	request(module[name].url, function (err, res, body) {
	  		if(err) return reject(err)
  			module[name].rule.call(null, body)
		  		.then(ary => {
		  			resolve(ary)
		  		})
		  		.catch(err => {
		  			reject(err)
		  		})
	  	})   	
	})
}

module.exports = function test(name) {
	var module = require('../rules/' + name)
	describe(`测试采集 ${name}`, function() {
		it('module.url 是字符串', () => {
			expect(module[name].url).to.be.an('string')
		})

		it('module.rule 是函数', () => {
			expect(module[name].rule).to.be.an('function')
		})

		it('返回数组', function() {
			this.timeout(100000)	
			return fetch(module, name)
				.then(ary => {
					expect(ary).to.be.an('array')
				})
				.catch(err => {
					expect(err).to.be.an('object')
				})
		})

		it('返回的数组不为空', () => {
			this.timeout(100000)	
			return fetch(module, name)
				.then(ary => {
					expect(ary.length).be.above(0)
				})
				.catch(err => {
					expect(err).to.be.an('object')
				})
		})

		it('数组中每一个元素都为真', () => {
			// 设置超时时间
			this.timeout(1000000)
			return fetch(module, name)
				.then(ary => {
					// 
					expect(ary).to.not.include.members([undefined])
				})
				.catch(err => {
					expect(err).to.be.an('object')
				})
		})
	})
}


