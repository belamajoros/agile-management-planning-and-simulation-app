import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';

import AuthService from './services/auth.service';
import UserService from './services/user.service';
import ProjectType from './types/project.type';
import IUser from './types/user.type';

import Backlog from './components/backlog/backlog.component';
import BoardAdmin from './components/boards/board-admin.component';
import BoardModerator from './components/boards/board-moderator.component';
import BoardUser from './components/boards/board-user.component';
import UsersList from './components/boards/entities/usersList';
import ProjectForm from './components/project/project-form.component';
import Project from './components/project/project.component';
import Sprint from './components/sprint/sprint-form.component';
import Story from './components/story/story-form.component';
import { StoryPreview } from './components/story/story-preview.component';
import Home from './components/userscreens/home.component';
import Login from './components/userscreens/login.component';
import Profile from './components/userscreens/profile.component';
import Register from './components/userscreens/register.component';
import WelcomeBoard from './components/userscreens/welcome-board.component';

import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createBrowserHistory } from 'history';
import * as ReactBootstrap from 'react-bootstrap';
import EventBus from './common/EventBus';
import BacklogWrapper from './components/backlog/backlog.component';
import ProjectWrapper from './components/project/project.component';
import HomeWrapper from './components/userscreens/home.component';
import LoginWrapper from './components/userscreens/login.component';
import RegisterWrapper from './components/userscreens/register.component';
import WelcomeBoardWrapper from './components/userscreens/welcome-board.component';

type Props = {};

