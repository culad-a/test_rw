import type {
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
  FindTasks,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Task/TasksCell'
import { truncate } from 'src/lib/formatters'

const DELETE_TASK_MUTATION: TypedDocumentNode<
  DeleteTaskMutation,
  DeleteTaskMutationVariables
> = gql`
  mutation DeleteTaskMutation($id: Int!) {
    deleteTask(id: $id) {
      id
    }
  }
`

const TasksList = ({ tasks }: FindTasks) => {
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    onCompleted: () => {
      toast.success('Task deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteTaskMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete task ' + id + '?')) {
      deleteTask({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Text</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{truncate(task.id)}</td>
              <td>{truncate(task.text)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.task({ id: task.id })}
                    title={'Show task ' + task.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTask({ id: task.id })}
                    title={'Edit task ' + task.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete task ' + task.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(task.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TasksList
