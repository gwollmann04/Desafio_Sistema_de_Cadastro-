module.exports = app => {
    const { existsOrError, equalOrError } = app.api.validation

    const save = async (req, res) => {


        const job = { ...req.body }
        if (req.params.id) job.id = req.params.id

        try {
            existsOrError(job.jobName, 'Nome da vaga em branco')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        const isAdmin = await app.db('users')
                .where({ id: req.user.id })
                .first()

            try {
                equalOrError(isAdmin.admin, 1, 'Usuário não tem permissão para criar/editar vagas')
            } catch (msg) {
                return res.status(400).send(msg)
            }
        
        if (job.id) {
            const jobId = await app.db('jobs')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(jobId.userId, req.user.id, 'Usuário não tem permissão para alterar vaga de outro usuario')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            app.db('jobs')
                .update(job)
                .where({ id: job.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
                
        } else {
            job.createdAt = new Date()
            job.userId = req.user.id
            app.db('jobs')
                .insert(job)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('jobs')
            .select('id', 'jobName', 'userId', 'createdAt')
            .orderBy('jobs.createdAt', 'desc')
            .then(job => res.json(job))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('jobs')
            .select('id', 'jobName', 'userId', 'createdAt')
            .where({ id: req.params.id })
            .first()
            .then(job => res.json(job))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {

            const jobId = await app.db('jobs')
                .where({ id: req.params.id })
                .first()

            try {
                equalOrError(jobId.userId, req.user.id, 'Usuário não tem permissão para deletar vagas de outros usuarios')
            } catch (msg) {
                return res.status(400).send(msg)
            } 

            const applicationsDeleted = await app.db('applications')
                .where({ jobId: req.params.id }).del()

            const rowsDeleted = await app.db('jobs')
                .where({ id: req.params.id }).del()
            try {
                existsOrError(rowsDeleted, 'Vaga não encontrada')
            } catch (msg) {
                res.status(400).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    return { save, get, getById, remove}
}