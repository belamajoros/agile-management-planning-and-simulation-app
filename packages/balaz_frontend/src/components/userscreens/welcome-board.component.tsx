import { Component } from 'react';

import * as Yup from 'yup';
import Login from '../userscreens/login.component';

import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

type State = {
  content: string;
  currentUser: string;
  data: Array<Object>;
};

class WelcomeBoard extends Component<{ navigation: any }, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      content: '',
      currentUser: '',
      data: [],
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

  async componentDidMount() {
    const userData = await AuthService.getCurrentUser();
    if (userData) {
      const ProjectFormData = await UserService.getUserProjects(
        userData.user._id
      );
      this.setState({
        currentUser: userData.user,
        data: ProjectFormData.data,
      });
    }
  }

  render() {
    const { currentUser, data } = this.state;
    console.log(data);
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            {currentUser ? (
              <div className="col mt-5">
                <h3>What is agile planning?</h3>
                <p>
                  Agile planning is a project planning method that estimates
                  work using self-contained work units called iterations or
                  sprints. Sprints are periods of 1-3 weeks in which a team
                  focuses on a small set of work items as well as OKRs, and aims
                  to complete them.
                </p>

                <p>
                  Agile planning also creates a repeatable process that helps
                  teams learn how much they can achieve. This is made easier and
                  more organized with working software that can allow you to
                  easily update and share iterations and move tasks to and from
                  your product backlog. More on this later.
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="col mt-5">
                  <h3>What is agile planning?</h3>
                  <p>
                    Agile planning is a project planning method that estimates
                    work using self-contained work units called iterations or
                    sprints. Sprints are periods of 1-3 weeks in which a team
                    focuses on a small set of work items as well as OKRs, and
                    aims to complete them.
                  </p>
                  <p>
                    Agile planning also creates a repeatable process that helps
                    teams learn how much they can achieve. This is made easier
                    and more organized with working software that can allow you
                    to easily update and share iterations and move tasks to and
                    from your product backlog. More on this later.
                  </p>
                </div>
                <div className="col">
                  <Login />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const WelcomeBoardWrapper = (props: any) => {
  const navigation = useNavigate();

  return <WelcomeBoard {...props} navigation={navigation} />;
};
export default WelcomeBoardWrapper;
