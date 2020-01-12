const userValidate = require('./userValidate')

module.exports = app => {

    //Cadastrar Usuario, Logar Usuario, Validar um Token
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    //Ver todos usuarios
    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.api.user.get)

    //Ver as vagas criadas por um administrador
    app.route('/users/:id/jobs')
        .all(app.config.passport.authenticate())
        .get(app.api.user.userJobs)

    //Ver as vagas candidaturas de um usuario
    app.route('/users/:id/applications')
        .all(app.config.passport.authenticate())
        .get(app.api.user.userApplications)

    //Editar um usuario especifico, ver um usuario especifico, remove um usuario especifico(e tudo associado a ele)
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(userValidate(app.api.user.save))
        .get(app.api.user.getById)
        .delete(userValidate(app.api.user.remove))

    //Criar uma vaga, ver todas vaga
    app.route('/jobs')
        .all(app.config.passport.authenticate())
        .post(app.api.jobs.save)
        .get(app.api.jobs.get)

    //Editar uma vaga, Ver uma vaga especifica, deletar uma vaga(e tudos comentarios/candidaturas associadas)
    app.route('/jobs/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.jobs.save)
        .get(app.api.jobs.getById)
        .delete(app.api.jobs.remove)

    //Se candidata a uma vaga, Vizualiza todas candidaturas
    app.route('/applications')
        .all(app.config.passport.authenticate())
        .post(app.api.applications.save)
        .get(app.api.applications.get)

    //Visualiza uma candidatura especifica, Comenta em uma candidatura especifica, Exclui uma candidatura especifica
    app.route('/applications/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.applications.getById)
        .post(app.api.applications.save)
        .delete(app.api.applications.remove)


}