import {initialStateTaskType, taskActions} from "redux/tasksSlice";
import {TaskPriority, TaskStatuses} from "api/todolist-api";
//
// const startState: initialStateTaskType = {}
//
// beforeEach(() => {
//     startState = {}
// })
//
// test('correct task should be deleted from correct array', () => {
//
//     const action = taskActions.RemoveTask({todoListId: 'todolistId2', taskId: '2'})
//
//     const endState
//
//     expect(endState['todolistId1'].length).toBe(3)
//     expect(endState['todolistId2'].length).toBe(2)
//     expect(endState['todolistId2'].every((t: any) => t.id !== '2')).toBeTruthy()
// })
//
// test('correct task should be added to correct array', () => {
//     const action = taskActions.AddTask({
//         todolistId: 'todolistId2', newTask: {
//             description: 'juice',
//             title: 'newTask',
//             status: TaskStatuses.New,
//             priority: 0,
//             startDate: '',
//             deadline: '',
//             id: 'id exists',
//             todoListId: 'todolistId2',
//             order: 0,
//             addedDate: '',
//             entityTaskStatus: 'idle'
//         }
//     })
// })