"use strict"
const ModuleFactory=require('../../src/factory/module.factory')

class Module extends ModuleFactory
{
    constructor(dependencies,toolbox)
    {
        const structure={
            active:{type:Boolean,default:true},
            name:{type:String},
            title:{type:String},
            description:{type:String},
            user:{
                type:dependencies.mongoose.Schema.Types.ObjectId,
                ref:'user',
                select:'name',
                autopopulate:{select:'_id name'}
            },
            images:[{
                originalname:{type:String},
                destination:{type:String},
                filename:{type:String},
                path:{type:String}
            }]
        }
        const behaviours={
            getter:true,
            setter:true,
            remover:true,
            //user:true,
           // administrator:true
        }
        const moduleName='product'
        super(dependencies,toolbox,structure,behaviours,moduleName)
    }
    hook=app=>
    {
        return this.createModel(model=>
        {
            // Add model Extensions...
            return this
        })
        .createController(controller=>
        {
            // Add controller Extensions
            return this
        })
        .createRouter(router=>
        {
            // Add router Extensions
            return this
        })
        .getRouter(router=>
        {
            // Add Express router Extensions
            app.use(router)
            return this
        })
        .catch(error=>
        {
            // Add extra error handling
            return this
        })
    }
}
module.exports=Module