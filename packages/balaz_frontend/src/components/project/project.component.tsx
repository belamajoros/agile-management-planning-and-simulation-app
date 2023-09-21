import React, { Component } from 'react';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import SprintCard from '../sprint/sprint-card.component';
import SprintForm from '../sprint/sprint-form.component';
import StoryCard from '../story/story-card.component';
import StoryForm from '../story/story-form.component';

import { ProjectAddPoeple } from '../projectModals/project-addPeople.component';
import { ProjectEdit } from '../projectModals/project-edit.component';

import ProjectType from '../../types/project.type';
import SprintType from '../../types/sprint.type';
import StoryType from '../../types/story.type';

import {
  faComments,
  faEdit,
  faPlusCircle,
  faTrashAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Modal, ModalFooter } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectChat from '../projectModals/project-chat.component';

type State = {
  sprints: [SprintType] | [];
  backlogSprints: [SprintType] | [];
  stories: [StoryType] | [];
  project: ProjectType;
  showDescription: boolean;
  onMouse: boolean;
  showPeopleModal: boolean;
  showShareModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  showChatModal: boolean;
  successful: boolean;
  message: string;
  showAddSprintModal: boolean;
  showAddStoryModal: boolean;
  username: string;
};

class Project extends Component<{ navigation: any; id: string }, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      sprints: [],
      backlogSprints: [],
      stories: [],
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
      showDescription: false,
      onMouse: false,
      showPeopleModal: false,
      showShareModal: false,
      showEditModal: false,
      showChatModal: false,
      showDeleteModal: false,
      successful: false,
      message: '',
      showAddSprintModal: false,
      showAddStoryModal: false,
      username: '',
    };

    this.handleHover = this.handleHover.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.showDescription = this.showDescription.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.showChatModal = this.showChatModal.bind(this);
    this.showShareModal = this.showShareModal.bind(this);
    this.showPeopleModal = this.showPeopleModal.bind(this);
    this.showAddSprintModal = this.showAddSprintModal.bind(this);
    this.showAddStoryModal = this.showAddStoryModal.bind(this);
  }
  async componentDidMount() {
    const project_id = this.props.id;
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      await UserService.getUser(currentUser.user._id).then(
        (response) => {
          this.setState({
            username: response.data.name,
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

    UserService.getProject(project_id).then(
      (response) => {
        console.log(response);
        this.setState({
          project: response.data,
        });
      },
      (error) => {
        this.setState({
          message: error,
          successful: false,
        });
      }
    );

    UserService.getUserStories(project_id).then(
      (response) => {
        this.setState({
          stories: response.data,
        });
      },
      (error) => {
        this.setState({
          message: error,
          successful: false,
        });
      }
    );

    UserService.getUserSprints(project_id).then(
      (response) => {
        this.setState({
          sprints: response.data,
        });
      },
      (error) => {
        this.setState({
          message: error,
          successful: false,
        });
      }
    );

    UserService.getUserBacklogSprints(project_id).then(
      (response) => {
        this.setState({
          backlogSprints: response.data,
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

  handleRemoveMember = (updatedMembersArray: [string]) => {
    this.setState((prevState) => ({
      project: {
        ...prevState.project,
        members: updatedMembersArray,
      },
    }));
  };

  showDescription = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };

  showPeopleModal = () => {
    this.setState({ showPeopleModal: !this.state.showPeopleModal });
  };

  showShareModal = () => {
    this.setState({ showShareModal: !this.state.showShareModal });
  };

  showEditModal = () => {
    this.setState({ showEditModal: !this.state.showEditModal });
  };

  showDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  showAddSprintModal = () => {
    this.setState({ showAddSprintModal: !this.state.showAddSprintModal });
  };

  showAddStoryModal = () => {
    this.setState({ showAddStoryModal: !this.state.showAddStoryModal });
  };

  showChatModal = () => {
    this.setState({ showChatModal: !this.state.showChatModal });
  };

  handleHover() {
    this.setState({ onMouse: !this.state.onMouse });
  }

  async deleteRequest(projectId: string) {
    const response = await UserService.deleteProject(projectId);
    if (response.status === 200) {
      this.props.navigation('/planner');
    }
  }

  render() {
    const btnClass = this.state.onMouse
      ? 'd-inline font-weight-bolder'
      : 'd-inline font-weight-normal font-weight';
    const {
      project,
      sprints,
      stories,
      showEditModal,
      showPeopleModal,
      showDeleteModal,
      showChatModal,
      showDescription,
      showAddSprintModal,
      showAddStoryModal,
    } = this.state;
    const { title, updated_at } = this.state.project;
    if (project._id !== '') {
      return (
        <div className="container">
          <div
            style={{
              border: 'solid',
              borderRadius: 15,
              borderColor: 'lightgray',
              margin: '1%',
              padding: '2%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="row">
              <div className="col-sm-8">
                <h1 data-cy="project-title">{title}</h1>
                <p>Last update: {new Date(updated_at!).toLocaleString()}</p>
                <p
                  onClick={this.showDescription}
                  className={btnClass}
                  onMouseEnter={this.handleHover}
                  onMouseLeave={this.handleHover}
                >
                  Show description
                </p>
              </div>
              <div className="col-sm-1"></div>
              <div className="col-sm-3">
                <div className="row mt-3">
                  <div className="col-sm-3">
                    <FontAwesomeIcon
                      icon={faComments}
                      size="1x"
                      color="#1976d2"
                      onClick={() => this.showChatModal()}
                      data-cy="chat-button"
                    />
                    {showChatModal ? (
                      <ProjectChat
                        projectId={this.state.project._id}
                        userName={this.state.username}
                        handleClose={this.showChatModal}
                      ></ProjectChat>
                    ) : null}
                  </div>
                  <div className="col-sm-3">
                    <FontAwesomeIcon
                      icon={faEdit}
                      size="1x"
                      color="#1976d2"
                      onClick={() => this.showEditModal()}
                      data-cy="project-edit"
                    />
                    {showEditModal ? (
                      <ProjectEdit
                        project={project}
                        handleClose={this.showEditModal}
                      ></ProjectEdit>
                    ) : null}
                  </div>
                  <div className="col-sm-3">
                    <FontAwesomeIcon
                      icon={faUsers}
                      size="1x"
                      color="#1976d2"
                      onClick={() => this.showPeopleModal()}
                      data-cy="project-add-people"
                    />
                    {showPeopleModal ? (
                      <ProjectAddPoeple
                        project={project}
                        handleClose={this.showPeopleModal}
                        handleRemoveMember={this.handleRemoveMember}
                      ></ProjectAddPoeple>
                    ) : null}
                  </div>
                  <div className="col-sm-3">
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size="1x"
                      color="#FF0000"
                      onClick={() => this.showDeleteModal()}
                      data-cy="project-delete"
                    />
                    {showDeleteModal ? (
                      <Modal show={true} data-cy="project-delete-modal">
                        <Modal.Header>
                          <Modal.Title data-cy="delete-title">
                            Delete project "{project.title}"
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p>
                            Just make sure you want to delete this projects
                            because with project you are also deleting sprints,
                            stories and tasks that are included in this project.
                          </p>
                          Are you sure you want to delete this project?
                        </Modal.Body>
                        <ModalFooter>
                          <Button
                            onClick={() => this.deleteRequest(project._id)}
                            style={{ backgroundColor: '#1976d2', border: 0 }}
                            data-cy="delete-project-yes"
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => this.showDeleteModal()}
                            style={{ backgroundColor: '#575e65', border: 0 }}
                            data-cy="delete-project-no"
                          >
                            No
                          </Button>
                        </ModalFooter>
                      </Modal>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {showDescription ? (
              <div>
                <p className="mb-5">{project.description}</p>
              </div>
            ) : (
              <div className="mb-5"></div>
            )}
            <div className="row">
              <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-10 align-items-start ">
                    <h4 className="card-title">Sprints</h4>
                  </div>
                  <div className="col-sm-2 d-flex flex-row-reverse ">
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      size="2x"
                      color="#7CFC00"
                      onClick={() => this.showAddSprintModal()}
                      data-cy="create-sprint-button"
                    />
                    {showAddSprintModal && (
                      <SprintForm
                        handleClose={this.showAddSprintModal}
                      ></SprintForm>
                    )}
                  </div>
                </div>
                {sprints.length > 0
                  ? sprints.map((item, ind) => (
                      <SprintCard sprint={item} key={ind}></SprintCard>
                    ))
                  : null}
              </div>
              <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-10 align-items-start">
                    <h4 className="card-title">Stories</h4>
                  </div>
                  {showAddStoryModal && (
                    <StoryForm handleClose={this.showAddStoryModal}></StoryForm>
                  )}
                  {sprints.length > 0 ? (
                    <div className="col-sm-2 d-flex flex-row-reverse">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        size="2x"
                        color="#7CFC00"
                        onClick={() => this.showAddStoryModal()}
                        data-cy="create-story-button"
                      />
                    </div>
                  ) : (
                    <div className="col-sm-2 d-flex flex-row-reverse">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        size="2x"
                        color="grey"
                      />
                    </div>
                  )}
                </div>
                {stories.length > 0
                  ? stories.map((item, ind) => (
                      <StoryCard story={item} key={ind}></StoryCard>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Somewhere appears to be error</div>;
    }
  }
}

const ProjectWrapper = (props: any) => {
  const navigation = useNavigate();
  const { id } = useParams();

  return <Project {...props} navigation={navigation} id={id} />;
};
export default ProjectWrapper;
