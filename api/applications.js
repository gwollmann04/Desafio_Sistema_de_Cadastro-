module.exports = app => {
    const { existsOrError, equalOrError } = app.api.validation

    const save = async (req, res) => {

        const application = { ...req.body }
        if (req.params.id) application.id = req.params.id

        if (application.id) {

            const isAdmin = await app.db('users')
                .where({ id: req.user.id })
                .first()

            try {
                equalOrError(isAdmin.admin, 1, 'Usuário não tem permissão para comentar candidaturas')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            const applicationId = await app.db('applications')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(applicationId.jobOwnerId, req.user.id, 'Usuário não tem permissão para alterar comentarios de outro usuario')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            app.db('applications')
                .update(application)
                .where({ id: application.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).msg(err))
        } else {

            try {
                existsOrError(application.jobId, 'Id da vaga não informado')

            } catch (msg) {
                return res.status(400).send(msg)
            }

            const isAdmin = await app.db('users')
                .where({ id: req.user.id })
                .first()

            try {
                equalOrError(isAdmin.admin, 0, 'Usuário não tem permissão para se candidatar a vagas')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            application.createdAt = new Date()
            application.userId = req.user.id

            const jobOwnerId = await app.db('jobs')
                .where({ id: application.jobId })
                .first()
            application.jobOwnerId = jobOwnerId.userId

            app.db('applications')
                .insert(application)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('applications')
            .select('comments', 'id', 'userId', 'jobId', 'createdAt', 'jobOwnerId')
            .orderBy('applications.createdAt', 'desc')
            .then(applications => res.json(applications))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('applications')
            .select('comments', 'id', 'userId', 'jobId', 'createdAt', 'jobOwnerId')
            .where({ id: req.params.id })
            .orderBy('applications.createdAt', 'desc')
            .then(comment => res.json(comment))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {

            const isAdmin = await app.db('users')
                .where({ id: req.user.id })
                .first()

            if (isAdmin.admin == 1) {
                const applicationId = await app.db('applications')
                    .where({ id: req.params.id })
                    .first()

                try {
                    equalOrError(applicationId.jobOwnerId, req.user.id, 'Administrador não tem permissão para excluir candidaturas de outros administradores')
                } catch (msg) {
                    return res.status(400).send(msg)
                }
            }

            if (isAdmin.admin == 0) {
                const applicationId = await app.db('applications')
                    .where({ id: req.params.id })
                    .first()

                try {
                    equalOrError(applicationId.userId, req.user.id, 'Usuário não tem permissão para excluir candidaturas de outros candidatos')
                } catch (msg) {
                    return res.status(400).send(msg)
                }
            }

            const rowsDeleted = await app.db('applications')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Candidatura não encontrada')
            } catch (msg) {
                res.status(400).send(msg)
            }
            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    return { save, get, getById, remove }
}