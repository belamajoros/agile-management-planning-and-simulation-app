/* eslint-disable array-callback-return */
import moment from 'moment';
import { Component } from 'react';
import { Line } from 'react-chartjs-2';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import ProjectType from '../../types/project.type';
import SprintType from '../../types/sprint.type';
import StoryType from '../../types/story.type';
import TaskType from '../../types/task.type';

import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import {
  faAsterisk,
  faAtom,
  faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SprintPreview } from '../sprint/sprint-preview.component';
import { StoryPreview } from '../story/story-preview.component';
import { TaskPreview } from '../task/task-preview.component';

type State = {
  Sprints: [SprintType] | any[] | [];
  Stories: [StoryType] | any[] | [];
  Projects: [ProjectType] | [];
  Tasks: [TaskType] | any[] | [];
  message: string | undefined;
  successful: boolean;
  showComponenSprint: boolean;
  showComponenStory: boolean;
  showComponenTask: boolean;
  selectedSprint: SprintType | undefined;
  selectedStory: StoryType | undefined;
  selectedTask: TaskType | undefined;
};

class Backlog extends Component<{ navigation: any }, State> {
  unlisten: any;
  constructor(props: any) {
    super(props);

    this.state = {
      Sprints: [],
      Stories: [],
      Projects: [],
      Tasks: [],
      message: '',
      successful: false,
      showComponenSprint: false,
      showComponenStory: false,
      showComponenTask: false,
      selectedSprint: undefined,
      selectedStory: undefined,
      selectedTask: undefined,
    };

    this.openModalPreviewSprint = this.openModalPreviewSprint.bind(this);
    this.openModalPreviewStory = this.openModalPreviewStory.bind(this);
    this.openModalPreviewTask = this.openModalPreviewTask.bind(this);
  }

  async componentDidMount() {
    const user = AuthService.getCurrentUser();

    await UserService.getBacklogProject(user.user._id).then(
      (response) => {
        this.setState({
          Projects: response.data,
        });
      },
      (error) => {
        this.setState({
          message: error,
          successful: false,
        });
      }
    );
    const Projects = this.state.Projects;

    // eslint-disable-next-line array-callback-return
    Projects.map((project) => {
      UserService.getUserBacklogSprints(project._id).then(
        (response) => {
          this.setState({
            Sprints: [...this.state.Sprints, ...response.data],
          });
        },
        (error) => {
          this.setState({
            message: error,
            successful: false,
          });
        }
      );

      UserService.getUserBacklogStories(project._id).then(
        (response) => {
          this.setState({
            Stories: [...this.state.Stories, ...response.data],
          });
          console.log('getUserBacklogStories');
          console.log(response.data);
        },
        (error) => {
          this.setState({
            message: error,
            successful: false,
          });
        }
      );
    });
    await UserService.getBacklogTasks().then(
      (response) => {
        this.setState({
          Tasks: response.data,
        });
        console.log('getBacklogTasks');
        console.log(response.data);
      },
      (error) => {
        this.setState({
          message: error,
          successful: false,
        });
      }
    );
  }

  openModalPreviewSprint = (sprint: SprintType) => {
    this.setState({
      showComponenSprint: !this.state.showComponenSprint,
      selectedSprint: sprint,
    });
  };

  openModalPreviewStory = (story: StoryType) => {
    this.setState({
      showComponenStory: !this.state.showComponenStory,
      selectedStory: story,
    });
  };

  openModalPreviewTask = (task: TaskType) => {
    this.setState({
      showComponenTask: !this.state.showComponenTask,
      selectedTask: task,
    });
  };

  boxMouseOverHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.backgroundColor = 'lightgrey';
  };

  boxMouseOutHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.backgroundColor = 'white';
  };

  render() {
    const { Stories, Sprints, Projects, Tasks } = this.state;

    const styles: { [key: string]: React.CSSProperties } = {
      box: {
        backgroundColor: 'white',
      },
    };

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
          {this.state.showComponenSprint ? (
            <SprintPreview
              sprint={this.state.selectedSprint}
              handleClose={this.openModalPreviewSprint}
            ></SprintPreview>
          ) : null}
          {this.state.showComponenStory ? (
            <StoryPreview
              story={this.state.selectedStory}
              handleClose={this.openModalPreviewStory}
            ></StoryPreview>
          ) : null}
          {this.state.showComponenTask ? (
            <TaskPreview
              task={this.state.selectedTask}
              handleClose={this.openModalPreviewTask}
            ></TaskPreview>
          ) : null}
          {Projects.map((project) => {
            return (
              <div className="row mt-2">
                <div
                  className="col pt-1"
                  style={{ backgroundColor: '#e0e0e0' }}
                >
                  <span className="font-weight-bold" style={{ fontSize: 20 }}>
                    {project.title}
                  </span>
                  {Sprints.length > 0 ? (
                    <span className="font-weight-normal">
                      <span> </span>
                      (Sprints:{' '}
                      {
                        Sprints.filter((x) => x.project_id === project._id)
                          .length
                      }{' '}
                      problems, Stories:{' '}
                      {
                        Stories.filter((x) => x.project_id === project._id)
                          .length
                      }{' '}
                      problems, Tasks:{' '}
                      {
                        Tasks.filter(
                          (x) =>
                            Stories.map((y) => y._id).includes(x.story_id) &&
                            Stories.filter((y) => y.project_id === project._id)
                              .map((y) => y._id)
                              .includes(x.story_id)
                        ).length
                      }
                      {/* {Tasks.length} */} problems)
                    </span>
                  ) : (
                    <span className="font-weight-normal ml-3">
                      There are no active sprints for this project.
                    </span>
                  )}
                  {/* <span className="font-weight-normal">
                    <span> </span>
                    (Sprints:{' '}
                    {
                      Sprints.filter((x) => x.project_id === project._id).length
                    }{' '}
                    problems, Stories:{' '}
                    {Stories.filter((x) => x.project_id === project._id).length}{' '}
                    problems, Tasks:{' '}
                    {
                      Tasks.filter(
                        (x) =>
                          Stories.map((y) => y._id).includes(x.story_id) &&
                          Stories.filter((y) => y.project_id === project._id)
                            .map((y) => y._id)
                            .includes(x.story_id)
                      ).length
                    }
                    problems)
                  </span> */}
                  <p>
                    <span> </span>
                    {project.members.map((member) => {
                      console.log(member);
                      return <span></span>;
                    })}
                  </p>
                  <Card className="mt-3 mb-3 p-0">
                    {/* {Sprints ? (
                    Sprints.map((sprint: SprintType, indx) => {
                      if (sprint.project_id === project._id) {
                        return (
                          <div
                            className="border-bottom border-grey m-0 p-0"
                            style={styles.box}
                            onMouseOver={this.boxMouseOverHandler}
                            onMouseOut={this.boxMouseOutHandler}
                            onClick={() => this.openModalPreviewSprint(sprint)}
                          >
                            <p className="m-0 p-1">
                              <span>
                                <FontAwesomeIcon
                                  icon={faAtom}
                                  size="1x"
                                  color="#1976d2"
                                />{' '}
                              </span>
                              {sprint.title} (
                              {new Date(sprint.startDate).toLocaleDateString()}{' '}
                              - {new Date(sprint.endDate).toLocaleDateString()})
                            </p>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <p>No Stories or Sprints for this Project</p>
                  )}
                  {Stories ? (
                    Stories.map((story: StoryType) => {
                      if (story.project_id === project._id) {
                        return (
                          <div
                            className="border-bottom border-grey m-0 p-0"
                            style={styles.box}
                            onMouseOver={this.boxMouseOverHandler}
                            onMouseOut={this.boxMouseOutHandler}
                            onClick={() => this.openModalPreviewStory(story)}
                          >
                            <p className="m-0 p-1 ">
                              <span>
                                <FontAwesomeIcon
                                  icon={faAsterisk}
                                  size="1x"
                                  color="green"
                                />{' '}
                              </span>
                              {story.title} ({story.progress})
                            </p>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <p>No Stories or Sprints for this Project</p>
                  )}
                  {Stories && Tasks ? (
                    Stories.map((story: StoryType) => {
                      if (story.project_id === project._id) {
                        return Tasks.map((task: TaskType) => {
                          if (story._id === task.story_id) {
                            return (
                              <div
                                className="border-bottom border-grey m-0 p-0"
                                style={styles.box}
                                onMouseOver={this.boxMouseOverHandler}
                                onMouseOut={this.boxMouseOutHandler}
                                onClick={() => this.openModalPreviewTask(task)}
                              >
                                <p className="m-0 p-1 ">
                                  <span>
                                    <FontAwesomeIcon
                                      icon={faClipboardCheck}
                                      size="1x"
                                      color="#1976d2"
                                    />{' '}
                                  </span>
                                  {task.title}
                                </p>
                              </div>
                            );
                          }
                        });
                      }
                    })
                  ) : (
                    <p>No Stories or Sprints for this Project</p>
                  )} */}
                    {Sprints.map((sprint: SprintType) => {
                      if (sprint.project_id === project._id) {
                        const tasksInSprint = Tasks.filter(
                          (x) =>
                            Stories.map((y) => y._id).includes(x.story_id) &&
                            Stories.filter((y) => y.project_id === project._id)
                              .map((y) => y._id)
                              .includes(x.story_id)
                        );
                        var date1 = moment(sprint.startDate);
                        var date2 = moment(sprint.endDate);

                        let days: string[][] = [];

                        while (date1.isBefore(date2)) {
                          days.push([
                            date1.format('MM-DD'),
                            date1.format('YYYY-MM-DD'),
                          ]);

                          date1.add(1, 'day');
                        }
                        days.push([
                          date2.format('MM-DD'),
                          date2.format('YYYY-MM-DD'),
                        ]);
                        var labels = [];
                        for (var i = 0; i < days.length; i++) {
                          labels.push(
                            'Day ' + (i + 1) + ' (' + days[i][0] + ')'
                          );
                        }
                        /* console.log(days);
                        console.log(labels); */
                        let data: Array<number> = [];
                        for (var x = 0; x < labels.length; x++) {
                          if (
                            moment().isSameOrAfter(
                              moment(days[x][1], 'YYYY-MM-DD')
                            )
                          ) {
                            data.push(100);
                          } else {
                            break;
                          }
                          for (var y = 0; y < tasksInSprint.length; y++) {
                            let currentDate = moment(
                              tasksInSprint[y].updated_at,
                              'YYYY-MM-DD'
                            );
                            let sprintDay = moment(days[x][1], 'YYYY-MM-DD');
                            if (
                              tasksInSprint[y].done &&
                              currentDate.isSameOrBefore(sprintDay)
                            ) {
                              data[x] -= 100 / tasksInSprint.length;
                            }
                          }
                        }

                        const chartData = {
                          labels: labels,
                          datasets: [
                            {
                              label: 'Remaining Work',
                              data: data,
                              backgroundColor: 'rgba(255, 99, 132, 0.2)',
                              borderColor: 'rgba(255, 99, 132, 1)',
                              fill: true,
                            },
                          ],
                        };
                        return (
                          <div>
                            <div
                              className="border-bottom border-grey m-0 p-0 ml-1"
                              style={styles.box}
                              onMouseOver={this.boxMouseOverHandler}
                              onMouseOut={this.boxMouseOutHandler}
                              onClick={() =>
                                this.openModalPreviewSprint(sprint)
                              }
                            >
                              <p className="m-0 p-1">
                                <span>
                                  <FontAwesomeIcon
                                    icon={faAtom}
                                    size="1x"
                                    color="#1976d2"
                                  />{' '}
                                </span>
                                {sprint.title} (
                                {new Date(
                                  sprint.startDate
                                ).toLocaleDateString()}{' '}
                                -{' '}
                                {new Date(sprint.endDate).toLocaleDateString()})
                              </p>
                            </div>
                            <div>
                              <Line
                                data={chartData}
                                options={{
                                  responsive: true,
                                  /* maintainAspectRatio: false, */
                                  scales: {
                                    yAxes: [
                                      {
                                        ticks: {
                                          beginAtZero: false,
                                          max: 100,
                                          min: 0,
                                        },
                                      },
                                    ],
                                  },
                                }}
                              />
                            </div>
                            {Stories.map((story: StoryType) => {
                              console.log(story);
                              console.log(sprint);
                              /* if (story.project_id === sprint.project_id && story.) { */
                              if (story.sprint_id === sprint._id) {
                                //fix
                                return (
                                  <div>
                                    <div
                                      className="border-bottom border-grey m-0 p-0 ml-2"
                                      style={styles.box}
                                      onMouseOver={this.boxMouseOverHandler}
                                      onMouseOut={this.boxMouseOutHandler}
                                      onClick={() =>
                                        this.openModalPreviewStory(story)
                                      }
                                    >
                                      <p className="m-0 p-1 ">
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faAsterisk}
                                            size="1x"
                                            color="green"
                                          />{' '}
                                        </span>
                                        {story.title} ({story.progress})
                                      </p>
                                    </div>
                                    {Tasks.map((task: TaskType) => {
                                      if (task.story_id === story._id) {
                                        return (
                                          <div
                                            className="border-bottom border-grey m-0 p-0 ml-3"
                                            style={styles.box}
                                            onMouseOver={
                                              this.boxMouseOverHandler
                                            }
                                            onMouseOut={this.boxMouseOutHandler}
                                            onClick={() =>
                                              this.openModalPreviewTask(task)
                                            }
                                          >
                                            <p className="m-0 p-1 ">
                                              <span>
                                                <FontAwesomeIcon
                                                  icon={faClipboardCheck}
                                                  size="1x"
                                                  color="#1976d2"
                                                />{' '}
                                              </span>
                                              {task.title}
                                            </p>
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        );
                      }
                    })}
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const BacklogWrapper = (props: any) => {
  const navigation = useNavigate();

  return <Backlog {...props} navigation={navigation} />;
};
export default BacklogWrapper;
