"use strict"
const ModelFactory=require('./model.factory')
const ControllerFactory=require('./controller.factory')
const RouterFactory=require('./router.factory')

const modelFactory=(dependencies,structure,behaviours,moduleName)=>
{
    return _=>
    {
        return new ModelFactory(
            {
                mongoose:dependencies.mongoose,
                bcrypt:dependencies.bcrypt,
                autopopulate:dependencies.autopopulate
            },
            structure,
            behaviours,
            moduleName
        )
    }
}
const controllerFactory=(dependencies,toolbox,behaviours)=>
{
    return model=>
    {
        return new ControllerFactory(
            {
                bcrypt:dependencies.bcrypt,
                jwt:dependencies.jwt,
                path:dependencies.path,
                sharp:dependencies.sharp
            },
            toolbox,
            behaviours,
            model
        )
    }
}
const routerFactory=(dependencies,toolbox,behaviours,moduleName)=>
{
    return (controller,model)=>
    {
        return new RouterFactory(
            {
                moduleName:moduleName,
                express:dependencies.express
            },
            toolbox,
            behaviours,
            moduleName,
            controller,
            model
        )
    }
}
const moduleFactory=class
{
    error=null
    constructor(dependencies,toolbox,structure,behaviours,moduleName)
    {
        try
        {
            const state=
            {
                bcrypt:dependencies.bcrypt,
                jwt:dependencies.jwt,
                mongoose:dependencies.mongoose,
                autopopulate:dependencies.autopopulate,
                express:dependencies.express
            }
            this.modelFactory=modelFactory(dependencies,structure,behaviours,moduleName),
            this.controllerFactory=controllerFactory(dependencies,toolbox,behaviours),
            this.routerFactory=routerFactory(dependencies,toolbox,behaviours,moduleName)
        }
        catch(error)
        {
            this.error=error
        }
    }
    createModel=next=>
    {
        try
        {
            if(this.error)
                throw   masterError
            this.model=this.modelFactory()
            next(this.model)
        }
        catch(error)
        {
            this.error=error
        }
        return this
    }
    createController=next=>
    {
        try
        {
            if(this.error)
                throw this.error
            this.controller=this.controllerFactory(this.model)
            next(this.controller)
        }
        catch(error)
        {
            this.error=error
        }
        return this
    }
    createRouter=next=>
    {
        try
        {
            if(this.error)
                throw this.error
            this.router=this.routerFactory(this.controller,this.model)
            next(this.router)
        }
        catch(error)
        {
            this.error=error
        }
        return this
    }
    getRouter=next=>
    {
        try
        {
            if(this.error)
                throw this.error
            next(this.router.getRouter())
        }
        catch(error)
        {
            this.error=error
        }
        return this
    }
    hook=app=>
    {
        try
        {
            app.use(this.router.getRouter())
            return this
        }
        catch(error)
        {
            this.error=error
        }
    }
    catch=next=>
    {
        if(this.error)
            return next(this.error)
        return true
    }
}
module.exports=moduleFactory