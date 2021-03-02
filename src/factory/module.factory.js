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
                mongoose:dependencies.mongoose
            },
            structure,
            behaviours,
            moduleName
        )
    }
}
const controllerFactory=(dependencies,behaviours)=>
{
    return model=>
    {
        return new ControllerFactory(
            {
                bcrypt:dependencies.bcrypt,
                jwt:dependencies.jwt
            },
            behaviours,
            model
        )
    }
}
const routerFactory=(dependencies,behaviours,moduleName)=>
{
    return controller=>
    {
        return new RouterFactory(
            {
                moduleName:moduleName,
                express:dependencies.express
            },
            behaviours,
            moduleName,
            controller
        )
    }
}
const moduleFactory=class
{
    masterError=null
    constructor(dependencies,structure,behaviours,moduleName)
    {
        try
        {
            const state=
            {
                crypt:dependencies.bcrypt,
                jwt:dependencies.jwt,
                mongoose:dependencies.mongoose,
                express:dependencies.express
            }
            this.modelFactory=modelFactory(dependencies,structure,behaviours,moduleName),
            this.controllerFactory=controllerFactory(dependencies,behaviours),
            this.routerFactory=routerFactory(dependencies,behaviours,moduleName)
        }
        catch(error)
        {
            this.masterError=error
        }
    }
    createModel=next=>
    {
        try
        {
            if(this.masterError)
                throw   masterError
            this.model=this.modelFactory()
            next(this.model)
        }
        catch(error)
        {
            this.masterError=error
        }
        return this
    }
    createController=next=>
    {
        try
        {
            if(this.masterError)
                throw this.masterError
            this.controller=this.controllerFactory(this.model)
            next(this.controller)
        }
        catch(error)
        {
            this.masterError=error
        }
        return this
    }
    createRouter=next=>
    {
        try
        {
            if(this.masterError)
                throw this.masterError
            this.router=this.routerFactory(this.controller)
            next(this.router)
        }
        catch(error)
        {
            this.masterError=error
        }
        return this
    }
    getRouter=next=>
    {
        try
        {
            if(this.masterError)
                throw this.masterError
            next(this.router.getRouter())
        }
        catch(error)
        {
            this.masterError=error
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
            this.masterError=error
        }
    }
    catch=next=>
    {
        if(this.masterError)
            return next(this.masterError)
        return true
    }
}
module.exports=moduleFactory