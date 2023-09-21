import { Component } from 'react';

import TaskType from '../../types/task.type';

import UserService from '../../services/user.service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import * as Yup from 'yup';

interface TaskProps {
  task: TaskType | undefined;
}

type Props = {
  task: TaskType | undefined;
  triggerSuccess: () => void;
};

type MyState = {
  showComponent: boolean;
  update: boolean;
  successful: boolean;
  message: string;
};

export default class Task extends Component<Props, MyState, TaskProps> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showComponent: false,
      update: false,
      successful: false,
      message: '',
    };

    this.updateTask = this.updateTask.bind(this);
  }

  validationSchema() {
    return Yup.object().shape({
      title: Yup.string()
        .test(
          'len',
          'The title must be between 3 and 20 characters.',
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 20
        )
        .required('This field is required!'),
      points: Yup.number(),
    });
  }

  async deleteTask(taskId: string) {
    console.log(taskId);
    await UserService.deleteTask(taskId).then(
      (response) => {
        console.log(response);
        this.setState({
          message: response.data.message,
          successful: true,
        });
        this.props.triggerSuccess();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        this.setState({
          successful: false,
          message: resMessage,
        });
      }
    );
  }

  async updateTask(values: any) {
    const { title, points, done, assignedUser } = values;
    const taskId = this.props.task?._id;
    const storyId = this.props.task?.story_id!;
    console.log(values);
    await UserService.updateTask(
      title,
      points,
      done,
      taskId,
      storyId,
      assignedUser
    ).then(
      (response) => {
        this.setState({
          message: response.data.message,
          successful: true,
        });
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        this.setState({
          successful: false,
          message: resMessage,
        });
      }
    );
  }

  render() {
    const { successful, message } = this.state;

    if (this.props.task !== undefined) {
      const initialValues = {
        title: this.props.task.title!,
        points: this.props.task.points!,
        done: this.props.task.done,
        assignedUser: this.props.task.assigned_user,
      };
      return (
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.updateTask}
        >
          {(props) => (
            <Form>
              {
                <div className="row mb-2 mr-1" data-cy="story-assigned-tasks">
                  <div className="col-sm-5">
                    <Field
                      name="title"
                      type="text"
                      className="form-control"
                      defaultValue={this.props.task?.title}
                      data-cy="created-task-title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="col-sm-3">
                    {/* <p>{this.props.task!.assigned_user}</p> */}
                    <Field
                      name="assignedUser"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="assignedUser"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="col-sm-2">
                    <Field
                      name="points"
                      type="number"
                      className="form-control"
                      data-cy="created-task-priority"
                    />
                    <ErrorMessage
                      name="points"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="col-sm-2">
                    <div className="row">
                      <div className="col-sm-4 align-middle">
                        <Field
                          type="checkbox"
                          className="align-middle"
                          name="done"
                          color="secondary"
                          style={{
                            width: 15,
                            height: 15,
                            padding: 0,
                            marginTop: '14px',
                          }}
                        />
                      </div>
                      <div className="col-sm-4 align-middle">
                        <button
                          className="btn align-middle pr-2"
                          type="button"
                          onClick={() => this.updateTask(props.values)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            size="1x"
                            className="align-middle"
                            style={{ padding: 0, color: '#1976d2', border: 0 }}
                          />
                        </button>
                      </div>
                      <div className="col-sm-4 align-middle">
                        <button
                          type="button"
                          className="btn align-middle"
                          onClick={() => this.deleteTask(this.props.task?._id)}
                          data-cy="delete-task"
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            size="1x"
                            className="align-middle"
                            style={{
                              color: '#FF0000',
                              border: 0,
                              padding: 0,
                              margin: 0,
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? 'alert alert-success' : 'alert alert-danger'
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      );
    } else {
      return <div>There are no tasks for this story yet!</div>;
    }
  }
}
