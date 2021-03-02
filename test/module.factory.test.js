"use strict"
const chai=require('chai')
const chaiHttp=require('chai-http')
const mongoose=require('mongoose')
const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const ModuleFactory=require('../src/core/module.factory')

chai.use(chaiHttp)
const expect=chai.expect
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

describe('Module Factory Unit Test',_=>
{
    let module=new ModuleFactory({
        mongoose:mongoose,
        bcrypt:bcrypt,
        jwt:jwt,
        express:express
    },
    {
        name:{type:String},
        username:{type:String,unique:true},
        password:{type:String}
    },
    {
        getter:true,
        setter:true,
        remover:true,
        user:true,
        administrator:true
    },'moduleFactoryTest')
    it('Module creation',done=>
    {
        expect(module).to.be.an('object')
        done()
    })
    module
    .createModel(model=>
    {
        it('Model creation',done=>
        {
            expect(model).to.be.an('object')
            done()
        })
        // Add model Extensions...
    })
    .createController(controller=>
    {
        it('Controller creation',done=>
        {
            expect(controller).to.be.an('object')
            done()
        })
        // Add controller Extensions
    })
    .createRouter(router=>
    {
        it('Route creation',done=>
        {
            expect(router).to.be.an('object')
            done()
        })
        // Add router Extensions
    })
    .getRouter(router=>
    {
        it("Get's Express Router",done=>
        {
            expect(router).to.be.an('function')
            done()
        })
        // Add Express router Extensions
        app.use(router)
    })
    .catch(error=>
    {
        it('Error',done=>
        {
            done(error)
        })
        console.log('We Have Error')
        console.log(error)
    })
})