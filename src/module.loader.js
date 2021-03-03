"use strict"
const fs=require('fs')
const path=require('path')
const getModulesPaths=(dependencies,modulesPath)=>
{
	return new Promise((resolve,reject)=>
	{
		return fs.access(modulesPath,fs.constants.F_OK,error=>
		{
			if(error)
				return reject(error)
			return fs.readdir(modulesPath,(error,files)=>
			{
				if(error)
					return reject(error)
				let paths={}
				for(let file of files)
					paths[file]=path.join(modulesPath,file)
				return resolve(paths)
			})
		})
	})
	
	
}
const ModelLoader=class
{
	error=null
	modules={}
	constructor(app,dependencies,toolbox)
	{
		const modulesPath=path.join(__dirname,'../modules')
		getModulesPaths({fs:dependencies.fs},modulesPath)
		.then(modulePaths=>
		{
			for(let moduleName in modulePaths)
			{
				this.modules[moduleName]=new (require(path.join(modulePaths[moduleName],'module.js')))(dependencies)
				this.modules[moduleName].hook(app)
			}
		})
		.catch(error=>
		{
			console.log(error)
			this.error=error
		})
	}
	getModules=_=>
	{
		return this.modules
	}
}
module.exports=ModelLoader