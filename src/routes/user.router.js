import MyRouter from "./router.js";
import jwt from 'jsonwebtoken'

export default class UserRouter extends MyRouter {
    init() {

        this.get('/login', ['PUBLIC'], (req, res) =>{
            const user = {
                email: req.query.email,
                role: 'user'
            }
            const token = jwt.sign(user, 'secret')
            res.sendSuccess( {token})
        })

        this.get('/', ['PUBLIC'], (req, res) => {
            /* res.send('Hola Coders!') */
            res.sendSuccess('Hola coders!')
        })

        this.post('/:word', ['USER'], (req, res) => {
            if(req.params.word == "x") res.sendUserError('error')
            else res.sendSuccess('Word added!')
        })
    }
}