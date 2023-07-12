import MyRouter from "./router.js";

export default class UserRouter extends MyRouter {
    init() {
        this.get('/', (req, res) => {
            /* res.send('Hola Coders!') */
            res.sendSuccess('Hola coders!')
        })
    }
}