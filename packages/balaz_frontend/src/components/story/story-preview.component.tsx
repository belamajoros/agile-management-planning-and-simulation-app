import React, { Component } from 'react';

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import ProjectType from '../../types/project.type';
import SprintsType from '../../types/sprint.type';
import StoryType from '../../types/story.type';
import TaskType from '../../types/task.type';

import { Button, Modal } from 'react-bootstrap';

import { TaskForm } from '../task/task-form.component';
import Task from '../task/task.component';

import * as Yup from 'yup';

type Props = {
  story: StoryType | undefined;
  handleClose: any;
};

type MyState = {
  show: boolean;
  sprints: SprintsType[];
  sprints_title: string | undefined;
  tasks: TaskType[];
  showTaskModal: boolean;
  successful: boolean;
  message: string;
  project: ProjectType;
};

class StoryPreview extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: true,
      sprints: [],
      sprints_title: '',
      tasks: [],
      showTaskModal: false,
      successful: false,
      message: '',
      project: {
        _id: '',
        slug: '',
        user_id: '',
        title: '',
        members: [],
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    };
    this.updateStory = this.updateStory.bind(this);
    this.handleTaskCreationSuccess = this.handleTaskCreationSuccess.bind(this);
    this.handleTaskDeletionSuccess = this.handleTaskDeletionSuccess.bind(this);
  }

  handleClose = () => {
    this.props.handleClose();
  };

  componentDidMount() {
    const project_id = AuthService.getProject();

    UserService.getProject(project_id).then(
      (response) => {
        this.setState({
          project: response.data,
        });
      },
      (error) => {
        this.setState({});
      }
    );

    UserService.getUserSprints(project_id).then(
      (response) => {
        this.setState({
          sprints: response.data,
        });
      },
      (error) => {
        this.setState({});
      }
    );

    UserService.getTasks(this.props.story?._id).then(
      (response) => {
        console.log(response);
        this.setState({
          tasks: response.data,
        });
      },
      (error) => {
        this.setState({});
      }
    );
  }

  onChange = (event: React.ChangeEvent<{ value: string }>) => {
    this.setState({
      sprints_title: event.target.value,
    });
  };

  showModalForTask = () => {
    this.setState({ showTaskModal: !this.state.showTaskModal });
  };

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
      description: Yup.string(),
    });
  }

  updateStory(formValue: {
    title: string;
    description: string;
    story_id: string;
  }) {
    const { title, description, story_id } = formValue;
    const sprint_title = this.state.sprints_title!;

    UserService.updateStory(title, description, story_id, sprint_title).then(
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

  handleTaskDeletionSuccess() {
    console.log('Triggered task deletion success');
    UserService.getTasks(this.props.story?._id).then(
      (response) => {
        console.log(response);
        this.setState({
          tasks: response.data,
        });
      },
      (error) => {
        this.setState({});
      }
    );
    this.setState({
      message: 'Successfully deleted!',
      successful: true,
    });
  }

  handleTaskCreationSuccess() {
    console.log('Triggered task creation success');
    UserService.getTasks(this.props.story?._id).then(
      (response) => {
        console.log(response);
        this.setState({
          tasks: response.data,
        });
      },
      (error) => {
        this.setState({});
      }
    );
    this.showModalForTask();
  }

  render() {
    const { sprints, successful, message } = this.state;

    const initialValues = {
      title: this.props.story!.title,
      description: this.props.story!.description,
      taskTitle: '',
      points: 0,
      story_id: this.props.story!._id,
    };

    if (this.props) {
      return (
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.updateStory}
        >
          <Modal
            size="lg"
            show={this.state.show}
            onHide={() => {
              this.handleClose();
            }}
            centered
            data-cy="story-edit-modal"
          >
            <Modal.Header>
              <Modal.Title>
                <h2>#Story: {this.props.story?.title}</h2>
              </Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                {
                  <div>
                    <div className="form-group">
                      <div>
                        <label htmlFor="title" className="font-weight-bold">
                          Title:
                        </label>
                        <Field
                          name="title"
                          type="text"
                          className="form-control"
                          defaultValue={this.props.story?.title}
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="font-weight-bold"
                        >
                          Description:
                        </label>
                        <Field
                          name="description"
                          defaultValue={this.props.story?.description}
                          as="textarea"
                          type="description"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="mb-2">
                        {sprints.length > 1 ? (
                          <>
                            <label
                              htmlFor="Sprints"
                              className="font-weight-bold"
                            >
                              Assigned to sprint:
                            </label>
                            <select
                              className="form-control"
                              id="selectSprint1"
                              onChange={this.onChange}
                              defaultValue={this.props.story?.sprint_title}
                            >
                              {this.state.sprints.map((sprints) => (
                                <option key={sprints._id}>
                                  {sprints['title']}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            <label
                              htmlFor="exampleFormControlSelect2"
                              className="font-weight-bold"
                            >
                              Assigned to sprint:
                            </label>
                            <select className="form-control" id="selectSprint1">
                              <option>{this.props.story?.sprint_title}</option>
                            </select>
                          </>
                        )}
                      </div>

                      <div>
                        <label htmlFor="Tasks" className="font-weight-bold">
                          Tasks:
                        </label>
                        {this.state.tasks.length > 0 ? (
                          this.state.tasks.map((item, ind) => (
                            <Task
                              task={item}
                              key={item._id}
                              triggerSuccess={this.handleTaskDeletionSuccess}
                            ></Task>
                          ))
                        ) : (
                          <div>
                            There are no tasks yet.
                            <p>
                              You can create one on clicking Add task button
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                }
                {message && (
                  <div className="form-group">
                    <div
                      className={
                        successful
                          ? 'alert alert-success'
                          : 'alert alert-danger'
                      }
                      role="alert"
                    >
                      {message}
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  hidden={this.state.showTaskModal}
                  variant="primary"
                  className="btn btn-primary mr-auto"
                  onClick={this.showModalForTask}
                  data-cy="add-task-button"
                >
                  Add Task
                </Button>
                {this.state.showTaskModal ? (
                  <TaskForm
                    story={this.props.story}
                    position_in_story={this.state.tasks.length + 1}
                    project={this.state.project}
                    triggerSuccess={this.handleTaskCreationSuccess}
                  ></TaskForm>
                ) : null}
                <Button
                  type="submit"
                  variant="primary"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#1976d2', border: 0 }}
                  data-cy="save-button"
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  className="btn btn-secondary"
                  onClick={this.handleClose}
                  data-cy="close-button"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Formik>
      );
    } else {
      return (
        <Modal
          show={this.state.show}
          onHide={() => {
            this.handleClose();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Something went wrong</Modal.Title>
          </Modal.Header>
          <Modal.Body>Something went wrong</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
}

export { StoryPreview };
