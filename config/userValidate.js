module.exports = middleware => {
    return  (req, res, next) => {
        if(req.user.id == req.params.id) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não tem permissão para alterar dados de outro usuario')
        }
        
    }
}