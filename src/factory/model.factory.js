"use strict"
/**
 * Model's Behaviours Find
 * @description Επιστρέφει εγγραφές από την βάση δεδομένων συμφώνα με τα ζητούμενα.
 * @param {object} state
 * @param {object} [where] 
 * @param {string} [select] 
 * @returns {Promise<object>} Promise object represents the mongoose find
 */
const model_find=(state,where,select)=>
{
	const model=state.model
	if(where&&typeof where!=='object')
		throw new Error('where must be an object or null')
	if(select&&typeof select!=='string')
		throw new Error('select must be a string or null')
	return new Promise((resolve,reject)=>
	{
		return model
		.find()
		.where(where)
		.select(select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * Model's Behaviours Find By Id
 * @description Επιστρέφει μια μοναδική εγγραφή από την βάση δεδομένων συμφώνα με τα ζητούμενα.
 * @param {object} state
 * @param {number} _id 
 * @param {string} [select] 
 * @returns {Promise<object>} Promise object represents the mongoose findById
 */
const model_findById=(state,_id,select)=>
{
	const model=state.model
	const ObjectId=state.mongoose.Types.ObjectId
	if(!ObjectId.isValid(_id)||!(_id+'').match(/^[0-9a-fA-F]{24}$/))
		throw new Error('Not valid Object id')
	if(select&&typeof select!=='string')
		throw new Error('select must be a string or null')
	return new Promise((resolve,reject)=>
	{
		return model
		.findById(_id)
		.select(select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * Model's Behaviours save
 * @description Αποθηκεύει μια εγγραφή στην βάση δεδομένων.
 *@param {object} state
 * @param {object} row
 * @returns {Promise<object>} Promise object represents the mongoose save
 */
const model_save=(state,row)=>
{
	const model=state.model
	if(typeof row!=='object')
		throw new Error('row must be an object')
	return new Promise((resolve,reject)=>
	{
		const insert=new model(row)
		return insert
		.save()
		.then(doc=>
		{
			return resolve(doc)
		})
		.catch(error=>
		{
			reject(error)
		})
	})
}
/**
 * Model's Behaviours find by id and update
 * @description Ενημερώνει μια συγκεκριμένη εγγραφή στην βάση δεδομένων συμφώνα με τα ζητούμενα. Επιστρέφει την νέα εγγραφή.
 * @param {object} state
 * @param {number} _id
 * @param {object} row
 * @param {string} [select]
 * @returns {Promise<object>} Promise object represents the mongoose findByIdAndUpdate
 */
const model_findByIdAndUpdate=(state,_id,row,select)=>
{
	const model=state.model
	const ObjectId=state.mongoose.Types.ObjectId
	if(!ObjectId.isValid(_id)||!(_id+'').match(/^[0-9a-fA-F]{24}$/))
		throw new Error('Not valid Object id')
	if(typeof row!=='object')
		throw new Error('row must be an object')
	if(select&&typeof select!=='string')
		throw new Error('select must be a string or null')
	return new Promise((resolve,reject)=>
	{
		return model
		.findByIdAndUpdate(_id,row,{new:true,upsert:true})
		.select(select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * Model's Behaviours find by id and remove
 * @description Διαγράφει μια εγγραφή από την βάση δεδομένων. Επιστρέφει την διαγραμμένη εγγραφή.
 * @param {state} state
 * @param {number} _id
 * @param {string} [select]
 * @returns {Promise<object>} Promise object represents the mongoose findByIdAndRemove
 */
const model_findByIdAndRemove=(state,_id,select)=>
{
	const model=state.model
	const ObjectId=state.mongoose.Types.ObjectId
	if(!ObjectId.isValid(_id)||!(_id+'').match(/^[0-9a-fA-F]{24}$/))
		throw new Error('Not valid Object id')
	if(select&&typeof select!=='string')
		throw new Error('select must be a string or null')
	return new Promise((resolve,reject)=>
	{
		return model
		.findByIdAndRemove(_id)
		.select(select)
		.then(doc=>{
			return resolve(doc)
		})
		.catch(error=>{
			reject(error)
		})
	})
}
/**
 * Model's getter Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα Getters.
 * @param {object} state
 */
const getter=state=>
{
	return {
		find:model_find.bind(null,state),
		findById:model_findById.bind(null,state)
	}
}
/**
 * Model's setter Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα setters.
 * @param {object} state
 */
const setter=state=>
{
	return {
		save:model_save.bind(null,state),
		findByIdAndUpdate:model_findByIdAndUpdate.bind(null,state)
	}
}
/**
 * Model's remover Behaviours
 * @description Ορισμός των συμπροφορών (δικαιωμάτων) για την ομάδα Removers.
 * @param {object} state
 */
const remover=state=>
{
	return {
		findByIdAndRemove:model_findByIdAndRemove.bind(null,state)
	}
}
const schemaProvider=state=>
{
	return {
		jsonSchema:state.model.jsonSchema()
	}
}
const createMongoosemodel=(dependencies,structure,moduleName)=>
{
	try
	{
		const mongoose=dependencies.mongoose
		const autopopulate=dependencies.autopopulate
		const bcrypt=dependencies.bcrypt
		const bcrypt_salt=process.env.BCRYPT_SALT||10
		const schema=new mongoose.Schema(structure,
		{
			timestamps:true,
			versionKey:false
		})
		schema.plugin(autopopulate)
		schema.pre('save',function(next)
		{
			var user=this;
			if(!user.isModified('password')) 
				return next()
			return dependencies.bcrypt
			.genSalt(parseInt(bcrypt_salt))
			.then(salt=>
			{
				return bcrypt
				.hash(user.password,salt)
				.then(hash=>
				{
					user.password=hash
					return next()
				})
				.catch(error=>
				{
					return next(error)
				})
			})
			.catch(error=>
			{
				return next(error)
			})
		})
		schema.pre('findOneAndUpdate',async function()
		{
			if(this._update.password)
			{
				const bcrypt=dependencies.bcrypt
				const docToUpdate=await this.model.findOne(this.getQuery())
				if(docToUpdate.password!==this._update.password)
				{
					const bcrypt_salt=process.env.BCRYPT_SALT||10
					const salt =await bcrypt.genSalt(parseInt(bcrypt_salt))
					const newPassword= await bcrypt.hash(this._update.password,salt)
					this._update.password=newPassword
				}
			}
		})
		return mongoose.model(moduleName,schema)
	}
	catch(error)
	{
		console.log(error)
	}
}
/**
 * Model Factory Constructor
 * @description Δημιουργεί ένα Μongoose Model και ορίζει to Behavior του
 * @param {object} dependencies 
 * @param {object} structure 
 * @param {object} behaviours
 * @param {string} moduleName
*/
const modelFactory=class
{
	constructor(dependencies,structure,behaviours,moduleName)
	{
		const model=createMongoosemodel(dependencies,structure,moduleName)
		const state={
			model:model,
			mongoose:dependencies.mongoose,
			autopopulate:dependencies.autopopulate
		}
		console.log(dependencies.autopopulate)
		Object.assign(this,schemaProvider(state))
		if(behaviours.getter)
			Object.assign(this,getter(state))
		if(behaviours.setter)
			Object.assign(this,setter(state))
		if(behaviours.remover)
			Object.assign(this,remover(state))
	}
}
module.exports=modelFactory