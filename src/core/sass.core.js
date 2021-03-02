"use strict"
const Sass=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
			this.sass=dependencies.sassMiddleware({
				outputStyle:'compressed',
				src:dependencies.path.join(__dirname,'../../'+(process.env.SASS_SRC||'public/css')),
				dest:dependencies.path.join(__dirname,'../../'+(process.env.SASS_DEST||'public/css')),
				maxAge:parseInt(process.env.SASS_MAXAGE)||3888000,
			})
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
			app.use(this.sass)
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
module.exports=Sass



const deploy=(config,next)=>
{
	try
	{
		const options={
			outputStyle:config.sass.outputStyle||'compressed',
			src:path.join(__dirname,'../../'+config.sass.src),
			dest: path.join(__dirname,'../../'+config.sass.dest),
			maxAge:parseInt(config.sass.maxAge)||3888000,
		}
		return next(true,null,sass(options))
	}
	catch(error)
	{
		return next(false,error)
	}
}
module.exports.deploy=deploy