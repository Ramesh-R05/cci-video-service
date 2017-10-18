import request from 'request';

export function q(option) {
	return new Promise((resolve, reject)=> {
		request(option,(err, res, body) => {
			if(err) return reject({status: 'err', msg: res});
			if(res.statusCode > 302) return reject({status: res.statusCode, msg: res});
			resolve(res);
		})
	})
}
