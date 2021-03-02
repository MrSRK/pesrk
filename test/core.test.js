"use strict"
const chai=require('chai')
const expect=chai.expect
const express=require('express')
const mongoose=require('mongoose')
const jsonschema=require('mongoose-schema-jsonschema')
const errorhandler=require('errorhandler')
const cookieParser=require('cookie-parser')

const Cookie=require('../src/core/cookie.core')
const Database=require('../src/core/database.core')
const ErrorsDev=require('../src/core/errorsDev.core')
const app=express()

describe('Core Objects Test',_=>
{
    it('Test Cookie Core Object',done=>
    {
        const cookie=new Cookie({cookieParser:cookieParser})
        expect(cookie).to.be.an('object')
        cookie
        .hook(app)
        .after(_=>{
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
    it('Test Database Core Object',done=>
    {
        const batabase=new Database({mongoose:mongoose,jsonschema:jsonschema})
        expect(batabase).to.be.an('object')
        batabase
        .after(_=>{
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
    it('Test ErrorDev Core Object',done=>
    {
        const errorsDev=new ErrorsDev({errorhandler:errorhandler})
        expect(errorsDev).to.be.an('object')
        errorsDev
        .after(_=>{
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
})