import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Component } from 'react';
import * as Yup from 'yup';

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import SprintType from '../../types/sprint.type';

import { Button, Modal } from 'react-bootstrap';

interface Props {
  handleClose: any;
}

type State = {
  title: string;
  description: string;
  successful: boolean;
  message: string;
  sprint_title: string | undefined;
  sprint: SprintType[];
  taskTitle: string;
  points: number;
  show: boolean;
};

export default class StoryForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStoryCreation = this.handleStoryCreation.bind(this);

    this.state = {
      title: '',
      description: '',
      successful: false,
      message: '',
      sprint_title: '',
      sprint: [],
      taskTitle: '',
      points: 0,
      show: true,
    };
  }
  validationSchema() {
    return Yup.object().shape({
      title: Yup.string()
        .test(
          'len',
          'The title must be between 3 and 40 characters.',
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 40
        )
        .required('This field is required!'),
      description: Yup.string(),
    });
  }

  handleClose = () => {
    this.props.handleClose();
  };

  componentDidMount() {
    const project_id = AuthService.getProject();

    UserService.getUserSprints(project_id).then(
      (response) => {
        this.setState({
          sprint: response.data,
        });
        if (this.state.sprint.length <= 1) {
          this.setState({
            sprint_title: this.state.sprint[0].title,
          });
        }
      },
      (error) => {
        this.setState({});
      }
    );
  }

  handleStoryCreation(formValue: { title: string; description: string }) {
    const { title, description } = formValue;

    const userData = AuthService.getCurrentUser();
    const project_id = AuthService.getProject();
    if (
      this.state.sprint_title === '' ||
      this.state.sprint_title === undefined
    ) {
      this.setState({
        sprint_title: this.state.sprint[0].title,
      });
    }

    this.setState({
      message: '',
      successful: false,
    });

    UserService.addStory(
      userData.user._id,
      project_id,
      this.state.sprint_title!,
      title,
      description
    ).then(
      (response) => {
        this.setState({
          message: response.data.message,
          successful: true,
        });
        window.location.reload();
        // this.props.history.push("/sprint/" + response.data.doc.title );
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

  onChange = (event: React.ChangeEvent<{ value: string }>) => {
    this.setState({
      sprint_title: event.target.value,
    });
  };

  render() {
    const { successful, message, sprint } = this.state;

    const initialValues = {
      title: '',
      description: '',
      taskTitle: '',
      points: 0,
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleStoryCreation}
      >
        <Modal
          show={this.state.show}
          onHide={() => this.handleClose()}
          data-cy="story-create-modal"
        >
          <Modal.Header>
            <Modal.Title>
              <h2 className="text-center">Story creation</h2>
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="title">
                      {' '}
                      <strong>Title:</strong>{' '}
                    </label>
                    <Field
                      name="title"
                      type="text"
                      className="form-control"
                      data-cy="story-title-input"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="alert alert-danger"
                      data-cy="story-title-error"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">
                      {' '}
                      <strong>Description: </strong>{' '}
                    </label>
                    <Field
                      name="description"
                      type="description"
                      className="form-control"
                      data-cy="story-description-input"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="alert alert-danger"
                      data-cy="story-description-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sprint">
                      <strong>Sprint:</strong>
                    </label>
                    {sprint.length > 1 ? (
                      <>
                        <select
                          className="form-control"
                          id="exampleFormControlSelect1"
                          onChange={this.onChange}
                        >
                          {this.state.sprint.map((sprint) => (
                            <option key={sprint._id}>{sprint['title']}</option>
                          ))}
                        </select>
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="alert alert-danger"
                        />
                      </>
                    ) : (
                      <>
                        <select
                          className="form-control"
                          id="exampleFormControlSelect1"
                          data-cy="sprint-dropdown-select"
                        >
                          {this.state.sprint.map((sprint) => (
                            <option key={sprint['_id']}>
                              {sprint['title']}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="alert alert-danger"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

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
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="submit"
                variant="primary"
                className="btn btn-primary"
                style={{ backgroundColor: '#1976d2', border: 0 }}
                data-cy="story-create"
              >
                Create
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
  }
}
