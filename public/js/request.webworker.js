"use strict"
const jober=new Jober()
onmessage=event=>
{
	jober
	.assine(event.data.job,event.data.payload)
	.then(resp=>
	{
		postMessage(resp)
	})
	.catch(resp=>
	{
		postMessage(resp)
	})
}
const Jober=class
{
	constructor()
	{

	}
	assine=(job,payload)=>
	{
		return new Promise((resolve,reject)=>
		{
			try
			{
				if(typeof job!='string')
					throw new Error('Unknown job format (need string)')
				if(typeof payload!='object')
					throw new Error('Unknown payload format (need object)')
				switch(job)
				{
					case 'request':
						this.job_request(payload||{})
						.then(resp=>
						{
							return resolve(this.post_message(resp))
						})
						.catch(error=>
						{
							return reject(this.post_error(error))
						})
						break
					default:
						throw new Error(`Unkown job (${job})`)
				}
			}
			catch(error)
			{
				return reject(this.post_error(error))
			}	
		})
	}
	post_message(resp)
	{
		return JSON.stringify({
			status:true,
			error:false,
			doc:resp
		})
	}
	post_error(error)
	{
		return JSON.stringify({
			status:true,
			error:error,
			doc:null
		})
	}
	job_request(payload)
	{
		new Promise((resolve,reject)=>
		{
			try
			{
				if(!payload.url||typeof payload.url!='string')
					throw new Error('Unknow request url')
				if(!payload.type)
					payload.params='get'
				else if(typeof payload.params!='string')
				if(!payload.params)
					payload.params={}
				else if(typeof payload.params!='object')
					throw new Error('Unknow request url params')
				if(!payload.body)
					payload.body={}
				else if(typeof payload.body!='object')
					throw new Error('Unknow request body')
				if(!payload.headers)
					payload.headers={}
				else if(typeof payload.headers!='object')
					throw new Error('Unknow request headers')
				const url=payload.url
				const params=payload.params
				const body=payload.body
				const headers=payload.headers
				const http=new XMLHttpRequest()
				let query=[]
				for(let key in params)
					query.push(`${key}=${JSON.stringify(params[key])}`)
				if(query.length>0)
					url=`${url}?${query.join('&')}`
				http.open(type,url,true)
				for(let key in headers)
					http.setRequestHeader(key,headers[key])
				http.send(JSON.stringify(body))
				return http.onreadystatechange=event=>
				{
					try
					{
						if(http.readyState==4)
							return resolve(null,JSON.parse(http.responseText))
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
}