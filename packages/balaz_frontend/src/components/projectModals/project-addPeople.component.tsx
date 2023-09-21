import React from 'react';

import UserService from '../../services/user.service';

import { Form, Formik } from 'formik';

import ProjectType from '../../types/project.type';
import UserType from '../../types/user.type';

import { Button, Modal, ModalFooter } from 'react-bootstrap';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Yup from 'yup';

interface BodyDataProps {
  project: ProjectType;
  handleClose: any;
  handleRemoveMember: any;
}

interface BodyDataState {
  show: boolean;
  showTaskModal: boolean;
  successful: boolean;
  message: string;
  users: UserType[];
  query: string;
  filteredData: UserType[];
  onMouse: boolean;
  selectedUser: string;
  showDeleteModal: boolean;
  deleteUser: string;
}
class ProjectAddPoeple extends React.Component<BodyDataProps, BodyDataState> {
  constructor(props: BodyDataProps) {
    super(props);

    this.state = {
      show: true,
      showTaskModal: false,
      successful: false,
      message: '',
      users: [],
      query: '',
      filteredData: [],
      onMouse: false,
      selectedUser: '',
      showDeleteModal: false,
      deleteUser: '',
    };
    this.updateSprint = this.updateSprint.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
  }

  handleClose = () => {
    this.props.handleClose();
    //window.location.reload();
  };

  componentDidMount() {
    UserService.getUsers().then(
      (response) => {
        console.log(response.data);
        this.setState({
          users: response.data,
        });
      },
      (error) => {
        this.setState({
          message: error,
          successful: false,
        });
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

  showDeleteModal = (email: string) => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
      deleteUser: email,
    });
  };

  updateSprint(formValue: { title: string }) {
    // const { title } = formValue;
  }

  handleHover() {
    this.setState({ onMouse: !this.state.onMouse });
  }

  async addUser() {
    const projectId = this.props.project._id;

    if (this.state.filteredData.length === 1) {
      await this.setState({
        selectedUser: this.state.filteredData[0].email!,
      });
    }
    if (this.state.filteredData.length > 1 && this.state.selectedUser === '') {
      await this.setState({
        selectedUser: this.state.filteredData[0].email!,
      });
    }

    if (this.state.selectedUser === '') {
      this.setState({
        successful: false,
        message: 'You need to select some user!',
      });
      return;
    }

    UserService.addProjectMember(projectId, this.state.selectedUser).then(
      (response) => {
        this.props.project.members.push(this.state.selectedUser);
        this.setState({
          message: response.data.message,
          successful: true,
          filteredData: [],
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
    this.setState({
      query: '',
    });
  }

  handleInputChange = (event: { target: { value: string } }) => {
    const query = event.target.value;

    this.setState((prevState) => {
      const filteredData = prevState.users.filter((element) => {
        return (
          element.name!.toLowerCase().includes(query.toLowerCase()) ||
          element.email!.toLowerCase().includes(query.toLowerCase())
        );
      });
      console.log(filteredData);

      return {
        query,
        filteredData,
      };
    });
  };

  onChange = (event: React.ChangeEvent<{ value: string }>) => {
    this.setState({
      selectedUser: event.target.value,
    });
  };

  selectUser(email: string) {
    this.setState({
      selectedUser: email,
    });
  }

  async deleteRequest() {
    const response = await UserService.deleteProjectMember(
      this.props.project._id,
      this.state.deleteUser
    );
    if (response.status === 200) {
      this.setState({ showDeleteModal: false });
      const updatedMembers = this.props.project.members.filter(
        (member) => member !== this.state.deleteUser
      );

      this.props.handleRemoveMember(updatedMembers);
      //window.location.reload();
    }
  }

  render() {
    const { successful, message } = this.state;
    console.log(this.props.project.members);

    const initialValues = {
      title: '',
      selectedUser: '',
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
            data-cy="add-modal"
          >
            <Modal.Header>
              <Modal.Title>
                <h2>{this.props.project.title}</h2>
              </Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <div>
                  <label htmlFor="users">Users included in project:</label>
                  {this.props.project.members.length > 0 ? (
                    <div className="col">
                      {this.props.project.members.map((item) => {
                        return (
                          <div
                            key={item}
                            className="row border border-secondary bg-secondary p-2 text-dark mt-1 mb-1 rounded font-weight-bold"
                          >
                            <div className="col-sm-6">
                              <span className="" data-cy="member-email">
                                {item}
                              </span>
                            </div>
                            <div className="col-sm-6 d-flex flex-row-reverse">
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                size="1x"
                                color="#FF0000"
                                onClick={() => this.showDeleteModal(item)}
                                data-cy="delete-member-button"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div> There are no members yet! </div>
                  )}
                </div>
                {this.state.showDeleteModal ? (
                  <Modal show={true} data-cy="delete-modal">
                    <Modal.Header>
                      <Modal.Title>Remove User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Are you sure you want to remove this user?</p>
                    </Modal.Body>
                    <ModalFooter>
                      <Button
                        onClick={() => this.deleteRequest()}
                        style={{ backgroundColor: '#1976d2', border: 0 }}
                        data-cy="delete-yes"
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => this.showDeleteModal('prd')}
                        style={{ backgroundColor: '#575e65', border: 0 }}
                      >
                        No
                      </Button>
                    </ModalFooter>
                  </Modal>
                ) : null}
                <div>
                  <label htmlFor="users">Add users into project:</label>
                  <div className="searchForm">
                    <form>
                      <input
                        placeholder="Search for..."
                        className="form-control input-sm"
                        value={this.state.query}
                        onChange={this.handleInputChange}
                        data-cy="add-people-input"
                      />
                    </form>

                    <div className="mb-0 mt-1">
                      {this.state.filteredData.length > 0 ? (
                        <select
                          className="form-control"
                          id="selectSprint1"
                          onChange={this.onChange}
                          defaultValue={this.state.selectedUser!}
                        >
                          {this.state.filteredData.map((i) => (
                            <option
                              key={i.name}
                              onSelect={() => this.selectUser(i.email!)}
                            >
                              {i.name} ({i.email})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
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
                  type="button"
                  variant="primary"
                  className="btn btn-primary"
                  onClick={() => this.addUser()}
                  style={{ backgroundColor: '#1976d2', border: 0 }}
                  data-cy="add-button"
                >
                  Add
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

export { ProjectAddPoeple };
