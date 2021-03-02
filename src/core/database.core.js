"use strict"
const Database=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
			dependencies.jsonschema(dependencies.mongoose)
			dependencies.mongoose.connect(process.env.MONGO_URI,{
				useNewUrlParser:true,
				useUnifiedTopology:true,
				useFindAndModify:false,
				useCreateIndex:true
			})
		}
		catch(error)
		{
			this.error=error
		}
	}
	hook=app=>
	{
		// Nothing to hook
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
module.exports=Database