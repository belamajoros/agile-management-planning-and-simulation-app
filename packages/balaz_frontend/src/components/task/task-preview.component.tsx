import React, { Component } from 'react';

import AuthService from '../../services/auth.service';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import SprintsType from '../../types/sprint.type';
import TaskType from '../../types/task.type';

import { Button, Modal } from 'react-bootstrap';

import Task from '../task/task.component';

import * as Yup from 'yup';

type Props = {
  task: TaskType | undefined;
  handleClose: any;
};

type MyState = {
  show: boolean;
  successful: boolean;
  message: string;
};

class TaskPreview extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: true,
      successful: false,
      message: '',
    };

    this.updateStory = this.updateStory.bind(this);
  }

  handleClose = () => {
    this.props.handleClose();
  };

  componentDidMount() {
    const project_id = AuthService.getProject();
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

  updateStory(formValue: { title: string; description: string }) {
    const { title, description } = formValue;
  }

  render() {
    const { successful, message } = this.state;
    const initialValues = {
      title: this.props.task!.title!,
      description: this.props.task!.description!,
    };
    console.log(this.props);

    if (this.props) {
      return (
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.updateStory}
        >
          <Modal
            show={this.state.show}
            onHide={() => {
              this.handleClose();
            }}
            centered
          >
            <Modal.Header>
              <Modal.Title>
                <h2>#Task: {this.props.task?.title}</h2>
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
                          defaultValue={this.props.task?.title}
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
                          defaultValue={this.props.task?.description}
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
                      <div>
                        <label htmlFor="points" className="font-weight-bold">
                          Points:
                        </label>
                        <Field
                          name="points"
                          type="number"
                          className="form-control"
                          defaultValue={this.props.task?.points}
                        />
                        <ErrorMessage
                          name="points"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="assignedUser"
                          className="font-weight-bold"
                        >
                          Assigned User:
                        </label>
                        <Field
                          name="points"
                          type="text"
                          className="form-control"
                          defaultValue={this.props.task?.assigned_user}
                        />
                        <ErrorMessage
                          name="points"
                          component="div"
                          className="alert alert-danger"
                        />
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
                  variant="primary"
                  className="btn btn-primary mr-auto"
                  style={{ backgroundColor: 'red', border: 0 }}
                >
                  Delete
                </Button>
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

export { TaskPreview };
