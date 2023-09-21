import { getProjectByCreatorId, getProjectById } from "../api/projectApi";
import { getUserById, updateUser } from "../api/userApi";
import IProject from "../interfaces/project";


export async function addUserProject(userId: string, projectId: string) : Promise<string> {
    //funkcia pre pridanie projektu k pouzivatelovym projketom
    let userData = await getUserById(userId)
    if (userData.projects) {
        let oldProjects: Array<string> = userData.projects;
        if (!oldProjects.includes(projectId)) {
            oldProjects.push(projectId);
            const data =
                {
                    projects: oldProjects
                };
            return await updateUser(userId, data)
        } else {
            console.log("You already have this project in My projects!")
            return "ALREADY_EXIST"
        }
    }
    return "";
}

export async function removeUserProject(userId: string, projectId: string) {
    //funkcia pre odstranenie projektu od pouzivatelovych projektov

    getUserById(userId).then(async (user) => {
        if (user.projects) {
            let oldProjects: Array<string> = user.projects;
            console.log(oldProjects)
            const index = oldProjects.indexOf(projectId, 0);
            if (index > -1) {
                oldProjects.splice(index, 1);
                const data =
                    {
                        projects: oldProjects
                    };
                console.log(oldProjects)
                await updateUser(userId, data)
                    .then(r => window.location.reload());
            }
        }
    })
}

export async function getUserProjects(creatorId: string): Promise<Array<IProject>> {
    //funkcia pre ziskanie pouzivatelovych projektov

   const user = await getUserById(creatorId);
   console.log(user)

    let userProjects: Array<IProject> = [];
    if (user.projects) {
        for (const projectId of user.projects) {
            await getProjectById(projectId).then((project) => {
                userProjects.push(project);
            });
        }
    }
    console.log(userProjects);
    return userProjects;
}