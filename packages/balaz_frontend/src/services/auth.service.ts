import axios from "axios";

const API_URL = "http://localhost:5000/";

class AuthService {
  login(email: string, password: string) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  addProject(id: string){
    localStorage.setItem("project_id", JSON.stringify(id));
  }

  getProject(){
    const project_id = localStorage.getItem("project_id");
    if (project_id) return JSON.parse(project_id);
    return null;
    }

  register(name: string, email: string, password: string, position: string, avatar: string) {
    const response = axios.post(API_URL + "registration", {
      name,
      email,
      password,
      position,
      avatar
    });
    return response;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
