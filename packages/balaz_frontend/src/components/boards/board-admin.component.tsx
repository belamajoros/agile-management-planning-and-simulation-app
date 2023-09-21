/* import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";

type Props = {};

type State = {
  content: string;
}

export default class BoardAdmin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getAdminBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }
} */

import { Button } from '@mui/material';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

function AdminCenter() {
  const navigate = useNavigate();

  const isUserAdminCheck = (): boolean => {
    console.log(AuthService.getCurrentUser());
    return AuthService.getCurrentUser() !== null;
  };
  return isUserAdminCheck() ? (
    <div
      style={{
        border: 'solid',
        borderRadius: 15,
        borderColor: 'lightgray',
        margin: '5%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 style={{ marginTop: '3%', textAlign: 'center' }}>
        Planner Entities{' '}
      </h2>
      <div
        style={{
          marginTop: ' 1%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          name="categoryList"
          style={{ marginRight: ' 1%', marginBottom: ' 1%' }}
          size={'large'}
          variant="contained"
          onClick={() => navigate('/center/projects')}
        >
          Projects
        </Button>
      </div>
    </div>
  ) : (
    <Navigate to={{ pathname: '/' }} />
  );
}

export default AdminCenter;
