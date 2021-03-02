"use strict"
const chai=require('chai')
const expect=chai.expect
const fs=require('fs')
const path=require('path')
const express=require('express')
const mongoose=require('mongoose')
const jsonschema=require('mongoose-schema-jsonschema')
const errorhandler=require('errorhandler')
const cookieParser=require('cookie-parser')
const morgan=require('morgan')
const rfs=require('rotating-file-stream')
const helmet=require('helmet')
const sassMiddleware=require('node-sass-middleware')
const multer=require('multer')

const Cookie=require('../src/core/cookie.core')
const Database=require('../src/core/database.core')
const ErrorsDev=require('../src/core/errorsDev.core')
const ErrorsLogger=require('../src/core/errorsLoger.core')
const Security=require('../src/core/security.core')
const Sass=require('../src/core/sass.core')
const Storage=require('../src/core/storage.core')

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
    it('Test ErrorsDev Core Object',done=>
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
    it('Test ErrorsLogger Core Object',done=>
    {
        const errorsDev=new ErrorsLogger({morgan:morgan,rfs:rfs,fs:fs,path:path})
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
    it('Test Security Core Object',done=>
    {
        const errorsDev=new Security({helmet:helmet})
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
    it('Test Sass Core Object',done=>
    {
        const sass=new Sass({sassMiddleware:sassMiddleware,path:path})
        expect(sass).to.be.an('object')
        sass
        .after(_=>{
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
    it('Test Storage Core Object',done=>
    {
        const storage=new Storage({multer:multer,path:path})
        expect(storage).to.be.an('object')
        storage
        .after(_=>{
            done()
        })
        .catch(error=>
        {
            done(error)
        })
    })
})