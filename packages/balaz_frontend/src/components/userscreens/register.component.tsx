import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Component } from 'react';
import * as Yup from 'yup';

import { Link, useNavigate } from 'react-router-dom';
import BearIcon from '../../assets/BearIcon.png';
import BunnyIcon from '../../assets/BunnyIcon.png';
import CatIcon from '../../assets/CatIcon.png';
import CowIcon from '../../assets/CowIcon.png';
import FoxIcon from '../../assets/FoxIcon.png';
import GepardIcon from '../../assets/GepardIcon.png';
import GiraffeIcon from '../../assets/GiraffeIcon.png';
import GorrilaIcon from '../../assets/GorrilaIcon.png';
import KrtIcon from '../../assets/KrtIcon.png';
import LensIcon from '../../assets/LensIcon.png';
import LionIcon from '../../assets/LionIcon.png';
import MonkeyIcon from '../../assets/MonkeyIcon.png';
import PandaIcon from '../../assets/PandaIcon.png';
import SobIcon from '../../assets/SobIcon.png';
import WolfIcon from '../../assets/WolfIcon.png';
import AuthService from '../../services/auth.service';

import { Button, Modal, ModalFooter } from 'react-bootstrap';

type State = {
  username: string;
  email: string;
  password: string;
  successful: boolean;
  message: string;
  positionSelected: string;
  positions: string[];
  avatarModal: boolean;
  selectedAvatar: string;
};

class Register extends Component<{ navigation: any }, State> {
  constructor(props: any) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      username: '',
      email: '',
      password: '',
      successful: false,
      message: '',
      positionSelected: 'Back-end web developer',
      positions: [
        'Back-end web developer',
        'Front-end web developer',
        'Designer',
        'Documentation editor',
        'Database administrator',
        'IT security specialist',
        'Quality assurance tester',
        'Product Owner',
      ],
      avatarModal: false,
      selectedAvatar: '//ssl.gstatic.com/accounts/ui/avatar_2x.png',
    };
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          'len',
          'The username must be between 3 and 20 characters.',
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 20
        )
        .required('This field is required!'),
      email: Yup.string()
        .email('This is not a valid email.')
        .required('This field is required!'),
      password: Yup.string()
        .test(
          'len',
          'The password must be between 6 and 40 characters.',
          (val: any) =>
            val && val.toString().length >= 6 && val.toString().length <= 40
        )
        .required('This field is required!'),
    });
  }

  handleRegister(formValue: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username, email, password } = formValue;
    const avatarBase64 = this.state.selectedAvatar;
    const position = this.state.positionSelected;
    this.setState({
      message: '',
      successful: false,
    });

    AuthService.register(
      username,
      email,
      password,
      position,
      avatarBase64
    ).then(
      (response) => {
        this.setState({
          message: response.data.message,
          successful: true,
        });
        /* AuthService.login(email, password).then(() => {
          this.props.navigation('/home');
          window.location.reload();
        }); */
        this.props.navigation('/login');
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

  onChange = (event: React.ChangeEvent<{ value: string }>) => {
    this.setState({
      positionSelected: event.target.value,
    });
  };

  openModalForAvatar() {
    this.setState({
      avatarModal: !this.state.avatarModal,
    });
  }

  saveAvatar(avatar: string): void {
    this.setState({
      selectedAvatar: avatar,
    });
    this.openModalForAvatar();
  }

  boxMouseOverHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.border = 'solid';
    box.style.width = '106px';
    box.style.height = '106px';
    box.style.borderColor = 'grey';
    box.style.borderWidth = '2px';
  };

  boxMouseOutHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.border = '';
    box.style.width = '96px';
    box.style.height = '96px';
    box.style.borderWidth = '0';
    box.style.borderColor = '';
  };

  render() {
    const { successful, message, positions } = this.state;
    const avatars = [
      BearIcon,
      FoxIcon,
      BunnyIcon,
      CatIcon,
      CowIcon,
      GepardIcon,
      GiraffeIcon,
      GorrilaIcon,
      KrtIcon,
      LensIcon,
      LionIcon,
      MonkeyIcon,
      PandaIcon,
      SobIcon,
      WolfIcon,
    ];
    const initialValues = {
      username: '',
      email: '',
      password: '',
    };

    const styles: { [key: string]: React.CSSProperties } = {
      box: {
        width: '96px',
        height: '96px',
        border: '',
        borderWidth: '1px',
        borderColor: '',
      },
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src={this.state.selectedAvatar}
            alt="profile-img"
            className="profile-img-card"
            style={styles.box}
            onMouseOver={this.boxMouseOverHandler}
            onMouseOut={this.boxMouseOutHandler}
            onClick={() => this.openModalForAvatar()}
          />
          {this.state.avatarModal ? (
            <Modal show={true}>
              <Modal.Header>
                <Modal.Title>Choose your avatar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  {avatars.map((avatar) => {
                    return (
                      <div className="col">
                        <img
                          src={avatar}
                          alt="profile-img"
                          className="profile-img-avatar"
                          style={styles.box}
                          onMouseOver={this.boxMouseOverHandler}
                          onMouseOut={this.boxMouseOutHandler}
                          onClick={() => this.saveAvatar(avatar)}
                        />
                      </div>
                    );
                  })}
                </div>
              </Modal.Body>
              <ModalFooter>
                <Button
                  onClick={() => this.openModalForAvatar()}
                  style={{ backgroundColor: '#575e65', border: 0 }}
                >
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          ) : null}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username"> Username </label>
                    <Field
                      name="username"
                      type="text"
                      className="form-control"
                      data-cy="username-input"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                      data-cy="error-username"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email"> Email: </label>
                    <Field
                      name="email"
                      type="text"
                      className="form-control"
                      data-cy="email-input"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                      data-cy="error-email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password"> Password: </label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      data-cy="password-input"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                      data-cy="error-password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Position"> Position: </label>
                    <select
                      className="form-control"
                      id="selectSprint1"
                      onChange={this.onChange}
                      defaultValue={positions[0]}
                      data-cy="select-position"
                    >
                      {positions.map((position, idx) => (
                        <option key={idx}>{position}</option>
                      ))}
                    </select>
                    <ErrorMessage
                      name="position"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      style={{ backgroundColor: '#1976d2', border: 0 }}
                    >
                      Register!
                    </button>
                  </div>
                </div>
              )}
              <div>
                Already have an account? <a href="/login">Log In</a>
              </div>

              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? 'alert alert-success' : 'alert alert-danger'
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}

const RegisterWrapper = (props: any) => {
  const navigation = useNavigate();

  return <Register {...props} navigation={navigation} />;
};
export default RegisterWrapper;
