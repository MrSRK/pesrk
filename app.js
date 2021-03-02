"use strict"
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const jsonschema=require('mongoose-schema-jsonschema')
const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const errorhandler=require('errorhandler')

const Cookie=require('./src/core/cookie.core')
const Database=require('./src/core/database.core')
const ErrorsDev=require('./src/core/errorsDev.core')

dotenv.config()

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

new Database({mongoose:mongoose,jsonschema:jsonschema}).catch(error=>{throw error})
new Cookie({cookieParser:cookieParser}).hook(app).catch(error=>{throw error})
new ErrorsDev({errorhandler:errorhandler}).hook(app).catch(error=>{throw error})