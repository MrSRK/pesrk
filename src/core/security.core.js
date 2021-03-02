"use strict"
const Security=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
      		this.helmet=dependencies.helmet()
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
			app.use(this.helmet)
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
module.exports=Security





const deploy=(config,next)=>
{
	try
	{
	  const options=config.lusca||{}
      return next(true,null,lusca(options))
    }
	catch(error)
	{
		return next(false,error)
	}
}
module.exports.deploy=deploy