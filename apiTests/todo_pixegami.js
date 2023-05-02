import Helpers from './helpers'

fixture`todo-pixegami`

test('Endpoint status code is 200', async t => {
    const endpoint = await t.request(`https://todo.pixegami.io`)

    await t
        .expect(endpoint.status).eql(200)
})

test('Create task is successful', async t => {
    const randomString = Helpers.randomString(10)
    const payload = {
        'content': randomString,
        'user_id': 'jbraden6075',
        'is_done': false
    }

    const createTaskResponse = await Helpers.createTask(payload)

    await t
        .expect(createTaskResponse.body.task.content).eql(randomString)
})

test('Can successfully get a task', async t => {
    const randomString = Helpers.randomString(10)

    const createTask = await t
        .request({
            url: `https://todo.pixegami.io/create-task`,
            method: 'put',
            body: {
                'content': randomString,
                'user_id': 'jbraden6075',
                'is_done': false
            }
        })

    const task_id = createTask.body.task.task_id

    const getTask = await t
        .request({
            url: `https://todo.pixegami.io/get-task/${task_id}`,
            method: 'get'
        })

    await t
        .expect(getTask.body.task_id).eql(task_id)
})

test('Can successfully retrieve a list of tasks by user', async t => {
    const user_id = 'jbraden6075'

    const getListOfTasks = await t
        .request({
            url: `https://todo.pixegami.io/list-tasks/${user_id}`,
            method: 'get'
        })

    for (let i = 0; i < getListOfTasks.body.tasks.length; i++) {
        await t
            .expect(getListOfTasks.body.tasks[i].user_id).eql(user_id)
    }
})

/* 
The /update-task endpoint is actually just creating a new task. 
So it needs to be updated to actually patch an existing task.
*/
test.skip('Updating a task is successful', async t => {
    const randomString = Helpers.randomString(10)
    const updatedString = Helpers.randomString(10)

    const createTask = await t
        .request({
            url: `https://todo.pixegami.io/create-task`,
            method: 'put',
            body: {
                'content': randomString,
                'user_id': 'jbraden6075',
                'is_done': false
            }
        })

    const createTaskTaskId = createTask.body.task.task_id

    const updateTask = await t
        .request({
            url: `https://todo.pixegami.io/update-task/${createTaskTaskId}`,
            method: 'put',
            body: {
                'content': updatedString,
                'is_done': true
            }
        })

    console.log(updateTask.body)

    // await t
    //     .expect(updateTask.body.task.task_id).eql(createTaskTaskId)
    //     .expect(updateTask.body.task.content).eql(updatedString)
    //     .expect(updateTask.body.task.is_done).eql(true)
})

test('Can delete a task successfully', async t => {
    const randomString = Helpers.randomString(10)

    const createTask = await t
        .request({
            url: `https://todo.pixegami.io/create-task`,
            method: 'put',
            body: {
                'content': randomString,
                'user_id': 'jbraden6075',
                'is_done': false
            }
        })

    const task_id = createTask.body.task.task_id

    const deleteTask = await t
        .request({
            url: `https://todo.pixegami.io/delete-task/${task_id}`,
            method: 'delete'
        })

    await t
        .expect(t.request.get({ url: `https://todo.pixegami.io/get-task/${task_id}` }).status).eql(404)
})
