import React, { Component } from 'react';

import UserService from '../../services/user.service';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import StoryType from '../../types/story.type';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TaskType from '../../types/task.type';

import { Button, Modal } from 'react-bootstrap';

import * as Yup from 'yup';

type Props = {
  handleClose: any;
};

type MyState = {
  show: boolean;
  stories: StoryType[];
  sprints_title: string | undefined;
  tasks: TaskType[];
  showTaskModal: boolean;
  successful: boolean;
  message: string;
};

class ProjectShare extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: true,
      stories: [],
      sprints_title: '',
      tasks: [],
      showTaskModal: false,
      successful: false,
      message: '',
    };
    this.updateSprint = this.updateSprint.bind(this);
  }

  handleClose = () => {
    this.props.handleClose();
  };

  componentDidMount() {
    // UserService.getSprintStories(this.props.sprint?.title!).then(
    //   response => {
    //     console.log(response)
    //     this.setState({
    //       stories: response.data
    //     });
    //   },
    //   error => {
    //     this.setState({
    //     });
    //   }
    // );
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
      status: Yup.string(),
    });
  }

  updateSprint(formValue: { title: string }) {
    // const { title } = formValue;
    // UserService.updateSprint(
    //   title,
    // ).then(
    //   response => {
    //     this.setState({
    //       message: response.data.message,
    //       successful: true
    //     });
    //   },
    //   error => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //     this.setState({
    //       successful: false,
    //       message: resMessage
    //     });
    //   }
    // );
  }

  async deleteRequest(storyId: string) {
    const response = await UserService.deleteStory(storyId);
    if (response.status === 200) {
      alert(response.data.massage);
      window.location.reload();
    } else {
      alert('Something went wrong!');
    }
  }

  render() {
    const { stories, successful, message } = this.state;

    const initialValues = {
      title: '',
    };

    if (this.props) {
      return (
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.updateSprint}
        >
          <Modal
            show={this.state.show}
            onHide={() => {
              this.handleClose();
            }}
          >
            <Modal.Header>
              <Modal.Title>
                <h2>#Sprint: </h2>
              </Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                {
                  <div>
                    <div className="form-group">
                      <div>
                        <label htmlFor="title">Title:</label>
                        <Field
                          name="title"
                          type="text"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div>
                        <label htmlFor="status">Status:</label>
                        <Field
                          name="status"
                          as="textarea"
                          type="status"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="Sprints">Stories in this sprint:</label>
                        {stories.length > 0 ? (
                          this.state.stories.map((story) => (
                            <div className="card h-100 text-white bg-dark rounded mt-0 p-0">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-sm-11">{story.title}</div>
                                  <div className="col-sm-1">
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      size="1x"
                                      color="#FF0000"
                                      onClick={() =>
                                        this.deleteRequest(story._id)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="card h-100 text-white bg-dark rounded mt-0 p-0">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-sm-11">
                                  We cant find any stories for this sprint!
                                </div>
                                {/* <div className="col-sm-1">
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    size="xs"
                                    color="#FF0000"
                                  />
                                </div> */}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div></div>
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
                  type="submit"
                  variant="primary"
                  className="btn btn-primary"
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  className="btn btn-secondary"
                  onClick={this.handleClose}
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

export { ProjectShare };
