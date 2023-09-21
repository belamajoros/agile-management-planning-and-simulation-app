/* eslint-disable no-undef */
/// <reference types="cypress" />

const project_title = (Math.random() + 1).toString(36).substring(3)
const desc = project_title.substring(3);

describe('Planner flow', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:5000/project/all').as('getUserProjects');
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.get('[data-cy="planner-button"]').should('exist');
        cy.get('[data-cy="planner-button"]').click();
        cy.url().should('eq', 'http://localhost:9000/planner');
    })

    it('should display different content depending on API response', () => {
        cy.wait('@getUserProjects').then((interception) => {
          if(interception.response.body.length === 0 ) {
            cy.get('[data-cy="planner-text"]').should('exist')
            cy.contains('You dont have any projects yet.').should('be.visible')
            cy.contains('Dont be shy and create one.').should('be.visible')
            cy.get('[data-cy="planner-create-1"]').should('be.visible')
            cy.get('[data-cy="planner-create-2"]').should('not.exist')
            cy.get('[data-cy="planner-backlog"]').should('not.exist')
          } else {
            cy.get('[data-cy="planner-text"]').should('exist')
            cy.contains('You dont have any projects yet.').should('not.exist')
            cy.contains('Dont be shy and create one.').should('not.exist')
            cy.get('[data-cy="planner-create-1"]').should('not.exist')
            cy.get('[data-cy="planner-create-2"]').should('be.visible')
            cy.get('[data-cy="planner-backlog"]').should('be.visible')
          }
        });
      });

    it('creating a new project with valid input', () => {
        cy.wait('@getUserProjects').then((interception) => {
          if(interception.response.body.length === 0 ) {
            cy.get('[data-cy="planner-proj-create"]').should('not.exist')
            cy.get('[data-cy="planner-create-1"]').click()
            cy.get('[data-cy="planner-proj-create"]').should('exist')
            createProject()
          } else {
            cy.get('[data-cy="planner-proj-create"]').should('not.exist')
            cy.get('[data-cy="planner-create-2"]').click()
            cy.get('[data-cy="planner-proj-create"]').should('exist')
            createProject()
          }
        });

        function createProject() {
          cy.intercept('POST', 'http://localhost:5000/project/create').as('projectCreateRequest');
          cy.contains('Create project').should('be.visible')
          cy.contains('Title').should('be.visible')
          cy.contains('Description').should('be.visible')

          cy.get('[data-cy="title-field"]').type(project_title);
          cy.get('[data-cy="description-field"]').type(desc);
          cy.get('[data-cy="create-btn"]').contains('Create').click();
          cy.wait('@projectCreateRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
          });
          cy.get('[data-cy="projects"]').should('exist')
          cy.contains(project_title).should('be.visible')
          cy.contains("Description: " + desc).should('be.visible')
      }
    });

    it('creating a new project with invalid input', () => {
      cy.wait('@getUserProjects').then((interception) => {
        if(interception.response.body.length === 0 ) {
          cy.get('[data-cy="planner-proj-create"]').should('not.exist')
          cy.get('[data-cy="planner-create-1"]').click()
          cy.get('[data-cy="planner-proj-create"]').should('exist')
          createProject("as", "as")
        } else {
          cy.get('[data-cy="planner-proj-create"]').should('not.exist')
          cy.get('[data-cy="planner-create-2"]').click()
          cy.get('[data-cy="planner-proj-create"]').should('exist')
          createProject("as", "as")
        }
      });

      function createProject(title, description) {
          cy.contains('Create project').should('be.visible')
          cy.contains('Title').should('be.visible')
          cy.contains('Description').should('be.visible')

          cy.get('[data-cy="title-field"]').type(title);
          cy.get('[data-cy="description-field"]').type(description);
          cy.get('[data-cy="title-field"]').click()
          cy.get('[data-cy="project-description-error"]').contains('The description must be at least 5 characters.').should('be.visible')
          cy.get('[data-cy="project-title-error"]').contains('The title must be between 3 and 30 characters.').should('be.visible')
      }
  });


    it('creating a new project modal can close', () => {
      cy.wait('@getUserProjects').then((interception) => {
        if(interception.response.body.length === 0 ) {
          cy.get('[data-cy="planner-proj-create"]').should('not.exist')
          cy.get('[data-cy="planner-create-1"]').click()
          cy.get('[data-cy="planner-proj-create"]').should('exist')
          cy.get('[data-cy="close-btn"]').contains('Close').click();
          cy.get('[data-cy="planner-proj-create"]').should('not.exist')
        } else {
          cy.get('[data-cy="planner-proj-create"]').should('not.exist')
          cy.get('[data-cy="planner-create-2"]').click()
          cy.get('[data-cy="planner-proj-create"]').should('exist')
          cy.get('[data-cy="close-btn"]').contains('Close').click();
          cy.get('[data-cy="planner-proj-create"]').should('not.exist')
        }
      });
  });

    it('should redirect to backlog', () => {
        cy.wait('@getUserProjects').then((interception) => {
          if(interception.response.body.length > 0 ) {
            cy.get('[data-cy="planner-backlog"]').click()

            cy.url().should('eq', 'http://localhost:9000/backlog');
          }
        });
    });

    it('select project redirects correctly', () => {
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            const projects = interception.response.body
            const foundProject = projects.find(project => project.title === project_title)
            cy.get('[data-cy="select-project"]').click()
            cy.url().should('eq', 'http://localhost:9000/planner/' + foundProject._id);
            cy.wait(500)
          })
      })
      cy.get('[data-cy="project-title"]').contains(project_title)
    });

    it('project planner page should send requests on mount and render correctly', () => {
      cy.intercept('GET', /http:\/\/localhost:5000\/project\/[0-9a-fA-F]{24}/).as('getProjectRequest')

      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
            cy.wait(500)
            const projects = interception.response.body
            const foundProject = projects.find(project => project.title === project_title)
            cy.url().should('eq', 'http://localhost:9000/planner/' + foundProject._id);

            cy.wait('@getProjectRequest').then((interception) => {
              expect(interception.request.url).to.equal('http://localhost:5000/project/' + foundProject._id)
            })
          })
      })

      cy.get('[data-cy="chat-button"]').should('exist')
      cy.get('[data-cy="project-edit"]').should('exist')
      cy.get('[data-cy="project-add-people"]').should('exist')
      cy.get('[data-cy="project-delete"]').should('exist')
    })

    it('edit modal can be opened and closed', () => {
      cy.intercept('GET', 'http://localhost:5000/project/*').as('getProjectRequest')
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      cy.get('[data-cy="project-edit"]').click()
      cy.get('[data-cy="edit-modal"]').should('exist')
      cy.get('[data-cy="edit-close"]').click()
      cy.get('[data-cy="edit-modal"]').should('not.exist')
    })

    it('add people to the project and then remove them from it', () => {
      cy.intercept('GET', 'http://localhost:5000/project/*').as('getProjectRequest')
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      cy.get('[data-cy="project-add-people"]').click()
      cy.get('[data-cy="add-modal"]').should('be.visible')
      cy.get('[data-cy="add-modal"]').contains('There are no members yet!');
      cy.get('[data-cy="add-people-input"]').clear().type("becimajoros99@gmail.com")
      cy.intercept('PUT', 'http://localhost:5000/project/member').as("addMemberRequest")
      cy.get('[data-cy="add-button"]').click()
      cy.wait('@addMemberRequest')

      cy.get('[data-cy="member-email"]').contains('becimajoros99@gmail.com')

      cy.contains('[data-cy="member-email"]', 'becimajoros99@gmail.com')
        .closest('.row')
        .find('[data-cy="delete-member-button"]')
        .click()

      cy.intercept('PUT', 'http://localhost:5000/project/member/delete').as("deleteMemberRequest")

      cy.get('[data-cy="delete-modal"]').should('be.visible')

      cy.get('[data-cy="delete-modal"]').find('[data-cy="delete-yes"]').click()

      cy.wait('@deleteMemberRequest')

      cy.get('[data-cy="delete-modal"]').should('not.exist')

      cy.get('[data-cy="add-modal"]').contains('becimajoros99@gmail.com').should('not.exist')
    })

    it('can create sprints for the project with valid input', () => {

      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      cy.get('[data-cy="create-sprint-modal"]').should('not.exist')
      cy.get('[data-cy="create-sprint-button"]').should('be.visible').click()
      cy.get('[data-cy="create-sprint-modal"]').should('be.visible')

      const today = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-GB', options).replace(/\//g, '.');;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // add 7 days
      const timeNow = new Date();
      const hours = timeNow.getHours().toString().padStart(2, '0');
      const minutes = timeNow.getMinutes().toString().padStart(2, '0');
      const seconds = timeNow.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;

      cy.intercept('POST', 'http://localhost:5000/sprint/create').as("createSprintRequest")
      cy.get('[data-cy="sprint-title-input"]').clear().type("test sprint title")
      cy.get('[name="startDate"]').clear().type(formattedDate + " " + timeString)
      cy.contains('Create sprint').click()
      /* cy.get('[data-cy="sprint-title-input"]').click() */
      cy.get('[name="endDate"]').clear().type(`${futureDate.getDate().toString().padStart(2, '0')}.${(futureDate.getMonth() + 1).toString().padStart(2, '0')}.${futureDate.getFullYear()} ` + timeString)
      /* cy.contains('Create sprint').click() */
      /* cy.get('[data-cy="sprint-title-input"]').click() */
      cy.get('[data-cy="create-sprint"]').should('be.visible').click()
      cy.wait('@createSprintRequest').then((intercept) => {
        console.log(intercept)
        cy.get('[data-cy="sprint-title"]').contains("test sprint title")
      })
    })

    it('creating sprint with invalid input should display error message', () => {
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      const end_date = new Date()
      end_date.setDate(end_date.getDate() - 2);
      const timeNow = new Date();
      const hours = timeNow.getHours().toString().padStart(2, '0');
      const minutes = timeNow.getMinutes().toString().padStart(2, '0');
      const seconds = timeNow.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      /* const timeString = timeNow.toLocaleTimeString('en-US', { hour12: false, timeZone: 'CET' }); */

      cy.get('[data-cy="create-sprint-modal"]').should('not.exist')
      cy.get('[data-cy="create-sprint-button"]').should('be.visible').click()
      cy.get('[data-cy="create-sprint-modal"]').should('be.visible')

      cy.get('[data-cy="sprint-title-input"]').clear().type("te")
      cy.get('[data-cy="create-sprint"]').should('be.visible').click()

      cy.get('[data-cy="title-error"]').contains('The Title must be between 3 and 40 characters.').should('be.visible')
      cy.get('[data-cy="sprint-title-input"]').clear().type("testtttt")
      cy.get('[data-cy="create-sprint"]').should('be.visible').click()
      cy.get('[data-cy="date-error"]').contains('Set your start and end date of sprint')
      cy.get('[name="endDate"]').clear().type(`${end_date.getDate().toString().padStart(2, '0')}.${(end_date.getMonth() + 1).toString().padStart(2, '0')}.${end_date.getFullYear()} ` + timeString)
      cy.get('[data-cy="create-sprint"]').should('be.visible').click()

      cy.get('[data-cy="date-error"]').contains('End date can`t be in history and lower then start date.').should('be.visible')
    })

    it('can create story for the sprint with valid input', () => {
      cy.intercept('GET', /http:\/\/localhost:5000\/story\/[0-9a-fA-F]{24}/).as('getSprints');
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      cy.wait('@getSprints')

      cy.get('[data-cy="story-card"]').should('not.exist')

      cy.get('[data-cy="story-create-modal"]').should('not.exist')
      cy.get('[data-cy="create-story-button"]').click()
      cy.get('[data-cy="story-create-modal"]').should('be.visible')

      cy.get('[data-cy="story-title-input"]').clear().type('story title test')
      cy.get('[data-cy="story-description-input"]').clear().type('story description test')
      cy.get('[data-cy="sprint-dropdown-select"]')
        .should('have.length.at.least', 1)
        .and('not.have.value', '');
      cy.get('[data-cy="story-create"]').click()

      cy.wait('@getSprints').then((interception) => {
        console.log(interception)
      })
      cy.get('[data-cy="story-card"]').should('have.length.at.least', 1);
    })


    it('creating story for the sprint with invalid input should display error message', () => {
      cy.intercept('GET', /http:\/\/localhost:5000\/story\/[0-9a-fA-F]{24}/).as('getSprints');
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      cy.wait('@getSprints')

      cy.get('[data-cy="story-create-modal"]').should('not.exist')
      cy.get('[data-cy="create-story-button"]').click()
      cy.get('[data-cy="story-create-modal"]').should('be.visible')

      cy.get('[data-cy="story-title-input"]').clear().type('st')
      cy.get('[data-cy="story-description-input"]').clear().type('story description test')
      cy.get('[data-cy="story-create"]').click()

      cy.get('[data-cy="story-title-error"]').contains('The title must be between 3 and 40 characters.')
    })

    it('can add tasks to the created story with valid input', () => {
      cy.intercept('POST', 'http://localhost:5000/task/create').as('taskCreate');

      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      const taskTitle = "task 1"
      const priority = 10

      cy.get('[data-cy="story-edit-modal"]').should('not.exist')
      cy.get('[data-cy="story-edit"]').click()
      cy.get('[data-cy="story-edit-modal"]').should('be.visible')
      cy.get('[data-cy="add-task-section"]').should('not.exist')
      cy.get('[data-cy="add-task-button"]').click()
      cy.get('[data-cy="add-task-section"]').should('be.visible')
      cy.get('[data-cy="task-title-input"]').clear().type(taskTitle)
      cy.get('[data-cy="task-priority-input"]').clear().type(priority)

      cy.intercept('GET',  /http:\/\/localhost:5000\/task\/[0-9a-fA-F]{24}/).as('refreshTasks');

      cy.get('[data-cy="create-task-button"]').click()

      cy.wait('@taskCreate').then((interception) => {
        console.log(interception)
        expect(interception.request.body.title).to.equal(taskTitle)
        expect(interception.request.body.points).to.equal(priority)
        expect(interception.request.body.done).to.equal(false)
        expect(interception.response.body.message).to.equal('Task created!')
      })
      cy.wait('@refreshTasks').then(() => {
        cy.get('[data-cy="created-task-title"]').should('have.value', taskTitle);
      })
    })

    it('can delete task from the story', () => {
      cy.intercept('GET',  /http:\/\/localhost:5000\/task\/[0-9a-fA-F]{24}/).as('getTasks');
      cy.intercept('DELETE', /http:\/\/localhost:5000\/task\/delete\/[0-9a-fA-F]{24}/).as('taskDelete');
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      const taskTitle = "task 1"

      cy.get('[data-cy="story-edit-modal"]').should('not.exist')
      cy.get('[data-cy="story-edit"]').click()

      cy.get('[data-cy="story-edit-modal"]').should('be.visible')
      cy.wait('@getTasks').then((interception) => {
        cy.get('[data-cy="delete-task"]').click();
      })

      //cy.get('[])
      cy.wait('@taskDelete').then((interception) => {
        expect(interception.response.statusCode).to.equal(200)
      })
    })

    it('adding tasks with invalid input should display error message', () => {
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })

      const taskTitle = "t"
      const priority = 10

      cy.get('[data-cy="story-edit-modal"]').should('not.exist')
      cy.get('[data-cy="story-edit"]').click()
      cy.get('[data-cy="story-edit-modal"]').should('be.visible')
      cy.get('[data-cy="add-task-section"]').should('not.exist')
      cy.get('[data-cy="add-task-button"]').click()
      cy.get('[data-cy="add-task-section"]').should('be.visible')
      cy.get('[data-cy="task-title-input"]').clear().type(taskTitle)
      cy.get('[data-cy="task-priority-input"]').clear().type(priority)

      cy.get('[data-cy="create-task-button"]').click()

      cy.get('[data-cy="task-title-error"]').contains('The title must be between 3 and 100 characters.').should('be.visible')
    })

    it('story can be deleted' , () => {
      cy.intercept('DELETE', /http:\/\/localhost:5000\/story\/delete\/[0-9a-fA-F]{24}/).as('deleteStory');
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })
      //cy.get('[]')
      cy.get('[data-cy="story-delete-modal"]').should('not.exist')
      cy.get('[data-cy="story-delete"]').click()
      cy.get('[data-cy="story-delete-modal"]').should('be.visible')
      cy.get('[data-cy="delete-story-yes"]').click()
      cy.wait('@deleteStory').then((interception) => {
        cy.visit('http://localhost:9000/planner/' + interception.request.body._id)
        cy.get('[data-cy="story-card"]').should('not.exist')
      })
    })

    it('sprint can be deleted' , () => {
      cy.intercept('DELETE', /http:\/\/localhost:5000\/sprint\/delete\/[0-9a-fA-F]{24}/).as('deleteSprint');
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })
      //cy.get('[]')
      cy.get('[data-cy="sprint-card"]').should('exist')
      cy.get('[data-cy="sprint-delete-modal"]').should('not.exist')
      cy.get('[data-cy="sprint-delete-button"]').click()
      cy.get('[data-cy="sprint-delete-modal"]').should('be.visible')
      cy.get('[data-cy="sprint-delete-yes"]').click()
      cy.wait('@deleteSprint').then((interception) => {
        cy.visit('http://localhost:9000/planner/' + interception.request.body._id)
        cy.get('[data-cy="sprint-card"]').should('not.exist')
      })
    })

    it('project can be deleted on the project page', () => {
      cy.wait('@getUserProjects').then((interception) => {
        cy.contains('.card-body', project_title)
          .within(() => {
            // Find the button with the matching data-cy attribute and trigger click
            cy.get('[data-cy="select-project"]').click()
          })
      })
      cy.intercept('DELETE', /http:\/\/localhost:5000\/project\/delete\/[0-9a-fA-F]{24}/).as("deleteProjectRequest")

      cy.get('[data-cy="project-delete"]').click()
      cy.get('[data-cy="project-delete-modal"]').should('be.visible')
      cy.get('[data-cy="delete-title"]').contains('Delete project "' + project_title + '"')
      cy.get('[data-cy="delete-project-yes"]').click()

      cy.url().should('eq', 'http://localhost:9000/planner');
    })

    it('project can be deleted on the planner homepage', () => {
      cy.intercept('POST', 'http://localhost:5000/project/create').as('projectCreateRequest');

      cy.wait('@getUserProjects')

      cy.get('body')
        .then($body => {
          if ($body.find('[data-cy="planner-create-1"]').length) {
            cy.get('[data-cy="planner-create-1"]').click();
          }
          //return '.popup';
          cy.get('[data-cy="planner-create-2"]').click();
        })

      const proj_name = "test1234567"
      const proj_description = "descriptionnnnn"

      cy.get('[data-cy="title-field"]').type(proj_name);
      cy.get('[data-cy="description-field"]').type(proj_description);
      cy.get('[data-cy="create-btn"]').contains('Create').click();
      cy.wait('@projectCreateRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });

      cy.get('[data-cy="projects"]')
  .contains('[data-cy="project-title"]', proj_name)
  .parent()
  .contains('[data-cy="project-description"]', "Description: " + proj_description)
  .should('be.visible');

      // cy.get('[data-cy="projects"]').children().contains(proj_name , "Description: " + proj_description).should('be.visible') *//* .contains("Description: " + proj_description).should('be.visible')
      //cy.contains('[data-cy="projects"]').contains(proj_name , "Description: " + proj_description).should('be.visible')
     cy.intercept('DELETE', /http:\/\/localhost:5000\/project\/delete\/[0-9a-fA-F]{24}/).as("deleteProjectRequest")

      cy.contains('.card-title', 'test1234567').parent().find('[data-cy="delete-project"]').click();

      cy.get('[data-cy="delete-proj"]').should('be.visible')
      cy.get('[data-cy="delete-yes-"]').should('be.visible').click()
      cy.wait('@deleteProjectRequest').then((interception) => {
        console.log(interception)
      })

      cy.contains(proj_name).contains("Description: " + proj_description).should('not.exist')
    })


})