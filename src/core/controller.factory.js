"use strict"
/**
 * constroller's Behaviours Get
 * @description Επιστρέφει τις εγγραφές από το model συμφώνα με τα ζητούμενα.
 * @param {object} state
 * @param {object} [where] 
 * @param {string} [select]
 * @returns {Promise<object>} Promise object represents the model's find
 */
const controller_get=(state,where,select)=>
{
    const model=state.model
	return new Promise((resolve,reject)=>
	{
        if(!select)
            select=''
        select+=' -password'
		return model
		.find(where,select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * constroller's Behaviours Get By Id
 * @description Επιστρέφει μια μοναδική εγγραφή του model συμφώνα με τα ζητούμενα.
 * @param {object} state
 * @param {string} _id 
 * @param {string} [select] 
 * @returns {Promise<object>} Promise object represents the model's findById
 */
const controller_getById=(state,_id,select)=>
{
    const model=state.model
	return new Promise((resolve,reject)=>
	{
        if(!select)
            select=''
        select+=' -password'
		return model
		.findById(_id,select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * constroller's Behaviours Put
 * @description Αποθηκεύει μια εγγραφή στο model. Επιστρέφει ένα JSON με τις με το νέο _id.
 * @param {object} state
 * @param {object} row
 * @returns {Promise<object>} Promise object represents the model's save
 */
const controller_put=(state,row)=>
{
    const model=state.model
	return new Promise((resolve,reject)=>
	{
		return model
		.save(row)
		.then(doc=>{
			return resolve({_id:doc._id})
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * constroller's Behaviours Patch
 * @description Ενημερώνει μια συγκεκριμένη εγγραφή στο model συμφώνα με τα ζητούμενα. Επιστρέφει την νέα εγγραφή.
 * @param {object} state
 * @param {string} _id
 * @param {object} row
 * @returns {Promise<object>} Promise object represents the model's findByIdAndUpdate
 */
const controller_patch=(state,_id,row,select)=>
{
    const model=state.model
	return new Promise((resolve,reject)=>
	{
        if(!select)
            select=''
        select+=' -password'
		return model
		.findByIdAndUpdate(_id,row,select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * constroller's Behaviours Delete
 * @description Διαγράφει μια εγγραφή το model. Επιστρέφει το status της εργασίας.
 * @param {object} state
 * @param {string} _id
 * @returns {Promise<object>} Promise object represents the model's findByIdAndRemove
 */
const controller_delete=(state,_id)=>
{
    const model=state.model
	return new Promise((resolve,reject)=>
	{
		return model
		.findByIdAndRemove(_id)
		.then(doc=>{
			return resolve({status:true})
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * constroller's Behaviours Login
 * @description Επιστέφει μια εγγραφή αν το πεδίο username υπάρχει και είναι αληθές το compare των passwords.
 * @param {object} state
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<object>} Promise object represents login user data
 */
const controller_login=(state,username,password)=>
{
    const model=state.model
    const bcrypt=state.bcrypt
    return new Promise((resolve,reject)=>
	{ 
        const where={
            username:username
        }
        return model
        .find(where)
        .then(doc=>
        {
            if(doc.length==0)
                throw Error('Incorrect Username or Password')
            return bcrypt
            .compare(password,doc[0].password)
            .then(corect=>
            {
                if(!corect)
                    throw Error('Incorrect Username or Password')
                return resolve(doc[0])
            })
            .catch(error=>
            {
                return reject(error)
            })
        })
        .catch(error=>
        {
            return reject(error)
        })
    })
}
/**
 * Controller API Responce
 * @description Τυποποίησης των JSON εξόδου του Express για όλα τα response του API
 * @param {Object} res - Express's response Object
 * @param {Error} error
 * @param {object} data
 * @returns {Object} Express's response Object
 */
const controller_api_res=(res,error,data)=>
{
    if(error)
        return res.status(500).json(error)
    return res.status(200).json(data)
}
/**
 * constroller's Behaviours API Get
 * @description Γράφει στο response του Express ένα JSON με τις εγγραφές από το model συμφώνα με τα ζητούμενα.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_get=(state,req,res)=>
{
    const where=req.body.where||{}
    const select=req.body.select||''
    return controller_get(state,where,select)
    .then(doc=>
    {
        return controller_api_res(res,null,doc)
    })
    .catch(error=>
    {
        console.log(error)
        return controller_api_res(res,error)
    })
}
/**
 * constroller's Behaviours API Get By Id
 * @description Γράφει στο response του Express ένα JSON μια μοναδική εγγραφή του model συμφώνα με τα ζητούμενα.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_getById=(state,req,res)=>
{
    const _id=req.params._id
    const select=req.body.select
    return controller_getById(state,_id,select)
    .then(doc=>
    {
        return controller_api_res(res,null,doc)
    })
    .catch(error=>
    {
        return controller_api_res(res,error)
    })
}
/**
 * constroller's Behaviours API Put
 * @description Αποθηκεύει μια εγγραφή στο model. Γράφει στο response του Express ένα JSON με τις με το νέο _id.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_put=(state,req,res)=>
{
    if(typeof req.body.row!='object')
        throw new Error('row payload not exist')
    const row=req.body.row
    return controller_put(state,row)
    .then(doc=>
    {
        return controller_api_res(res,null,doc)
    })
    .catch(error=>
    {
        return controller_api_res(res,error)
    })
}
/**
 * constroller's Behaviours API Patch
 * @description Ενημερώνει μια συγκεκριμένη εγγραφή στο model συμφώνα με τα ζητούμενα. Γράφει στο response του Express ένα JSON με την νέα εγγραφή.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_patch=(state,req,res)=>
{
    const _id=req.params._id
    const row=req.body.row
    return controller_patch(state,_id,row)
    .then(doc=>
    {
        return controller_api_res(res,null,doc)
    })
    .catch(error=>
    {
        return controller_api_res(res,error)
    })
}
/**
 * constroller's Behaviours API Delete
 * @description Διαγράφει μια εγγραφή το model. Γράφει στο response του Express ένα JSON με το status της εργασίας.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_delete=(state,req,res)=>
{
    const _id=req.params._id
    const row=req.body.row
    return controller_delete(state,_id)
    .then(doc=>
    {
        return controller_api_res(res,null,doc)
    })
    .catch(error=>
    {
        return controller_api_res(res,error)
    })
}
/**
 * constroller's Behaviours API Login (Administrators)
 * @description Γράφει στο response του Express ένα JSON με ένα access utoken (jwt token) αν τα username και password είναι σωστά.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_login=(state,req,res)=>
{
    const jwt=state.jwt

    const username=req.body.username
    const password=req.body.password

    const JWT_SECRET=(process.env.JWT_SECRET||'{password}')+'{Administrator}'
    const JWT_EXP=process.env.JWT_EXP||'1h'
    return controller_login(state,username,password)
    .then(user=>
    {
        const token=jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:JWT_EXP})
        return controller_api_res(res,null,{
            _id:user._id,
            user:user.name,
            utoken:token
        })
    })
    .catch(error=>
    {
        console.log(error)
        return controller_api_res(res,error)
    })
}
/**
 * constroller's Behaviours API Sign In (users)
 * @description Γράφει στο response του Express ένα JSON με ένα access token (jwt token) αν τα username και password είναι σωστά.
 * @param {object} state
 * @param {Object} res - Express's response Object 
 * @param {Object} req - Express's request Object
 */
const controller_api_signIn=(state,req,res)=>
{
    const jwt=state.jwt

    const username=req.body.username
    const password=req.body.password

    const JWT_SECRET=(process.env.JWT_SECRET||'{password}')
    const JWT_EXP=process.env.JWT_EXP||'1h'
    return controller_login(state,username,password)
    .then(user=>
    {
        const token=jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:JWT_EXP})
        return controller_api_res(res,null,{
            _id:user._id,
            user:user.name,
            token:token
        })
    })
    .catch(error=>
    {
        return controller_api_res(res,error)
    })
}
/**
 * Controller's getter's Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα Getters.
 * @param {object} state 
 */
const getter=state=>
{
	return {
        get:
        {
            api:controller_api_get.bind(null,state),
            raw:controller_get.bind(null,state)
        },
        getById:
        {
            api:controller_api_getById.bind(null,state),
            raw:controller_getById.bind(null,state)
        }
	}
}
/**
 * Controller's setter's Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα Setters.
 * @param {object} state 
 */
const setter=state=>
{
	const model=state.model
	return {
        put:
        {
            api:controller_api_put.bind(null,state),
            raw:controller_put.bind(null,state)
        },
        patch:
        {
            api:controller_api_patch.bind(null,state),
            raw:controller_patch.bind(null,state)
        }
	}
}
/**
 * Controller's remover's Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα Removers.
 * @param {object} state 
 */
const remover=state=>
{
	const model=state.model
	return {
        delete:
        {
            api:controller_api_delete.bind(null,state),
            raw:controller_delete.bind(null,state)
        }
	}
}
/**
 * Controller's administrator Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα administrators.
 * @param {object} state 
 */
const administrator=state=>
{
    return {
        login:
        {
            api:controller_api_login.bind(null,state),
            raw:controller_login.bind(null,state)
        }
	}
}
/**
 * Controller's user Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα users.
 * @param {object} state
 */
const user=state=>
{
    return {
        signIn:
        {
            api:controller_api_signIn.bind(null,state),
            raw:controller_login.bind(null,state)
        }   
	}
}
/**
 * Controller Factory
 * @description Δημιουργεί ένα Controller και ορίζει to Behavior του
 * @param {object} dependencies 
 * @param {object} behaviours
 * @returns Controller
 */
const controllerFactory=class
{
    constructor(dependencies,behaviours,model)
    {
        const state=
        {
            model:model,
            bcrypt:dependencies.bcrypt,
            jwt:dependencies.jwt
        }
        if(behaviours.getter)
            Object.assign(this,getter(state))
        if(behaviours.setter)
            Object.assign(this,setter(state))
        if(behaviours.remover)
            Object.assign(this,remover(state))
        if(behaviours.user)
            Object.assign(this,user(state))
        if(behaviours.administrator)
            Object.assign(this,administrator(state))
    }
} 
module.exports=controllerFactory