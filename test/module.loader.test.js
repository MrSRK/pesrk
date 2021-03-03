const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const express=require('express')
const fs=require('fs')
const path=require('path')

const app=express()

const ModuleLoader=require('../src/module.loader')

describe('Module Loader Unit Test',_=>
{
    it('Create module loader and load modules',done=>
    {
        const moduleLoader=new ModuleLoader(app,{
            mongoose:mongoose,
            bcrypt:bcrypt,
            jwt:jwt,
            express:express,
            fs:fs,
            path:path
        },
        {
            //Toolbox
        })
        done()
    })
})