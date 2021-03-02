"use strict"
const Storage=class
{
	error=null
	constructor(dependencies)
	{
		try
		{
			let storage=dependencies.multer.diskStorage({
				destination:(req,file,next)=>
				{
					next(null,dependencies.path.join(__dirname,'../../'+(process.env.SASS_SRC||'public/upload')))
				},
				filename:(req,file,next)=>
				{
					const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
					next(null,file.fieldname+'-'+uniqueSuffix)
				}
			})
			this.multer=dependencies.multer({storage:storage})
		}
		catch(error)
		{
			this.error=error
		}
	}
	getUpload=_=>
	{
		return this.multer
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
			next(this.error)
		return this
	}
}
module.exports=Storage