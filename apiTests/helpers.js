import { t } from 'testcafe'


class Helpers {
    constructor () {
    }

    randomString(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const stringLength = characters.length
    let counter = 0

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * stringLength))
        counter += 1
    }
    return result
    }

    async createTask(payload) {
        const createTask = await t
            .request({
                url: `https://todo.pixegami.io/create-task`,
                method: 'put',
                body: payload
            })

        return createTask
    }

}

export default new Helpers()
