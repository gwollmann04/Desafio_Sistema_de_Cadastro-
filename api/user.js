const bcrypt = require('bcryptjs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.phoneNumber, 'Número de Telefone não informado')
            existsOrError(user.cpf, 'CPF não informado')
            existsOrError(user.password, 'Senha não Informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha invalida')
            equalOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ cpf: user.cpf }).first()
            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuario ja cadastrado')
            }

            if (user.admin) {
                equalOrError(user.admin, "123", 'Código para admin invalido')
                user.admin = true
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.send(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email','admin','cpf','phoneNumber')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }
   
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email','admin','cpf','phoneNumber')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(msg))
    }

    const remove = async (req, res) => {
        try {
            
            const applicationsDeleted = await app.db('applications')
                .where({ jobOwnerId: req.params.id }).orWhere({userId: req.params.id}).del()

            const jobsDeleted = await app.db('jobs')
                .where({ userId: req.params.id }).del()

            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })

            try {
                existsOrError(rowsUpdated, 'Usuario não encontrado')
            } catch (msg) {
                res.status(400).send(msg)
            }

            res.status(204).send()

        } catch (msg) {
            res.status(500).send()
        }

    }

    const userJobs = (req, res) => {
        app.db('jobs')
            .select('jobName', 'id', 'userId', 'createdAt')
            .where({ userId: req.params.id })
            .orderBy('jobs.createdAt', 'desc')
            .then(userJobs => res.json(userJobs))
            .catch(err => res.status(500).send(err))
    }

    const userApplications = (req, res) => {
        app.db('applications')
            .select('comments', 'id', 'userId', 'createdAt','jobOwnerId','jobId')
            .where({ userId: req.params.id })
            .orderBy('applications.createdAt', 'desc')
            .then(userApplications => res.json(userApplications))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById, remove, userJobs, userApplications}
}