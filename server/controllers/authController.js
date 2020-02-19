const bcrypt = require('bcryptjs')


module.exports = {
    register: async(req, res) => {
        let {username, password, isAdmin} = req.body
        let db = req.app.get('db')
        
        let result = await db.get_user([username])
    
        if(result[0]) {
            return res.status(401).send('Username taken')
        }
    
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user([isAdmin, username, hash])
    
        const user = registeredUser[0]
    
        req.session.user = {
            isAdmin: user.isAdmin,
            id: user.id,
            username: user.username,
        }
        res.status(201).send(req.session.user)
    
    }
}
