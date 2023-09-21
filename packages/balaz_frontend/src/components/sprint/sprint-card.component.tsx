import { Component } from 'react';

import SprintType from '../../types/sprint.type';

import { faEdit, faSync, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserService from '../../services/user.service';

import { Button, Modal, ModalFooter } from 'react-bootstrap';
import { SprintPreview } from './sprint-preview.component';

type Props = {
  sprint: SprintType | undefined;
};

type MyState = {
  showComponent: boolean;
  update: boolean;
  isModalButtonClicked: boolean;
  showDeleteModal: boolean;
};

export default class SprintCard extends Component<Props, MyState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showComponent: false,
      update: false,
      isModalButtonClicked: false,
      showDeleteModal: false,
    };

    this.buttonClickedHandler = this.buttonClickedHandler.bind(this);
    this.updateComponent = this.updateComponent.bind(this);
    this.openModalPreview = this.openModalPreview.bind(this);
  }

  buttonClickedHandler = () => {
    this.setState({ isModalButtonClicked: !this.state.isModalButtonClicked });
  };

  openModalPreview = () => {
    this.setState({ showComponent: !this.state.showComponent });
  };

  updateComponent() {
    // const project_id = AuthService.getProject();
  }

  async deleteRequest(sprintId: string) {
    const response = await UserService.deleteSprint(sprintId);
    if (response.status === 200) {
      alert(response.data.message);
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
          data-cy="sprint-card"
        >
          <div className="card-body">
            <h5
              className="card-title font-weight-bold"
              key={this.props.sprint?._id}
              data-cy="sprint-title"
            >
              <span>Sprint: </span>
              {this.props.sprint?.title}
              {this.state.showComponent ? (
                <SprintPreview
                  sprint={this.props.sprint}
                  handleClose={this.openModalPreview}
                ></SprintPreview>
              ) : null}
            </h5>
            <div className="row">
              <div className="col-sm">
                <p>
                  <strong>Start date:</strong>{' '}
                  {new Date(this.props.sprint?.startDate).toLocaleString()}
                </p>
                <p>
                  <strong>End Date:</strong>{' '}
                  {new Date(this.props.sprint?.endDate).toLocaleString()}
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
                      data-cy="sprint-delete-button"
                    />
                  </div>
                </div>
                {this.state.showDeleteModal ? (
                  <Modal show={true} data-cy="sprint-delete-modal">
                    <Modal.Header>
                      <Modal.Title>Deleting Sprint</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <p>
                        With Sprint you are deleting also stories that are
                        included in this sprint and all tasks that were created
                        in stories.
                      </p>
                      <p>Are you sure you want to delete sprint?</p>
                    </Modal.Body>
                    <ModalFooter>
                      <Button
                        onClick={() =>
                          this.deleteRequest(this.props.sprint?._id)
                        }
                        style={{ backgroundColor: '#1976d2', border: 0 }}
                        data-cy="sprint-delete-yes"
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
            {this.props.sprint?.updated_at ? (
              <p className="card-text">
                {' '}
                <small>
                  Last update:{' '}
                  {new Date(this.props.sprint?.updated_at).toLocaleString()}
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
        <div className="card border-primary text-black rounded">
          <div className="card-body">
            <h5 className="card-title">No sprints yet</h5>
            <p className="card-text"></p>
          </div>
        </div>
      );
    }
  }
}
