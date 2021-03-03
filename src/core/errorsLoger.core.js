"use strict"
const ErrorsLoger=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
			if(process.env.NODE_ENV==='development')
				this.morgan=dependencies.morgan('dev')
			else
			{
				const directory=dependencies.path.join(__dirname,'../../'+(process.env.NODE_LOG_PATH||''))
				const options={interval:process.env.NODE_LOG_INTERVAL||'1d',path:directory}
				dependencies.fs.access(directory,dependencies.fs.constants.F_OK,err=>
				{
					if(err)
						dependencies.fs.mkdir(directory,{recursive:true},error=>
						{
							if(error)
								throw(error)
							this.morgan=dependencies.morgan('combined',{stream:dependencies.rfs.createStream('access.log',options)})
						})
					else
						this.morgan=dependencies.morgan('combined',{stream:dependencies.rfs.createStream('access.log',options)})
				})
			}	
		}
		catch(error)
		{
			console.log(error)
			this.error=error
		}
	}
	hook=app=>
	{
		try
		{
			setTimeout(_=>
			{
				app.use(this.morgan)
			},2000)
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
module.exports=ErrorsLoger