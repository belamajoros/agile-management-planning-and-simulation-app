import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import * as Yup from 'yup';

import DatePicker from 'react-datepicker';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import { Button, Modal } from 'react-bootstrap';

import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  //history: any;
  handleClose: any;
}

type State = {
  user_id: string;
  project_id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  successful: boolean;
  message: string;
  show: boolean;
};

export default class SprintForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleSprintCreation = this.handleSprintCreation.bind(this);

    this.state = {
      user_id: '',
      project_id: '',
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      successful: false,
      message: '',
      show: true,
    };
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
  }

  handleClose = () => {
    this.props.handleClose();
  };

  validationSchema() {
    return Yup.object().shape({
      Title: Yup.string()
        .test(
          'len',
          'The Title must be between 3 and 40 characters.',
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 40
        )
        .required('This field is required!'),
      startDate: Yup.date(),
      endDate: Yup.date().min(
        Yup.ref('startDate'),
        "End date can't be before start date"
      ),
    });
  }

  handleSprintCreation(formValue: { Title: string }) {
    const { Title } = formValue;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;

    if (startDate.toString() === endDate.toString()) {
      this.setState({
        message: 'Set your start and end date of sprint',
        successful: false,
      });
      return;
    }

    if (startDate.getTime() > endDate.getTime()) {
      this.setState({
        message: 'End date can`t be in history and lower then start date.',
        successful: false,
      });
      return;
    }

    const userData = AuthService.getCurrentUser();
    const project_id = AuthService.getProject();

    UserService.addSprint(
      userData.user._id,
      project_id,
      Title,
      startDate,
      endDate
    ).then(
      (response) => {
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

  private handleStartDate(date: Date) {
    this.setState({
      startDate: date,
    });
  }

  private handleEndDate(date: Date) {
    this.setState({
      endDate: date,
    });
  }

  render() {
    const { successful, message } = this.state;

    const initialValues = {
      Title: '',
      startDate: new Date(),
      endDate: new Date(),
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSprintCreation}
      >
        <Modal
          show={this.state.show}
          onHide={() => this.handleClose()}
          data-cy="create-sprint-modal"
        >
          <Modal.Header>
            <Modal.Title>
              <h2>Create sprint</h2>
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="Title">
                      <strong> Title </strong>
                    </label>
                    <Field
                      name="Title"
                      type="text"
                      className="form-control"
                      data-cy="sprint-title-input"
                    />
                    <ErrorMessage
                      name="Title"
                      component="div"
                      className="alert alert-danger"
                      data-cy="title-error"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate">
                      {' '}
                      <strong>Sprint starts at: </strong>
                    </label>
                    <DatePicker
                      name="startDate"
                      className="form-control"
                      showTimeSelect
                      dateFormat="dd.MM.yyyy HH:mm:ss"
                      selected={this.state.startDate}
                      onChange={this.handleStartDate}
                      data-cy="start-date-select"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">
                      {' '}
                      <strong> Sprint ends at: </strong>
                    </label>
                    <DatePicker
                      name="endDate"
                      className="form-control"
                      showTimeSelect
                      dateFormat="dd.MM.yyyy HH:mm:ss"
                      selected={this.state.endDate}
                      onChange={this.handleEndDate}
                      data-cy="end-date-select"
                    />
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
                    data-cy="date-error"
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
                data-cy="create-sprint"
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
