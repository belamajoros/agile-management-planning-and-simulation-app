import { Component } from 'react';

import UserService from '../../services/user.service';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import SprintType from '../../types/sprint.type';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProjectType from '../../types/project.type';

import { Button, Modal } from 'react-bootstrap';

import * as Yup from 'yup';

type Props = {
  project: ProjectType;
  handleClose: any;
};

type MyState = {
  show: boolean;
  sprints: SprintType[];
  successful: boolean;
  message: string;
};

class ProjectEdit extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: true,
      sprints: [],
      successful: false,
      message: '',
    };
    this.updateProject = this.updateProject.bind(this);
  }

  handleClose = () => {
    this.props.handleClose();
  };

  componentDidMount() {
    UserService.getProjectSprints(this.props.project._id).then(
      (response) => {
        console.log(response);
        this.setState({
          sprints: response.data,
        });
        console.log(response.data.length);
      },
      (error) => {
        this.setState({});
      }
    );
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
      status: Yup.string(),
    });
  }

  updateProject(formValue: { title: string; description: string }) {
    const { title, description } = formValue;
    const id = this.props.project._id;

    UserService.updateProject(id, title, description).then(
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

  async deleteRequest(sprintId: string) {
    const response = await UserService.deleteSprint(sprintId);
    if (response.status === 200) {
      alert(response.data.massage);
      window.location.reload();
    } else {
      alert('Something went wrong!');
    }
  }

  render() {
    const { sprints, successful, message } = this.state;

    const initialValues = {
      title: this.props.project.title,
      description: this.props.project.description,
    };

    if (this.props) {
      return (
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.updateProject}
        >
          <Modal
            show={this.state.show}
            onHide={() => {
              this.handleClose();
            }}
            data-cy="edit-modal"
          >
            <Modal.Header>
              <Modal.Title>
                <h2>{this.props.project.title}</h2>
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
                        <label htmlFor="Sprints" className="font-weight-bold">
                          Sprints in this project:
                        </label>
                        {sprints.length > 0 ? (
                          this.state.sprints.map((sprint) => (
                            <div
                              key={sprint._id}
                              className="row border border-secondary bg-secondary p-2 text-dark mt-1 mb-1 mr-1 ml-1 rounded font-weight-bold"
                            >
                              <div className="col-sm-6">
                                <span className="">{sprint.title}</span>
                              </div>
                              <div className="col-sm-6 d-flex flex-row-reverse">
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  size="1x"
                                  color="#FF0000"
                                  onClick={() => this.deleteRequest(sprint._id)}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="card h-100 text-white bg-dark rounded mt-0 p-0">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-sm-11">
                                  We cant find any sprint for this project!
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
                  style={{ backgroundColor: '#1976d2', border: 0 }}
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  className="btn btn-secondary"
                  onClick={this.handleClose}
                  data-cy="edit-close"
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

export { ProjectEdit };
