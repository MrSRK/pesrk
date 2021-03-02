const chai=require('chai')
const chaiHttp=require('chai-http')
const mongoose=require('mongoose')
const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const modelFactory=require('../src/core/model.factory')
const controllerFactory=require('../src/core/controller.factory')

chai.use(chaiHttp)
const expect=chai.expect
app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

describe('Controller Factory Unit Test',_=>
{
    let model
    let controller
    let _id
    /**
     * Create Database Connection
     */
    before(done=>
    {
        dotenv.config()
        mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        },
        error=>
        {
            if(error)
                done(error)
        })
        done()
    })
    /**
     * Create Model object
     */
    before(done=>
    {
        model=modelFactory({
            mongoose:mongoose,
            bcrypt:bcrypt,
        },
        {
            name:{type:String},
            username:{type:String,unique:true},
            password:{type:String}
        },
        {
            getter:true,
            setter:true,
            remover:true
        },'testModuleController')
        done()
    })
    /**
     * Create and test controller object
     */
    it('Test Controller Object',done=>
    {
        controller=controllerFactory({
            model:model,
            bcrypt:bcrypt,
            jwt:jwt
        },
        {
            getter:true,
            setter:true,
            remover:true,
            user:true,
            administrator:true
        })
        expect(controller).to.be.an("object");
        done()
    })
    /**
     * Test controller's function put.raw (create new row)
     */
    it('Test function controller.put.raw()',done=>
    {
        
        controller.put.raw({
            name:'Stelios',
            username:'test@controller.com',
            password:'123'
        },'')
        .then(doc=>
        {
            expect(doc).to.be.a('object')
            _id=doc._id
            done()
        })
        .catch(error=>
        {
            done(error)  
        })
    })
    /**
     * Test controller's function get.raw (select all rows/ all columns exept name)
     */
    it('Test function controller.get.raw()',done=>
    {
        controller.get.raw({},'-name')
        .then(doc=>
        {
            expect(doc).to.be.a('Array')
            done()
        })
        .catch(error=>
        {
            done(error)  
        })
    })
    /**
     * Test controller's function getById.raw (select a row by _id)
     */
    it('Test function controller.getById.raw()',done=>
    {
        controller.getById.raw(_id,'-password')
        .then(doc=>
        {
            expect(doc).to.be.a('object')
            done()
        })
        .catch(error=>
        {
            done(error)  
        })
    })
     /**
     * Test controller's function patch.raw update a row by id (return alla columns except password)
     */
    it('Test function controller.patch.raw()',done=>
    { 
        controller.patch.raw(_id,{name:'O Stelios'},'-password')
        .then(doc=>
        {
            expect(doc).to.be.a('object')
            done()
        })
        .catch(error=>
        {
            done(error)  
        })
    })
     /**
     * Test controller's function delete.raw (remove a row by id/ return deleted row/ all columns except password)
     */
    it('Test function controller.delete.raw()',done=>
    {
        
        controller.delete.raw(_id,'-password')
        .then(doc=>
        {
            expect(doc).to.be.a('object')
            done()
        })
        .catch(error=>
        {
            done(error)  
        })
    })
    /**
     * Test controller's function put.api (create new row)
     */
    it('Test function controller.put.api',done=>
    {
        app.put('/api/test/',controller.put.api)
        chai.request(app)
        .put('/api/test/')
        .send({row:{name:'Stelios',username:'roubes6@hotmail.comBBB',password:'123'}})
        .then(resp=>
        {
            expect(resp).to.have.status(200)
            doc=JSON.parse(resp.text)
            expect(doc).to.be.a('object')
            _id=doc._id
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
    /**
     * Test controller's function get.api (select all rows/ all columns exept name)
     */
    it('Test function controller.get.api()',done=>
    {
        app.get('/api/test/',controller.get.api)
        chai.request(app)
        .get('/api/test/')
        .then(resp=>
        {
            expect(resp).to.have.status(200)
            doc=JSON.parse(resp.text)
            expect(doc).to.be.a('array')
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
    /**
     * Test controller's function getById.api (select a row by _id)
     */
    it('Test function controller.getById.api()',done=>
    {
        app.get('/api/test/:_id',controller.getById.api)
        chai.request(app)
        .get('/api/test/'+_id)
        .then(resp=>
        {
            expect(resp).to.have.status(200)
            doc=JSON.parse(resp.text)
            expect(doc).to.be.a('object')
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
     /**
     * Test controller's function patch.api update a row by id (return alla columns except password)
     */
    it('Test function controller.patch.api()',done=>
    { 
        app.patch('/api/test/:_id',controller.patch.api)
        chai.request(app)
        .get('/api/test/'+_id)
        .send({row:{name:'Stelios new'}})
        .then(resp=>
        {
            expect(resp).to.have.status(200)
            doc=JSON.parse(resp.text)
            expect(doc).to.be.a('object')
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
     /**
     * Test controller's function delete.api (remove a row by id/ return deleted row/ all columns except password)
     */
    it('Test function controller.delete.api()',done=>
    {
        
        app.delete('/api/test/:_id',controller.delete.api)
        chai.request(app)
        .delete('/api/test/'+_id)
        .then(resp=>
        {
            expect(resp).to.have.status(200)
            doc=JSON.parse(resp.text)
            expect(doc).to.be.a('object')
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
})