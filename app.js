"use strict"
const fs=require('fs')
const path=require('path')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const jsonschema=require('mongoose-schema-jsonschema')
const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const errorhandler=require('errorhandler')
const morgan=require('morgan')
const rfs=require('rotating-file-stream')
const helmet=require('helmet')
const sassMiddleware=require('node-sass-middleware')
const multer=require('multer')

const Cookie=require('./src/core/cookie.core')
const Database=require('./src/core/database.core')
const ErrorsDev=require('./src/core/errorsDev.core')
const ErrorsLoger=require('./src/core/errorsLoger.core')
const Security=require('./src/core/security.core')
const Sass=require('./src/core/sass.core')
const Storage=require('./src/core/storage.core')


const ModuleLoader=require('./src/module.loader')

dotenv.config()

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

new ErrorsDev({errorhandler:errorhandler}).hook(app).catch(error=>{throw error})
new ErrorsLoger({morgan:morgan,rfs:rfs,fs:fs,path:path}).hook(app).catch(error=>{throw error})
new Security({helmet:helmet}).hook(app).catch(error=>{throw error})
new Database({mongoose:mongoose,jsonschema:jsonschema}).hook(app).catch(error=>{throw error})
new Cookie({cookieParser:cookieParser}).hook(app).catch(error=>{throw error})
new Sass({sassMiddleware:sassMiddleware,path:path}).hook(app).catch(error=>{throw error})

const storage=new Storage({multer:multer,path:path}).catch(error=>{throw error})
const upload=storage.getUpload()

const moduleLoader=new ModuleLoader(app,{
    mongoose:mongoose,
    bcrypt:bcrypt,
    jwt:jwt,
    express:express,
    fs:fs,
    path,path
},
{

})

app.listen(8080)