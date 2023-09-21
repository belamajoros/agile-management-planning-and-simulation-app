import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import AuthService from '../../services/auth.service';

type State = {
  email: string;
  password: string;
  loading: boolean;
  message: string;
};

class Login extends Component<{ navigation: any }, State> {
  constructor(props: any) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      email: '',
      password: '',
      loading: false,
      message: '',
    };
  }

  validationSchema() {
    return Yup.object().shape({
      email: Yup.string()
        .email('This is not a valid email.')
        .required('This field is required!'),
      password: Yup.string().required('This field is required!'),
    });
  }

  handleLogin(formValue: { email: string; password: string }) {
    const { email, password } = formValue;

    this.setState({
      message: '',
      loading: true,
    });

    AuthService.login(email, password).then(
      () => {
        window.dispatchEvent(new Event('user'));
        /* this.props.navigation('/'); */
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage,
        });
      }
    );
  }

  render() {
    const { loading, message } = this.state;

    const initialValues = {
      email: '',
      password: '',
    };

    return (
      <div className="col-md-12" data-cy="login-component">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleLogin}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="email"> Email </label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="alert alert-danger"
                  data-cy="error-email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                  data-cy="error-password"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                  style={{ backgroundColor: '#1976d2', border: 0 }}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>
              <Link to="/register" className="link-primary">
                Register a new account
              </Link>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert" data-cy="error-msg">
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

const LoginWrapper = (props: any) => {
  const navigation = useNavigate();
  return <Login {...props} navigation={navigation} />;
};
export default LoginWrapper;
