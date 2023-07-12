import MyRouter from "./router.js";

export default class UserRouter extends MyRouter {
    init() {
        this.get('/', (req, res) => {
            /* res.send('Hola Coders!') */
            res.sendSuccess('Hola coders!')
        })

        this.post('/:word', (req, res) => {
            if(req.params.word == "x") res.sendUserError('error')
            else res.sendSuccess('Word added!')
        })
    }
}