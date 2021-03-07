"use strict"
angular.module('http-worker',['ng'])
.provider('$whttp',[function $whttp()
{
	/**
	 * 
	 * @param {string} url 
	 * @param {object} [params] 
	 * @param {object} [headers] 
	 * @returns {Promise<object>} 
	 */
	const worker_delete=(url,params,headers)=>
	{
		return new Promise((resolve,reject)=>
		{
			return worker_request({
				type:'delete',
				url:url,
				params:params,
				headers:headers
			})
			.then(resp=>
			{
				return resolve(resp)
			})
			.catch(error=>
			{
				return reject(error)
			})
		})
	}
	/**
	 * 
	 * @param {string} url 
	 * @param {object} body 
	 * @param {object} [headers] 
	 * @returns {Promise<object>} 
	 */
	const worker_patch=(url,body,headers)=>
	{
		return new Promise((resolve,reject)=>
		{
			return worker_request({
				type:'patch',
				url:url,
				body:body,
				headers:headers
			})
			.then(resp=>
			{
				return resolve(resp)
			})
			.catch(error=>
			{
				return reject(error)
			})
		})
	}
	/**
	 * 
	 * @param {string} url 
	 * @param {object} body 
	 * @param {object} [headers] 
	 * @returns {Promise<object>} 
	 */
	const worker_put=(url,body,headers)=>
	{
		return new Promise((resolve,reject)=>
		{
			return worker_request({
				type:'put',
				url:url,
				body:body,
				headers:headers
			})
			.then(resp=>
			{
				return resolve(resp)
			})
			.catch(error=>
			{
				return reject(error)
			})
		})
	}
	/**
	 * 
	 * @param {string} url 
	 * @param {object} body
	 * @param {object} [headers] 
	 * @returns {Promise<object>} 
	 */
	const worker_post=(url,body,headers)=>
	{
		return new Promise((resolve,reject)=>
		{
			return worker_request({
				type:'post',
				url:url,
				body:body,
			})
			.then(resp=>
			{
				return resolve(resp)
			})
			.catch(error=>
			{
				return reject(error)
			})
		})
	}
	/**
	 * 
	 * @param {string} url 
	 * @param {object} [params] 
	 * @param {object} [headers] 
	 * @returns {Promise<object>} 
	 */
	const worker_get=(url,params,headers)=>
	{
		return new Promise((resolve,reject)=>
		{
			return worker_request({
				type:'get',
				url:url,
				params:params,
				headers:headers
			})
			.then(resp=>
			{
				return resolve(resp)
			})
			.catch(error=>
			{
				return reject(error)
			})
		})
	}
	/**
	 * 
	 * @param {object} payload
	 * @returns {Promise<object>} 
	 */
	const worker_request=(payload)=>
	{
		return new Promise((resolve,reject)=>
		{
			try
			{
				const worker=new Worker('/js/request.webworker.js')
				worker.postMessage({
					job:'request',
					payload:payload
				})
				return worker.onmessage=message=>
				{
					try
					{
						worker.terminate()
						return worker_response(message)
						.then(data=>
						{
							return resolve(data)
						})
						.catch(error=>
						{
							return reject(error)
						})
					}
					catch(error)
					{
						return reject(error)
					}
				}
			}
			catch(error)
			{
				return reject(error)
			}
		})
	}
	const worker_response=response=>
	{
		return new Promise((resolve,reject)=>
		{
			try
			{
				if(!response.data)
					throw new Error('payload emty')
				const json=JSON.parse(response.data)
				if(json.error)
					throw new Error(json.error)
				delete json.error
				return resolve({
					status:json.status,
					doc:json.doc
				})
			}
			catch(error)
			{
				return reject(error)
			}
		})
	}
	this.$get=[_=>
	{
		return{
			request:worker_request,
			get:worker_get,
			put:worker_put,
			post:worker_post,
			patch:worker_patch,
			delete:worker_delete
		}
	}]
}])