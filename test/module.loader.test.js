const mongoose=require('mongoose')
const autopopulate=require('mongoose-autopopulate')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const express=require('express')

const app=express()
const Storage=require('../src/core/storage.core')
const fs=require('fs')
const path=require('path')
const multer=require('multer')
const ModuleLoader=require('../src/module.loader')

describe('Module Loader Unit Test',_=>
{
    it('Create module loader and load modules',done=>
    {
        const storage=new Storage({multer:multer,path:path,fs:fs}).catch(error=>{throw error})
        const upload=storage.getUpload()

        const moduleLoader=new ModuleLoader(app,{
            mongoose:mongoose,
            autopopulate:autopopulate,
            bcrypt:bcrypt,
            jwt:jwt,
            express:express,
            fs:fs,
            path:path
        },
        {
            upload:upload
        })
        done()
    })
})