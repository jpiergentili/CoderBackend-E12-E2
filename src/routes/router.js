import { Router } from "express";

export default class MyRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    init()  {} //este metodo es una clase fija, que luego servira para personalizar cada una de las instancias

    getRouter(){
        return this.router
    }

    get(path, ...callbacks){
        this.router.get(path, this.generateCustomResponses, this.applyCallbacks(callbacks)) //applyCallbacks: este metodo aplicará todos los callbacks
    }

    post(path, ...callbacks){
        this.router.post(path, this.generateCustomResponses, this.applyCallbacks(callbacks)) 
    }

    put(path, ...callbacks){
        this.router.put(path, this.generateCustomResponses, this.applyCallbacks(callbacks))
    }

    delete(path, ...callbacks){
        this.router.delete(path, this.generateCustomResponses, this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback => async(...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send(error) //el argumento 1 osea el segundo corresponde al res
            }
        })     
    }

    generateCustomResponses(req, res, next){
        res.sendSuccess = payload => res.send({status: 'success', payload})
        res.sendServerError = error => res.status(500).send({status: 'error', error})
        res.sendUserError = error => res.status(400).send({status: 'error', error})
        next()
    }
}