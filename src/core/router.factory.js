const getter=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return application=>
    {
        application.get(`/api/${moduleName}/`,controller.api.get)
        application.post(`/api/${moduleName}/`,controller.api.get)

        application.get(`/api/${moduleName}/:_id`,controller.api.getById)
        application.post(`/api/${moduleName}/:_id`,controller.api.getById)

        application.get(`/${moduleName}/`,(req,res)=>
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
        application.get(`/${moduleName}/:_id`,(req,res)=>
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
        application.get(`/admin/${moduleName}/`,(req,res)=>
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
        application.get(`/admin/${moduleName}/:_id`,(req,res)=>
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
const setter=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return application=>
    {
        application.put(`/api/${moduleName}/`,controller.api.put)
        application.patch(`/api/${moduleName}/:_id`,controller.api.patch)
    }
}
const remover=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return application=>
    {
        application.delete(`/api/${moduleName}/:_id`,controller.api.delete)
    }
}
const administrator=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return application=>
    {
        application.post(`/api/${moduleName}/login`,controller.api.login)

        application.get(`/admin/${moduleName}/login`,(req,res)=>
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
const user=state=>
{
    const moduleName=state.moduleName
    const controller=state.controller
    return application=>
    {
        application.post(`/api/${moduleName}/login`,controller.api.signIn)

        application.get(`/${moduleName}/signIn`,(req,res)=>
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
const routerFactory=(dependencies,behaviours,moduleName)=>
{
    
    state=
    {
        controller:dependencies.controller,
        moduleName:moduleName
    }
	let behaviour={}
    if(behaviours.user)
        Object.assign(behaviour,user(state))
    if(behaviours.administrator)
        Object.assign(behaviour,administrator(state))
	if(behaviours.getter)
		Object.assign(behaviour,getter(state))
	if(behaviours.setter)
		Object.assign(behaviour,setter(state))
	if(behaviours.remover)
		Object.assign(behaviour,remover(state))
	return behaviours
} 
module.exports=routerFactory