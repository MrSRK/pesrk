"use strict"
const app=angular.module("app",['http-worker'])
app.controller("page-handler",['$scope','$http','$whttp',($scope,$http,$whttp)=>
{

    const Wlist=class
    {
        data=[]
        constructor(bond)
        {
            this.bond=bond
            $scope[bond]=this
        }
        get=(where,select)=>
        {
            return $whttp.post(`/api/${this.bond}`,{where:where,select:select})
            .then(data=>
            {
                this.data=data.doc
            })
            .catch(error=>
            {
                console.log(error)
            })
        }
    }
    const WShow=class
    {
        data=[]
        constructor(bond,_id)
        {
            this.bond=bond
            this._id=_id
            $scope[bond]=this
        }
        get=(select)=>
        {
            return $whttp.post(`/api/${this.bond}/${this._id}`,{select:select})
            .then(data=>
            {
                this.data=data.doc
            })
            .catch(error=>
            {
                console.log(error)
            })
        }
    }
    
    const Wtable=class extends Wlist
    {
        data=[]
        constructor(bond)
        {
            super(bond)
        }
        active=(row)=>
        {
            console.log(row)
            $whttp.patch(`/api/${this.bond}/${row._id}`,{row:{active:!row.active}})
            .then(doc=>
            {
                console.log('DOC')
                console.log(doc)
                row=doc
            })
            .catch(error=>
            {
                console.log(error)
            })
        }
    }
    const wtable=new Wtable('dummy')
    wtable.get()
    setTimeout(_=>
    {
        
        wtable.active(wtable.data[1])
        setTimeout(_=>
        {
            console.log(wtable.data)
        },2000)
    },3000)
}])