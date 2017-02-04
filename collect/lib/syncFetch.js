import request from 'request'

export default function fetch(url) {
	return new Promise((resolve, reject) => {
		request(url, (err, res, body) => {
			if(err) return reject(err)

			resolve(body)
		})
	})
}