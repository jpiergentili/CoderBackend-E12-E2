import { Router } from "express";
import jwt from "jsonwebtoken";

export default class MyRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    init()  {} //este metodo es una clase fija, que luego servira para personalizar cada una de las instancias

    getRouter(){
        return this.router
    }

    get(path, policies, ...callbacks){
        this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks)) //applyCallbacks: este metodo aplicará todos los callbacks
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks)) 
    }

    put(path, policies, ...callbacks){
        this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
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
        res.sendNoAuthenticatedError = error => res.status(401).send({status: 'error', error})
        res.sendNoAuthorizatedError = error => res.status(403).send({status: 'error', error})
        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies.includes('PUBLIC')) return next()
        if (policies.length > 0) {
            const authHeaders = req.headers.authorization

            if (!authHeaders) return res.sendNoAuthenticatedError('Unauthenticated')
            
            // esto sirve para remover el beared del token en el caso de que lo usen
            const tokenArray = authHeaders.split('') 
            const token = (tokenArray.length > 1) ? tokenArray[1] : tokenArray[0]

            const user = jsw.verify(token, 'secret')

            if (!policies.includes(user.role.toUpperCase())) {
                return res.sendNoAuthorizatedError('Unathorizated')
            }
        }
        next()
    }

}