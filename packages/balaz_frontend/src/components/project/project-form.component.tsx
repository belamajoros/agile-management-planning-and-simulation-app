import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import { Button, Modal } from 'react-bootstrap';
import ChatService from '../../services/chat.service';

interface Props {
  handleClose: any;
  navigation: any;
}

type State = {
  user_id: string;
  title: string;
  description: string;
  successful: boolean;
  message: string;
  show: boolean;
};

class ProjectForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleProjectCreation = this.handleProjectCreation.bind(this);

    this.state = {
      user_id: '',
      title: '',
      description: '',
      successful: false,
      message: '',
      show: true,
    };
  }

  validationSchema() {
    return Yup.object().shape({
      title: Yup.string()
        .test(
          'len',
          'The title must be between 3 and 30 characters.',
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 30
        )
        .required('This field is required!'),
      description: Yup.string()
        .test(
          'len',
          'The description must be at least 5 characters.',
          (val: any) => val && val.toString().length >= 5
        )
        .required('This field is required!'),
    });
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleProjectCreation(formValue: { title: string; description: string }) {
    const userData = AuthService.getCurrentUser();
    var user_id = '';
    if (userData) {
      user_id = userData.user._id;
    }
    const { title, description } = formValue;

    this.setState({
      message: '',
      successful: false,
    });

    UserService.addProject(user_id, title, description).then(
      (response) => {
        console.log(response);
        console.log(response.data.doc._id);
        ChatService.createGroupChat(response.data.doc._id).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
        this.setState({
          message: response.data.message,
          successful: true,
        });
        window.location.reload();
        this.props.handleClose();
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

    const initialValues = {
      title: '',
      description: '',
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleProjectCreation}
      >
        <Modal
          show={this.state.show}
          onHide={() => this.handleClose}
          data-cy="planner-proj-create"
        >
          <Modal.Header>
            <Modal.Title>
              <h2>Create project</h2>
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="title"> Title </label>
                    <Field
                      name="title"
                      type="text"
                      className="form-control"
                      data-cy="title-field"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="alert alert-danger"
                      data-cy="project-title-error"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description"> Description </label>
                    <Field
                      name="description"
                      type="description"
                      className="form-control"
                      data-cy="description-field"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="alert alert-danger"
                      data-cy="project-description-error"
                    />
                  </div>
                  {/*
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">Create project</button>
                  </div> */}
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
                data-cy="create-btn"
              >
                Create
              </Button>
              <Button
                variant="primary"
                className="btn btn-secondary"
                onClick={this.handleClose}
                data-cy="close-btn"
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

const ProjectFormWrapper = (props: any) => {
  const navigation = useNavigate();

  return <ProjectForm {...props} navigation={navigation} />;
};
export default ProjectFormWrapper;
