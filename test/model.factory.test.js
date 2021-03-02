"use strict"
const chai=require('chai')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const dotenv=require('dotenv')
const ModelFactory=require('../src/factory/model.factory')
const expect=chai.expect


describe('Model Factory Unit Test',_=>
{
    let model=null
    let _id=null
    let ObjectId=mongoose.Types.ObjectId
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
     * Create and test model object
     */
    it('Test model Object',done=>
    {
        model=new ModelFactory({
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
        },'testModuleModel')
        expect(model).to.be.a('Object')
        expect(model).to.have.keys('find','findById','save','findByIdAndUpdate','findByIdAndRemove')
        done()
    })
    /**
     * Test model's function save (create new row)
     */
    it('Test function model.save()',done=>
    {
        
        model.save({
            name:'Stelios',
            username:'test@model.com',
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
     * Test model's function find (select all rows/ all columns exept name)
     */
    it('Test function model.find()',done=>
    {
        model.find({},'-name')
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
     * Test model's function findById (select a row by _id)
     */
    it('Test function model.findById()',done=>
    {
        
        model.findById(_id,'-password')
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
     * Test model's function findByIdAndUpdate update a row by id (return alla columns except password)
     */
    it('Test function model.findByIdAndUpdate()',done=>
    {
        
        model.findByIdAndUpdate(_id,{name:'O Stelios'},'-password')
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
     * Test model's function findByIdAndUpdate update a row by id (return alla columns except password)
     */
    it('Test function model.findByIdAndRemove()',done=>
    {
        
        model.findByIdAndRemove(_id,'-password')
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
})