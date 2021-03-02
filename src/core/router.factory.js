"use strict"
const getter=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return {
        hook:router=>
        {
            router.get(`/api/${moduleName}/`,controller.get.api)
            router.post(`/api/${moduleName}/`,controller.get.api)
            router.get(`/api/${moduleName}/:_id`,controller.getById.api)
            router.post(`/api/${moduleName}/:_id`,controller.getById.api)
            router.get(`/${moduleName}/`,(req,res)=>
            {
                return res.render('list',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:'get',
                        i:null
                    })
                })
            })
            router.get(`/${moduleName}/:_id`,(req,res)=>
            {
                return res.render('show',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:'getById',
                        i:req.params._id
                    })
                })
            })
            router.get(`/admin/${moduleName}/`,(req,res)=>
            {
                return res.render('table',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:'get',
                        i:null
                    })
                })
            })
            router.get(`/admin/${moduleName}/:_id`,(req,res)=>
            {
                return res.render('form',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:'getById',
                        i:req.params._id
                    })
                })
            })
        }
    }
}
const setter=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return {
        hook:router=>
        {
            router.put(`/api/${moduleName}/`,controller.put.api)
            router.patch(`/api/${moduleName}/:_id`,controller.patch.api)
        }
    }
}
const remover=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return {
        hook:router=>
        {
            router.delete(`/api/${moduleName}/:_id`,controller.delete.api)
        }
    }
}
const administrator=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return {
        hook:router=>
        {
            router.post(`/api/${moduleName}/login`,controller.login.api)
            router.get(`/admin/${moduleName}/login`,(req,res)=>
            {
                return res.render('login',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:null,
                        i:null
                    })
                })
            })
        }
    }
}
const user=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return {
        hook:router=>
        {
            router.post(`/api/${moduleName}/login`,controller.signIn.api)
            router.get(`/${moduleName}/signIn`,(req,res)=>
            {
                return res.render('signIn',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:null,
                        i:null
                    })
                })
            })
        }
    }
}
const routerFactory=class
{
    constructor(dependencies,behaviours,moduleName)
    {
        this.router=dependencies.express.Router()
        const state=
        {
            controller:dependencies.controller,
            moduleName:moduleName
        }
        if(behaviours.user)
            user(state).hook(this.router)
        if(behaviours.administrator)
            administrator(state).hook(this.router)
        if(behaviours.getter)
            getter(state).hook(this.router)
        if(behaviours.setter)
            setter(state).hook(this.router)
        if(behaviours.remover)
            remover(state).hook(this.router)
    }
    getRouter=_=>
    {
        return this.router
    }
}
module.exports=routerFactory