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
        next()
    }
}