"use strict"
const chai=require('chai')
const chaiHttp=require('chai-http')
const mongoose=require('mongoose')
const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const ModelFactory=require('../src/core/model.factory')
const ControllerFactory=require('../src/core/controller.factory')
const RouterFactory=require('../src/core/router.factory')
const { Router } = require('express')

chai.use(chaiHttp)
const expect=chai.expect
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

describe('Router Factory Unit Test',_=>
{
    let model
    let controller
    let router
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
        },'testModuleRouter')
        done()
    })
    /**
     * Create controller object
     */
    before('Test Controller Object',done=>
    {
        controller=new ControllerFactory({
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
        done()
    })
    it('Test Router Object',done=>
    {
        const route=new RouterFactory({
            controller:controller,
            express:express
        },
        {
            getter:true,
            setter:true,
            remover:true,
            user:true,
            administrator:true
        },'testModuleRouter')
        router=route.getRouter()
        app.use(router)
        expect(controller).to.be.an("object");
        done()
    })
    it('Test api get route',done=>
    {
        chai.request(app)
        .get('/api/testModuleRouter')
        .then(resp=>
        {
            expect(resp).to.have.status(200)
            const doc=JSON.parse(resp.text)
            expect(doc).to.be.a('array')
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
})