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
                    m:moduleName,
                    f:'list',
                    i:null,
                    t:'default'
                })
            })
            router.get(`/${moduleName}/:_id`,(req,res)=>
            {
                return res.render('show',{
                    m:moduleName,
                    f:'show',
                    i:req.params._id,
                    t:'default'
                })
            })
            router.get(`/admin/${moduleName}/`,(req,res)=>
            {
                return res.render('table',{
                    m:moduleName,
                    f:'table',
                    i:null,
                    t:'default'
                })
            })
            router.get(`/admin/${moduleName}/:_id`,(req,res)=>
            {
                return res.render('form',{
                    
                    m:moduleName,
                    f:'form',
                    i:req.params._id,
                    t:'default'

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
            router.put(`/api/${moduleName}/`,controller.auth.header,controller.put.api)
            router.patch(`/api/${moduleName}/:_id`,controller.auth.header,controller.patch.api)
            router.post(`/api/${moduleName}/:_id/image`,controller.auth.header,state.toolbox.upload.single('image'),controller.post.image)
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
                        f:'login',
                        i:null,
                        t:'default'
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
            router.post(`/api/${moduleName}/signIn`,controller.signIn.api)
            router.get(`/${moduleName}/signIn`,(req,res)=>
            {
                return res.render('signIn',{
                    config:JSON.stringify(
                    {
                        m:moduleName,
                        f:'signIn',
                        i:null,
                        t:'default'
                    })
                })
            })
        }
    }
}
const routerFactory=class
{
    constructor(dependencies,toolbox,behaviours,moduleName,controller)
    {
        this.router=dependencies.express.Router()
        const state=
        {
            controller:controller,
            moduleName:moduleName,
            toolbox:toolbox
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