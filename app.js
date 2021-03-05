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
const sharp=require('sharp')

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
app.set('view engine', 'pug')
app.set('views','./views')

new ErrorsDev({errorhandler:errorhandler}).hook(app).catch(error=>{throw error})
new ErrorsLoger({morgan:morgan,rfs:rfs,fs:fs,path:path}).hook(app).catch(error=>{throw error})
new Security({helmet:helmet}).hook(app).catch(error=>{throw error})
new Database({mongoose:mongoose,jsonschema:jsonschema}).hook(app).catch(error=>{throw error})
new Cookie({cookieParser:cookieParser}).hook(app).catch(error=>{throw error})
new Sass({sassMiddleware:sassMiddleware,path:path}).hook(app).catch(error=>{throw error})

const storage=new Storage({multer:multer,path:path,fs:fs}).catch(error=>{throw error})
const upload=storage.getUpload()

app.use('/css',express.static(path.join(__dirname,'public/css'),{maxAge:31557600000}))
app.use('/js',express.static(path.join(__dirname,'public/js'),{maxAge:31557600000}))
app.use('/images',express.static(path.join(__dirname,'public/images'),{maxAge:31557600000}))
app.use('/static',express.static(path.join(__dirname,'public/upload'),{maxAge:31557600000}))
app.use('/js', express.static(path.join(__dirname,'node_modules/popper.js/dist/umd'),{maxAge:31557600000}))
app.use('/js', express.static(path.join(__dirname,'node_modules/bootstrap/dist/js'),{maxAge:31557600000}))
app.use('/js', express.static(path.join(__dirname,'node_modules/jquery/dist'),{maxAge:31557600000}))
app.use('/webfonts', express.static(path.join(__dirname,'node_modules/@fortawesome/fontawesome-free/webfonts'),{maxAge:31557600000}))
app.use('/css',express.static(path.join(__dirname,'/node_modules/bootstrap/dist/scss'),{maxAge:31557600000}))
app.use('/js',express.static(path.join(__dirname,'/node_modules/bootstrap/dist/js'),{maxAge:31557600000}))
app.use('/js',express.static(path.join(__dirname,'/node_modules/angular'),{maxAge:31557600000}))


new ModuleLoader(app,{
    mongoose:mongoose,
    bcrypt:bcrypt,
    jwt:jwt,
    express:express,
    fs:fs,
    path:path,
    sharp:sharp
},
{
    upload:upload
})
app.listen(process.env.EXRESS_PORT)

/**
 * 
 * @todo    na ftiaksw ta modules
 * @todo    na grapsw ta termatika pug
 * @todo    na grasw ta public js... UX
 * @todo    testing testing testing
 * 
 * 
 */