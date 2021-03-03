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
					const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
					const d=(new Date()).toLocaleDateString().split('/')
					const p=dependencies.path.join(__dirname,'../../',process.env.MULTER_UPLOAD||'public/upload',d[2],d[1],d[0],uniqueSuffix)
					dependencies.fs.mkdirSync(p,{recursive:true})
					next(null,p)
				},
				filename:(req,file,next)=>
				{
					const type=file.originalname.split('.').reverse()[0]
					next(null,`original.${type}`)
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