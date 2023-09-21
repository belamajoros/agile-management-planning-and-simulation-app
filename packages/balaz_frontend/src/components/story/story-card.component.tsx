import { Component } from 'react';

import StoryType from '../../types/story.type';

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import { StoryPreview } from './story-preview.component';

import { faEdit, faSync, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressBar from '@ramonak/react-progress-bar';
import { Button, Modal, ModalFooter } from 'react-bootstrap';

type Props = {
  story: StoryType | undefined;
};

type MyState = {
  sprint: undefined;
  showComponent: boolean;
  update: boolean;
  showDeleteModal: boolean;
};

export default class StoryCard extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sprint: undefined,
      showComponent: false,
      update: false,
      showDeleteModal: false,
    };

    this.openModalPreview = this.openModalPreview.bind(this);
    this.updateComponent = this.updateComponent.bind(this);
  }

  componentDidMount() {
    const project_id = AuthService.getProject();

    UserService.getUserSprints(project_id).then(
      (response) => {
        this.setState({
          sprint: response.data,
        });
      },
      (error) => {
        this.setState({});
      }
    );
  }

  openModalPreview = () => {
    this.setState({ showComponent: !this.state.showComponent });
  };

  updateComponent() {
    this.forceUpdate();
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

  _onDeleteButton = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  render() {
    if (this.props) {
      return (
        <div
          className="card border-primary text-black rounded mt-2"
          data-cy="story-card"
        >
          <div className="card-body">
            <h5
              className="card-title font-weight-bold"
              key={this.props.story?._id}
            >
              <span>#Story: </span>
              {this.props.story?.title}
              {this.state.showComponent ? (
                <StoryPreview
                  story={this.props.story}
                  handleClose={this.openModalPreview}
                ></StoryPreview>
              ) : null}
            </h5>
            <div className="row">
              <div className="col-sm-5">
                <ProgressBar completed={this.props.story!.progress} />
              </div>
              <div className="col-sm-4">
                <p className="font-weight-bold">
                  Sprint: {this.props.story?.sprint_title}
                </p>
              </div>
              <div className="col-sm-3">
                <div className="row">
                  <div className="col-sm-4">
                    <FontAwesomeIcon
                      icon={faEdit}
                      size="1x"
                      color="#1976d2"
                      onClick={this.openModalPreview}
                      data-cy="story-edit"
                    />
                  </div>
                  <div className="col-sm-4">
                    <FontAwesomeIcon
                      icon={faSync}
                      size="1x"
                      color="#1976d2"
                      onClick={this.updateComponent}
                    />
                  </div>
                  <div className="col-sm-4">
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size="1x"
                      color="#FF0000"
                      onClick={this._onDeleteButton}
                      data-cy="story-delete"
                    />
                  </div>
                </div>
                {this.state.showDeleteModal ? (
                  <Modal show={true} data-cy="story-delete-modal">
                    <Modal.Header>
                      <Modal.Title>Deleting story</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
                        With Story you are deleting all tasks that are related
                        with this story.
                      </p>
                      <p>Are you sure you want to delete story?</p>
                    </Modal.Body>
                    <ModalFooter>
                      <Button
                        onClick={() =>
                          this.deleteRequest(this.props.story?._id)
                        }
                        style={{ backgroundColor: '#1976d2', border: 0 }}
                        data-cy="delete-story-yes"
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => this._onDeleteButton()}
                        style={{ backgroundColor: '#575e65', border: 0 }}
                      >
                        No
                      </Button>
                    </ModalFooter>
                  </Modal>
                ) : null}
              </div>
            </div>
            {this.props.story?.updated_at ? (
              <p className="card-text">
                <small>
                  Last update:{' '}
                  {new Date(this.props.story?.updated_at).toLocaleString()}
                </small>
              </p>
            ) : (
              <p className="card-text">
                <small>Last update: </small>
              </p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="card border text-white bg-secondary rounded">
          <div className="card-body">
            <h5 className="card-title" data-cy="no-stories">
              No stories yet
            </h5>
            <p className="card-text"></p>
          </div>
        </div>
      );
    }
  }
}
