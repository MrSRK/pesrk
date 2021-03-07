"use strict"
const app=angular.module("app",['http-worker'])
app.controller("page-handler",['$scope','$http','$whttp',($scope,$http,$whttp)=>
{
    $scope.handlers={}
    $scope.prepear=(handler,bond,_id)=>
    {
        switch(handler)
        {
            case 'wlist':
                return new Wlist(bond)
            case 'wtable':
                return new Wtable(bond)
            case 'wshow':
                return new Wshow(bond,_id)
            case 'wform':
                    return Wform(bond,_id)
            default:
                console.log('Unprepared prepear...')
        }
    }
    const Wlist=class
    {
        data=[]
        constructor(bond)
        {
            this.bond=bond
            $scope.handlers[bond]=this
        }
        get=(where,select)=>
        {
            return $whttp.post(`/api/${this.bond}`,{where:where,select:select})
            .then(data=>
            {
                this.data=data.doc
                $scope.$apply()
            })
            .catch(error=>
            {
                console.log(error)
            })
        }
    }
    const Wshow=class
    {
        data=[]
        constructor(bond,_id)
        {
            this.bond=bond
            this._id=_id
            $scope.handlers[bond]=this
        }
        get=(select)=>
        {
            return $whttp.post(`/api/${this.bond}/${this._id}`,{select:select})
            .then(data=>
            {
                this.data=data.doc
                $scope.$apply()
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
        active=(row,index)=>
        {
            return $http
            .patch(`/api/${this.bond}/${row._id}`,{row:{active:!row.active}})
            .then(doc=>
            {
                if(doc.data)
                    this.data[index]=doc.data
            })
            .catch(error=>
            {
                console.log(error)
            })

        }
    }
    const Wform=class extends Wshow
    {
        data=[]
        constructor(bond,_id)
        {
            super(bond,_id)
        }
        save=_=>
        {
            return $http
            .patch(`/api/${this.bond}/${this._id}`,{row:this.data})
            .then(doc=>
            {
                if(doc.data)
                    this.data=doc.data
            })
            .catch(error=>
            {
                console.log(error)
            })
        }
    }
}])