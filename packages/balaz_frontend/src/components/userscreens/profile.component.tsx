import { Component } from 'react';
import { Navigate as Redirect } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import ProjectType from '../../types/project.type';
import IUser from '../../types/user.type';

type Props = {};

type State = {
  redirect: string | null;
  userReady: boolean;
  currentUser: { user: IUser } & { token: string };
  message: string;
  successful: boolean;
  projects: [ProjectType] | [];
};

export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { user: { avatar: '', position: '' }, token: '' },
      message: '',
      successful: false,
      projects: [],
    };
  }

  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      await UserService.getUser(currentUser.user._id).then(
        (response) => {
          this.setState({
            currentUser: {
              user: response.data,
              token: this.state.currentUser.token,
            },
            message: '',
          });
        },
        (error) => {
          this.setState({
            message: error,
            successful: false,
          });
        }
      );

      await UserService.getProjectOfUser(
        currentUser.user._id,
        currentUser.user.email
      ).then(
        (response) => {
          this.setState({
            projects: response.data,
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

    if (!currentUser) this.setState({ redirect: '/home' });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect replace to={this.state.redirect} />;
    }
    const { currentUser } = this.state;
    console.log(currentUser);
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
          {this.state.userReady ? (
            <div>
              <header className="jumbotron">
                <h3>
                  <strong>{currentUser.user.name}</strong> Profile
                </h3>
                <img
                  src={this.state.currentUser.user.avatar}
                  alt="profile-img"
                  className="profile-img-card"
                />
              </header>
              {/*               <p>
                <strong>Token:</strong> {currentUser.token.substring(0, 20)} ...{' '}
                {currentUser.token.substr(currentUser.token.length - 20)}
              </p> */}
              <p>
                <strong>Id:</strong> {currentUser.user._id}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.user.email}
              </p>
              <strong>Roles:</strong>
              <ul>
                {currentUser.user.roles &&
                  currentUser.user.roles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
              </ul>
              <p>
                <strong>Position:</strong> {currentUser.user.position}
                {console.log(currentUser.user)}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
