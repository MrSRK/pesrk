"use strict"
const Cookie=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
			this.cookieParser=dependencies.cookieParser(
				process.env.COOKIE_SECRET||'',
				{
					sameSite:true,
					secure:true,
					maxAge:parseInt(process.env.COOKIE_AGE||604800000)
				}
			)
		}
		catch(error)
		{
			this.error=error
		}
	}
	hook=app=>
	{
		try
		{
			app.use(this.cookieParser)
		}
		catch(error)
		{
			this.error=error
		}
		return this
	}
	after=next=>
	{
		if(!this.error)
			next()
		return this
	}
	catch=next=>
	{
		if(this.error)
			return next(this.error)
	}
}
module.exports=Cookie