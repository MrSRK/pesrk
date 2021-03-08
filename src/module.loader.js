"use strict"
/**
 * 
 * @param {object} dependencies 
 * @param {string} modulesPath 
 * @returns {object} Module paths / Modules Directories at <modeles> Directory
 */
const getModulesPaths=async(dependencies,modulesPath)=>
{
	return new Promise((resolve,reject)=>
	{
		return dependencies.fs.access(modulesPath,dependencies.fs.constants.F_OK,error=>
		{
			if(error)
				return reject(error)
			return dependencies.fs.readdir(modulesPath,(error,files)=>
			{
				if(error)
					return reject(error)
				let paths={}
				for(let file of files)
					paths[file]=dependencies.path.join(modulesPath,file)
				return resolve(paths)
			})
		})
	})
}
/**
 * 
 * @param {object} app express object 
 * @param {object} dependencies 
 * @param {object} toolbox 
 */
const ModelLoader=class
{
	error=null
	modules={}
	/**
	 * 
	 * @param {object} app express object 
	 * @param {object} dependencies 
	 * @param {object} toolbox 
	 */
	constructor(app,dependencies,toolbox)
	{
		const modulesPath=dependencies.path.join(__dirname,'../modules')
		getModulesPaths({fs:dependencies.fs,path:dependencies.path},modulesPath)
		.then(modulePaths=>
		{
			for(let moduleName in modulePaths)
			{
				this.modules[moduleName]=new (require(dependencies.path.join(modulePaths[moduleName],'module.js')))(dependencies,toolbox)
				this.modules[moduleName].hook(app)
			}
			app.get('/template/:template.:mod.html',(req,res)=>
			{
				return res.render(`template/${req.params.template}.${req.params.mod}.pug`,{
					m:req.query.m||null,
					f:req.query.f||null,
					i:req.query.i||null,
					t:req.query.t||null
				})
			})
			/**
			 * Hook to app the api default message "Unknown Request" (Error 404)
			 */
			app.all('/api*',(req,res)=>
			{
				return res.status(404).json({status:false,message:'Unknown Request'})
			})
			/**
			 * Hook to app all the default pages
			 */
			app.get('/',(req,res)=>
			{
				return res.render('home',{
					m:null,
					f:null,
					i:null,
					t:'default'
				})
			})
			app.all('*',(req,res)=>
			{
				return res.status(404).render('404',{
					m:null,
					f:null,
					i:null,
					t:'default'
				})
			})
		})
		.catch(error=>
		{
			this.error=error
		})
	}
	/**
	 * 
	 * @returns {object} All the loaded objects
	 */
	getModules=_=>
	{
		return this.modules
	}
}
module.exports=ModelLoader