"use strict"
const ErrorsDev=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
            this.errorhandler=dependencies.errorhandler
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
            const env=process.env.NODE_ENV||'production'
            if(env=='development')
			    app.use(this.errorhandler())
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
module.exports=ErrorsDev