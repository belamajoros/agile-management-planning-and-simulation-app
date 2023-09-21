import axios from 'axios';
import { string } from 'yup';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/';

class UserService {

  async getUserProjects(userId : string) {
    const response = await axios.get(API_URL + 'project/user/' + userId, { headers: authHeader() });
    return response;
  }

  async getProject(projectId : string) {
    const response = await axios.get(API_URL + 'project/' + projectId, { headers: authHeader() });
    return response;
  }

  async getAllProjects() {
    const response = await axios.get(API_URL + 'project/allProjects', { headers: authHeader() });
    return response;
  }

  async getBacklogProject(userId : string) {
    const response = await axios.get(API_URL + 'project/backlog/' + userId, { headers: authHeader() });
    return response;
  }

  async getBacklogTasks() {
    const response = await axios.get(API_URL + 'task/backlog/tasks', { headers: authHeader() });
    return response;
  }

  async getUsers() {
    const response = await axios.get(API_URL + 'users/' , { headers: authHeader() });
    return response;
  }

  async deleteUser(userId: string) {
    const response = await axios.delete(API_URL + 'users/delete/' + userId, { headers: authHeader() });
    return response;
  }

  async getUser(userId: string) {
    const response = await axios.get(API_URL + 'users/' + userId, { headers: authHeader() });
    return response;
  }

  async getProjectOwner(user_id: string) {
    const response = await axios.get(API_URL + 'users/' + user_id, { headers: authHeader() });
    return response;
  }

  async getUserStories(projectId : string) {
    const response = await axios.get(API_URL + 'story/' + projectId, { headers: authHeader() });
    return response;
  }

  async getSprintStories(sprintId : string) {
    const response = await axios.get(API_URL + 'story/sprint/' + sprintId, { headers: authHeader() });
    return response;
  }

  //TODO
  async getProjectSprints(projectId : string) {
    const response = await axios.get(API_URL + 'sprint/project/' + projectId, { headers: authHeader() });
    return response;
  }

  async getUserSprints(projectId : string) {
    const response = await axios.get(API_URL + 'sprint/' + projectId, { headers: authHeader() });
    return response;
  }

  async getUserBacklogSprints(projectId : string) {
    const response = await axios.get(API_URL + 'sprint/backlog/' + projectId, { headers: authHeader() });
    return response;
  }

  async getUserBacklogStories(projectId : string) {
    const response = await axios.get(API_URL + 'story/backlog/' + projectId, { headers: authHeader() });
    return response;
  }

  async getTasks(story_id : string) {
    const response = await axios.get(API_URL + 'task/' + story_id, { headers: authHeader() });
    return response;
  }

  async getProjectOfUser(user_id: string, email: string) {
    const response = axios.post(API_URL + "project/all", {
      user_id,
      email,
    });
    return response;
  }

  addProject(user_id: string, title: string, description: string) {
    const response = axios.post(API_URL + "project/create", {
      user_id,
      title,
      description
    });
    return response;
  }

  addSprint(user_id: string, project_id: string, title: string, startDate: Date, endDate: Date) {
    const response = axios.post(API_URL + "sprint/create", {
      user_id,
      project_id,
      title,
      startDate,
      endDate
    });
    return response;
  }

  addStory(user_id: string, project_id: string,sprint_title: string, title: string, description: string) {
    const response = axios.post(API_URL + "story/create", {
      user_id,
      project_id,
      sprint_title,
      title,
      description
    }, { headers: authHeader() });
    return response;
  }

  addTask(story_id: string, title: string, points: number, done: boolean, position_in_story: number, project_id: string) {
    const response = axios.post(API_URL + "task/create", {
      story_id,
      title,
      points,
      done,
      position_in_story,
      project_id,
    }, { headers: authHeader() });
    return response;
  }

  getRole(title: string) {
    const response = axios.post(API_URL + "task/karamel", {
      title,
    }, { headers: authHeader() });
    return response;
  }

  deleteStory(story_id: string){
    const response = axios.delete(API_URL + "story/delete/" + story_id, {
      headers: authHeader(),
    });
    return response;
  }

  deleteTask(taskId: string){
    const response = axios.delete(API_URL + "task/delete/" + taskId, {
      headers: authHeader(),
    });
    return response;
  }

  deleteSprint(sprint_id: string){
    console.log(sprint_id)
    const response = axios.delete(API_URL + "sprint/delete/" + sprint_id, {
      headers: authHeader(),
    });
    return response;
  }
  
  deleteProject(project_id: string){
    const response = axios.delete(API_URL + "project/delete/" + project_id, {
      headers: authHeader(),
    });
    return response;
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  updateStory(title: string, description: string, story_id: string, sprint_title: string ) {
    const response = axios.put(API_URL + 'story/update', {

        title: title,
        description: description,
        story_id: story_id,
        sprint_title: sprint_title
      }, { headers: authHeader()
      });    
    return response;
  }

  updateTask(title: string, points: number, done: boolean, taskId: string ,storyId: string, assignedUser : string) {
    const response = axios.put(API_URL + 'task/update', {
        title: title,
        points: points,
        done: done,
        id: taskId,
        story_id: storyId,
        assigned_user: assignedUser,
      }, { headers: authHeader()
      });
    return response;
  }

  updateSprint(id: string, title: string, status: string) {
    const response = axios.put(API_URL + 'sprint/update', {
        id: id,
        title: title,
        status: status
      }, { headers: authHeader()
      });    
    return response;
  }

  updateProject(id: string, title: string, description: string) {
    const response = axios.put(API_URL + 'project/update', {
        id: id,
        title: title,
        description: description
      }, { headers: authHeader()
      });    
    return response;
  }

  addProjectMember(projectId: string, email: string) {
    const response = axios.put(API_URL + 'project/member', {
        projectId,
        email
      }, { headers: authHeader()
      });    
    return response;
  }

  //to do assign
  deleteProjectMember(projectId: string, email: string) {
    const response = axios.put(API_URL + 'project/member/delete', {
        projectId,
        email
      }, { headers: authHeader()
      });
    return response;
  }
}

export default new UserService();

