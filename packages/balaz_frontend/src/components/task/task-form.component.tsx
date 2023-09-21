import React, { Component } from 'react';

import ProjectType from '../../types/project.type';
import StoryType from '../../types/story.type';

import { ErrorMessage, Field, Form, Formik } from 'formik';

import * as Yup from 'yup';

import UserService from '../../services/user.service';

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  story: StoryType | undefined;
  position_in_story: number;
  project: ProjectType;
  triggerSuccess: () => void;
};

type MyState = {
  show: boolean;
  story_id: string;
  description: string;
  done: boolean;
  points: number;
  successful: boolean;
  message: string;
};

class TaskForm extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: true,
      story_id: '',
      description: '',
      done: false,
      points: 0,
      successful: false,
      message: '',
    };
    this.createTask = this.createTask.bind(this);
  }

  handleClose = () => this.setState({ show: false });

  validationSchema() {
    return Yup.object().shape({
      title: Yup.string()
        .test(
          'len',
          'The title must be between 3 and 100 characters.',
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 100
        )
        .required('This field is required!'),
      points: Yup.number().required().min(0).max(100).integer(),
    });
  }

  async createTask(values: any) {
    const { title, points, story_id } = values;

    UserService.addTask(
      story_id,
      title,
      points,
      false,
      this.props.position_in_story,
      this.props.project._id
    ).then(
      (response) => {
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

  render() {
    const { successful, message } = this.state;
    const story_id = this.props.story?._id;

    const initialValues = {
      title: '',
      taskTitle: '',
      points: 0,
      story_id: story_id,
    };

    if (this.props) {
      return (
        <div className="col-md-12">
          <div className="container">
            <Formik
              initialValues={initialValues}
              validationSchema={this.validationSchema}
              onSubmit={this.createTask}
            >
              {(props) => (
                <Form data-cy="add-task-section">
                  {!successful && (
                    <div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-sm-8">
                            <label htmlFor="title"> Title: </label>
                            <Field
                              name="title"
                              type="text"
                              className="form-control"
                              data-cy="task-title-input"
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="alert alert-danger"
                              data-cy="task-title-error"
                            />
                          </div>
                          <div className="col-sm-4">
                            <div className="row">
                              <div className="col-sm-8">
                                <label htmlFor="points"> Priority </label>
                                <Field
                                  name="points"
                                  type="number"
                                  className="form-control"
                                  data-cy="task-priority-input"
                                />
                              </div>
                              <div className="col-sm-4 mt-4 pt-3">
                                <button
                                  type="button"
                                  className="btn"
                                  onClick={() => this.createTask(props.values)}
                                  data-cy="create-task-button"
                                >
                                  <FontAwesomeIcon
                                    icon={faPlusCircle}
                                    size="lg"
                                    color="#7CFC00"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          <ErrorMessage
                            name="points"
                            component="div"
                            className="alert alert-danger ml-50"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {message && (
                    <div className="form-group">
                      <div
                        className={
                          successful
                            ? 'alert alert-success'
                            : 'alert alert-danger'
                        }
                        role="alert"
                        data-cy="task-message"
                      >
                        {message}
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export { TaskForm };
