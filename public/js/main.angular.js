"use strict"
const app=angular.module("app",[])
app.controller("page-handler",['$scope','$http',($scope,$http)=>
{
    const worker=new Worker('/js/request.webworker.js')
    worker.postMessage({
        job:'request',
        payload:
        {
            url:'/api/dummy'
        }
    })
    worker.onmessage=message=>
    {
        console.log(JSON.parse(message.data))
    }


}])