import { Component } from 'react';
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import ProjectType from '../../types/project.type';
import ProjectForm from '../project/project-form.component';

import {
  faEdit,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createBrowserHistory } from 'history';

import { Button, Modal, ModalFooter } from 'react-bootstrap';

type State = {
  content: string;
  currentUser: string;
  data: ProjectType[];
  showDelete: boolean;
  showProjectForm: boolean;
  projectToDelete: { name: string; id: string };
};

class Home extends Component<{ navigation: any }, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      content: '',
      currentUser: '',
      data: [],
      showDelete: false,
      showProjectForm: false,
      projectToDelete: { name: '', id: '' },
    };

    this.showDeleteModal = this.showDeleteModal.bind(this);
  }

  validationSchema() {
    return Yup.object().shape({
      email: Yup.string()
        .email('This is not a valid email.')
        .required('This field is required!'),
      password: Yup.string().required('This field is required!'),
    });
  }

  async componentDidMount() {
    const userData = await AuthService.getCurrentUser();
    if (userData) {
      this.setState({
        currentUser: userData.user,
      });

      await UserService.getProjectOfUser(
        userData.user._id,
        userData.user.email
      ).then(
        (response) => {
          this.setState({
            data: response.data,
          });
        },
        (error) => {
          this.setState({
            content:
              (error.response && error.response.data) ||
              error.message ||
              error.toString(),
          });
        }
      );
    }
  }

  moveToProject(title: string, id: string): void {
    AuthService.addProject(id);
    this.props.navigation('/planner/' + id);
    /* this.props.navigation('/' + title.replace(/\s+/g, '').toLowerCase()); */
  }

  async deleteRequest(projectId: string) {
    const response = await UserService.deleteProject(projectId);
    if (response.status === 200) {
      window.location.reload();
    }
  }

  showDeleteModal = (name?: string, id?: string) => {
    this.setState({ showDelete: !this.state.showDelete });
    if (name && id) {
      this.setState({ projectToDelete: { name, id } });
    } else {
      this.setState({ projectToDelete: { name: '', id: '' } });
    }
  };

  showProjectForm = () => {
    this.setState({ showProjectForm: !this.state.showProjectForm });
  };

  showBacklog = () => {
    this.props.navigation('/backlog');
  };

  render() {
    const { data, projectToDelete } = this.state;
    return (
      <div className="container" data-cy="planner-comp">
        <div
          style={{
            border: 'solid',
            borderRadius: 15,
            borderColor: 'lightgray',
            margin: '3%',
            padding: '5%',
            paddingTop: '2%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="row mt-4" data-cy="planner-text">
            <h3>Why Use Agile Project Management?</h3>
            <p className="ml-2 mr-3">
              Agile project management uses short development cycles called
              “sprints,” each of which incorporates and adapts to stakeholder
              and customer feedback to produce an expertly-honed end product.
              Agile project management has become so popular partly due to the
              fast-paced nature of business today. With its focus on continued
              evolution and collaboration, the methodology targets organizations
              dealing with rapid to-market deadlines, shifting priorities, high
              stakeholder engagement, and a need for flexibility - in other
              words, most businesses today! Rather than spending six months
              developing a product or service that may be outdated by the time
              it hits the market, a company using Agile project management could
              release the first iteration within two weeks. They could then
              continue to release updated, adaptive versions over the next six
              months, resulting in a much more effective, relevant, and useful
              final deliverable. That`s why Agile project management, which was
              originally developed for software companies, has since been
              adopted by a wide variety of industries, from financial services
              to transportation.
            </p>
          </div>
          {data && data.length > 0 ? (
            <>
              <div className="row">
                <Button
                  className="ml-3"
                  style={{ maxWidth: '200px' }}
                  onClick={() => this.showProjectForm()}
                  data-cy="planner-create-2"
                >
                  Create a new project
                </Button>
                <Button
                  className="ml-3"
                  style={{ maxWidth: '200px' }}
                  onClick={() => this.showBacklog()}
                  data-cy="planner-backlog"
                >
                  Show backlogs
                </Button>
                <strong className="mt-2">Your projects:</strong>
              </div>
            </>
          ) : null}
          {data.length > 0 ? (
            data.map((item, index) => {
              return (
                <div className="card mt-2" key={index} data-cy="projects">
                  <div className="card-body">
                    <h5 className="card-title" data-cy="project-title">
                      {item.title}
                    </h5>
                    <div className="row">
                      <div className="col-sm-10">
                        <p className="card-text" data-cy="project-description">
                          Description:{' '}
                          {item.description.length > 100 ? (
                            <>{item.description.substring(0, 150)}... </>
                          ) : (
                            <>{item.description}</>
                          )}
                        </p>
                        <p>Members: {item.members.length}</p>
                      </div>
                      <div className="col-sm-2 align-center">
                        <div className="row">
                          <div className="col-sm">
                            <FontAwesomeIcon
                              icon={faEdit}
                              size="1x"
                              color="#1976d2"
                              data-cy="select-project"
                              onClick={() =>
                                this.moveToProject(item.title, item._id)
                              }
                            />
                          </div>
                          <div className="col-sm">
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="1x"
                              color="#FF0000"
                              onClick={() =>
                                this.showDeleteModal(item.title, item._id)
                              }
                              data-cy="delete-project"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-muted mb-9 pb-0">
                    Last update: {new Date(item.updated_at!).toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div>
              <h3>You dont have any projects yet.</h3>
              <p>
                Dont be shy and create one.
                <span> </span>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="lg"
                  color="#7CFC00"
                  onClick={() => this.showProjectForm()}
                  data-cy="planner-create-1"
                />
              </p>
              {/* {this.state.showProjectForm ? (
                <ProjectForm
                  history={createBrowserHistory}
                  handleClose={this.showProjectForm}
                ></ProjectForm>
              ) : null} */}
            </div>
          )}
          {this.state.showProjectForm ? (
            <ProjectForm
              history={createBrowserHistory}
              handleClose={this.showProjectForm}
            ></ProjectForm>
          ) : null}
          {this.state.showDelete ? (
            <Modal show={true} data-cy="delete-proj">
              <Modal.Header>
                <Modal.Title>
                  Delete project "{projectToDelete.name}"
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  With project you are deleting also sprints and stories that
                  are included in this project and all assigned tasks!
                </p>
                Are you sure you want to delete this project?
              </Modal.Body>
              <ModalFooter>
                <Button
                  onClick={() => this.deleteRequest(projectToDelete.id)}
                  data-cy="delete-yes-"
                >
                  Yes
                </Button>
                <Button onClick={() => this.showDeleteModal()}>No</Button>
              </ModalFooter>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

const HomeWrapper = (props: any) => {
  const navigation = useNavigate();

  return <Home {...props} navigation={navigation} />;
};
export default HomeWrapper;
