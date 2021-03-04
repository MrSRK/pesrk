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
        active=(_id,stage)=>
        {
            $whttp.patch(`/api/${this.bond}/${_id}`,{row:{active:stage}})
            .then(doc=>
            {
                //
            })
            .catch(error=>
            {
                //
            })
        }
    }

    console.log(wpshow)
    //wlist.get({name:{$regex:'Stelios 3'}})
    //wShow.get('-username')

}])