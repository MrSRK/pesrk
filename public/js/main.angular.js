"use strict"
const app=angular.module("app",['http-worker'])
app.directive('jsonData', [function() {
    return {
        restrict: 'A',
        link: function(scope, element,attributes,controller)
        {
            scope[attributes.ngModel]=JSON.parse(element.html())
        }
    }
}])
app.filter("uniqueCategory",function()
{
    return function(collection,keyname)
    {
        let output=[]
        let keys=[]
        angular.forEach(collection,function(item)
        {
            if(item.category)
                if(keys.indexOf(item.category._id)===-1)
                {
                    keys.push(item.category._id)
                    output.push(item)
                }
        })
        return output
    }
})
app.controller("page-handler",['$scope','$http','$whttp',($scope,$http,$whttp)=>
{
    $scope.links=
    {
        setInclude:()=>
        {
            let t=$scope.init.config.template
            let f=$scope.init.config.function
            return `/template/${t}.${f}.html`
        }
    }
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
                return new Wform(bond,_id)
            default:
                console.log('Unprepared prepear...')
        }
    }
    const Wlist=class
    {
        data=[]
        asside=[]
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
        setAsside=(field,filter)=>
        {
            let t={}
            for(row in this.data)
                t[row[field]._id]=row[field]
            for(row in t)
                this.asside.push(t[row])
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
        asside={}
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
        getAsside=name=>
        {
            if(this.asside[name])
                return this.asside
            else
            {
                this.asside[name]=[]
                 $whttp.post(`/api/${name}/`,{where:{active:true},select:''})
                .then(data=>
                {
                    console.log(data)
                    this.asside[name]=data.doc
                    $scope.$apply()
                })
                .catch(error=>
                {
                    console.log(error)
                })
                return this.asside[name]
            }
        }
    }
}])