type State = {
  showModeratorBoard: boolean;
  showAdminBoard: boolean;
  currentUser: IUser | undefined;
  data: [ProjectType] | [];
  showProjectForm: boolean;
  showDropdownProfile: boolean;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      data: [],
      currentUser: undefined,
      showProjectForm: false,
      showDropdownProfile: false,
    };
  }

  async componentDidMount() {
    const userData = AuthService.getCurrentUser();
    console.log(userData);
    if (userData) {
      await UserService.getUser(userData.user._id).then((response) => {
        this.setState({
          currentUser: response.data,
        });
      });
      await UserService.getProjectOfUser(
        userData.user._id,
        userData.user.email
      ).then((response) => {
        console.log(response);
        this.setState({
          data: response.data,
          showModeratorBoard: userData.user.roles.includes('ROLE_MODERATOR'),
          showAdminBoard: userData.user.roles.includes('ROLE_ADMIN'),
        });
      });
    }

    EventBus.on('logout', this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove('logout', this.logOut);
  }

  addProjectId(id: string) {
    this.setState({
      showModeratorBoard: false,
    });
    AuthService.addProject(id);
  }

  showProjectForm = () => {
    this.setState({ showProjectForm: !this.state.showProjectForm });
  };

  profileclick = () => {
    this.setState({ showDropdownProfile: !this.state.showDropdownProfile });
  };

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  boxMouseOverHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.border = 'solid';
    box.style.width = '40px';
    box.style.height = '40px';
    box.style.borderColor = 'grey';
    box.style.borderWidth = '2px';
  };

  boxMouseOutHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.border = '';
    box.style.width = '40px';
    box.style.height = '40px';
    box.style.borderWidth = '0';
    box.style.borderColor = '';
  };

  render() {
    const {
      currentUser,
      data,
      showModeratorBoard,
      showAdminBoard,
      showProjectForm,
      showDropdownProfile,
    } = this.state;
    const styles: { [key: string]: React.CSSProperties } = {
      box: {
        width: '40px',
        height: '40px',
        border: '',
        borderWidth: '1px',
        borderColor: '',
      },
    };
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark mb-0 pb-0">
          <Link to={'/'} className="navbar-brand">
            AgIle
          </Link>
          <div className="navbar-nav mr-auto">
            {currentUser && (
              <li className="nav-item">
                <Link to={'/home'} className="nav-link">
                  Home
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link to={'/backlog'} className="nav-link">
                  Backlog
                </Link>
              </li>
            )}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={'/mod'} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={'/admin'} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <ReactBootstrap.Dropdown as={ReactBootstrap.ButtonGroup}>
                  <ReactBootstrap.Dropdown.Toggle
                    variant="info"
                    id="dropdown-custom-2"
                    style={{ backgroundColor: '#1976d2', border: 0 }}
                  >
                    Projects
                  </ReactBootstrap.Dropdown.Toggle>
                  {data.length > 0 ? (
                    <ReactBootstrap.Dropdown.Menu>
                      {data.map((data, ind) => (
                        <ReactBootstrap.Dropdown.Item eventKey={ind}>
                          <Link
                            to={data.title.replace(/\s+/g, '').toLowerCase()}
                            className="nav-link text-secondary"
                            key={data._id}
                            onClick={() => this.addProjectId(data._id)}
                          >
                            {data.title}
                          </Link>
                        </ReactBootstrap.Dropdown.Item>
                      ))}
                    </ReactBootstrap.Dropdown.Menu>
                  ) : (
                    <ReactBootstrap.Dropdown.Menu>
                      <ReactBootstrap.Dropdown.Item>
                        <p
                          className="text-secondary"
                          onClick={() => this.showProjectForm()}
                        >
                          {' '}
                          Create Project
                        </p>
                      </ReactBootstrap.Dropdown.Item>
                    </ReactBootstrap.Dropdown.Menu>
                  )}
                </ReactBootstrap.Dropdown>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-md-auto">
              <li className="nav-item pt-1 pb-0">
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="2x"
                  color="#7CFC00"
                  onClick={() => this.showProjectForm()}
                />
                {showProjectForm ? (
                  <ProjectForm
                    history={createBrowserHistory}
                    handleClose={this.showProjectForm}
                  ></ProjectForm>
                ) : null}
              </li>
              <div className="ml-1 mb-0 pb-0">
                <div
                  onClick={() => {
                    this.profileclick();
                  }}
                >
                  <ReactBootstrap.Dropdown>
                    <img
                      src={this.state.currentUser?.avatar}
                      alt="profile-img"
                      className="profile-img-card"
                      style={styles.box}
                      onMouseOver={this.boxMouseOverHandler}
                      onMouseOut={this.boxMouseOutHandler}
                    />
                    {showDropdownProfile ? (
                      <ReactBootstrap.Dropdown.Menu
                        show={showDropdownProfile}
                        style={{
                          position: 'absolute',
                          left: '-8em',
                          top: '3em',
                        }}
                      >
                        <ReactBootstrap.Dropdown.Item
                          eventKey={1}
                          className="nav-link "
                        >
                          <Link
                            to={'/profile'}
                            className="nav-link text-secondary"
                          >
                            {currentUser.name}
                          </Link>
                        </ReactBootstrap.Dropdown.Item>
                        <ReactBootstrap.Dropdown.Item
                          eventKey={2}
                          className="nav-link text-secondary"
                        >
                          <a
                            href="/login"
                            className="nav-link text-secondary"
                            onClick={this.logOut}
                          >
                            Log Out
                          </a>
                        </ReactBootstrap.Dropdown.Item>
                      </ReactBootstrap.Dropdown.Menu>
                    ) : null}
                  </ReactBootstrap.Dropdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/login'} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={'/register'} className="nav-link">
                  Register
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<WelcomeBoardWrapper />} />
            <Route path="/home" element={<HomeWrapper />} />
            <Route path="/backlog" element={<BacklogWrapper />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/register" element={<RegisterWrapper />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sprint/create" element={Sprint} />
            <Route path="/story/create" element={Story} />
            <Route path="/story/:storyTitle" element={StoryPreview} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/planner/:id" element={<ProjectWrapper />} />
            {/* {data &&
              data.map((data) => {
                return (
                  <Route
                    path={'/' + data.title.replace(/\s+/g, '').toLowerCase()}
                    element={<ProjectWrapper />}
                  />
                );
              })} */}
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
