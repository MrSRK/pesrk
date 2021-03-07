"use strict"
const Jober=class
{
	constructor()
	{

	}
	assineJob=(job,payload,next)=>
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
						return next(null,jober.post_message(resp))
					})
					.catch(error=>
					{
						return next(jober.post_error(error))
					})
					break
				default:
					throw new Error(`Unkown job (${job})`)
			}
		}
		catch(error)
		{
			return next(jober.post_error(error))
		}
	}
	post_message=resp=>
	{
		return JSON.stringify({
			status:true,
			error:false,
			doc:resp
		})
	}
	post_error=error=>
	{
		return JSON.stringify({
			status:false,
			error:error.message,
			doc:null
		})
	}
	job_request=payload=>
	{
		return new Promise((resolve,reject)=>
		{
			try
			{
				if(!payload.url||typeof payload.url!='string')
					throw new Error('Unknow request url')
				if(!payload.type)
					payload.type='get'
				else if(typeof payload.type!='string')
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
				let url=payload.url
				const params=payload.params
				const body=payload.body
				const headers=payload.headers
				const type=payload.type
				const http=new XMLHttpRequest()
				let query=[]
				for(let key in params)
					query.push(`${key}=${JSON.stringify(params[key])}`)
				if(query.length>0)
					url=`${url}?${query.join('&')}`

				headers['Accept']='application/json,text/plain,*/*'
				headers['Content-Type']='application/json;charset=utf-8'

				http.open(type,url,true)
				for(let key in headers)
					http.setRequestHeader(key,headers[key])
				http.send(JSON.stringify(body))
				return http.onreadystatechange=event=>
				{
					try
					{
						if(http.readyState==4)
							return resolve(JSON.parse(http.responseText))
					}
					catch(error)
					{
						console.log(error)
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
const jober=new Jober()
onmessage=event=>
{
	jober
	.assineJob(event.data.job,event.data.payload,(error,data)=>
	{
		if(error)
			return postMessage(error)
		return postMessage(data)
	})
}