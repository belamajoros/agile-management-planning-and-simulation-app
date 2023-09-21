/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Project creation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.visit('http://localhost:9000/simulation/project')
    })

    it("should create a new project", () => {
      cy.intercept('POST', 'http://localhost:1337/project/post').as('createProject')
      const projectName = "Test project";
      const projectDesc = "A new project description";
      const projectTasks = ["Desing this", "Write documentation", "Test task"];
      const projectTeam = ["Josh", "Jesse", "Jane"];
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Project");
      cy.get('[data-cy="project-name-input"]').type(projectName);
      cy.get('[data-cy="project-description-input"]').type(projectDesc);
      cy.get('[data-cy="select-tasks"]').click()/* .select(projectTasks); */
      projectTasks.forEach((task) => {
        cy.get('[data-cy="select-tasks-item"]').contains(task).click()
      })
      cy.get('body').type('{esc}');
      cy.get('[data-cy="select-team"]').click()
      projectTeam.forEach((member) => {
        cy.get('[data-cy="select-team-item"]').contains(member).click()
      })
      cy.get('body').type('{esc}');
      cy.get('[data-cy="submit-button"]').click()
      cy.wait('@createProject').then(() => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Project created successfully!");
      })
    });

    it("should update an existing project", () => {
      cy.intercept('POST', 'http://localhost:1337/project/update/*').as('updateProject')
      cy.intercept('POST', 'http://localhost:1337/project/post').as('createProject')
      cy.intercept('GET', 'http://localhost:1337/project/get/*').as('getProject')
      const projectName = "Test project";
      const projectDesc = "A new project description";
      const projectTasks = ["Desing this", "Write documentation", "Test task"];
      const projectTeam = ["Josh", "Jesse", "Jane"];
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Project");
      cy.get('[data-cy="project-name-input"]').type(projectName);
      cy.get('[data-cy="project-description-input"]').type(projectDesc);
      cy.get('[data-cy="select-tasks"]').click()/* .select(projectTasks); */
      projectTasks.forEach((task) => {
        cy.get('[data-cy="select-tasks-item"]').contains(task).click()
      })
      cy.get('body').type('{esc}');
      cy.get('[data-cy="select-team"]').click()
      projectTeam.forEach((member) => {
        cy.get('[data-cy="select-team-item"]').contains(member).click()
      })
      cy.get('body').type('{esc}');
      cy.get('[data-cy="submit-button"]').click()
      cy.wait('@createProject').then((interception) => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Project created successfully!");
        cy.get('[data-cy="edit-project"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/project/' + interception.response.body._id);
        cy.wait('@getProject')
        cy.get('[data-cy="project-description-input"] input').clear().type(projectDesc + "haha");
      })

      cy.get('[data-cy="project-description-input"] input').clear().type(projectDesc + "haha");

      cy.get('[data-cy="submit-button"]').click()
      cy.get("[data-cy='modal-message']").should("contain.text", "Project updated successfully!");
    });

    it("should display an error message if the project could not be created", () => {
        const projectName = "Test project";
        const projectDesc = "A new project description";
        const projectTasks = ["Desing this", "Write documentation", "Test task"];
        const projectTeam = ["Josh", "Jesse", "Jane"];
        cy.get("[data-cy='entity-creator-name']").should("contain.text", "Project");
        cy.get('[data-cy="project-name-input"]').type(projectName);
        cy.get('[data-cy="project-description-input"]').type(projectDesc);
        cy.get('[data-cy="select-tasks"]').click()/* .select(projectTasks); */
        projectTasks.forEach((task) => {
          cy.get('[data-cy="select-tasks-item"]').contains(task).click()
        })
        cy.get('body').type('{esc}');
        cy.get('[data-cy="select-team"]').click()
        projectTeam.forEach((member) => {
          cy.get('[data-cy="select-team-item"]').contains(member).click()
        })
        cy.get('body').type('{esc}');
      cy.intercept(
        {
          method: "POST",
          url: "http://localhost:1337/project/post",
        },
        {
          statusCode: 500,
          body: {}
        }
      ).as("postProject");
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait("@postProject");
      cy.get("[data-cy='modal-message']").should("contain.text", "Could not create Project!");
    });

    it('can navigate to task creation page', () => {
      cy.get('[data-cy="task-button"]').click()

      cy.url().should('eq', 'http://localhost:9000/simulation/task');
    })

    it('can navigate to worker creation page', () => {
        cy.get('[data-cy="worker-button"]').click()

        cy.url().should('eq', 'http://localhost:9000/simulation/worker');
      })
})