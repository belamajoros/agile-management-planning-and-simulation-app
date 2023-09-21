/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Task creation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.visit('http://localhost:9000/simulation/task')
    })

    it("should create a new task", () => {
      cy.intercept('POST', 'http://localhost:1337/task/post').as('createTask')
      const taskName = "Test task";
      const taskDesc = "A new task description";
      const taskPriority = 10;
      const taskEstimation = 20;
      const categoryName = "Test category";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Task");
      cy.get('[data-cy="task-name-input"]').type(taskName);
      cy.get('[data-cy="task-description-input"]').type(taskDesc);
      cy.get('[data-cy="task-estimation-input"]').type(taskEstimation);
      cy.get('[data-cy="task-priority-input"]').type(taskPriority);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(categoryName).click();
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait('@createTask').then(() => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Task created successfully!");
      })
    });

    it("should update an existing task", () => {
      cy.intercept('POST', 'http://localhost:1337/task/update/*').as('updateTask')
      cy.intercept('POST', 'http://localhost:1337/task/post').as('createTask')
      const taskName = "Test task";
      const taskDesc = "A new task description";
      const taskPriority = 10;
      const taskEstimation = 20;
      const categoryName = "Test category";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Task");
      cy.get('[data-cy="task-name-input"]').type(taskName);
      cy.get('[data-cy="task-description-input"]').type(taskDesc);
      cy.get('[data-cy="task-estimation-input"]').type(taskEstimation);
      cy.get('[data-cy="task-priority-input"]').type(taskPriority);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(categoryName).click();
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait('@createTask').then((interception) => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Task created successfully!");
        cy.get('[data-cy="edit-task"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/task/' + interception.response.body._id);
      })

      cy.get('[data-cy="task-description-input"] input').clear().type(taskDesc + "haha");

      cy.get('[data-cy="submit-button"]').click()
      cy.get("[data-cy='modal-message']").should("contain.text", "Task updated successfully!");
    });

    it("should display an error message if the task could not be created", () => {
        const taskName = "Test task";
      const taskDesc = "A new task description";
      const taskPriority = 10;
      const taskEstimation = 20;
      const categoryName = "Test category";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Task");
      cy.get('[data-cy="task-name-input"]').type(taskName);
      cy.get('[data-cy="task-description-input"]').type(taskDesc);
      cy.get('[data-cy="task-estimation-input"]').type(taskEstimation);
      cy.get('[data-cy="task-priority-input"]').type(taskPriority);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(categoryName).click();
      cy.intercept(
        {
          method: "POST",
          url: "http://localhost:1337/task/post",
        },
        {
          statusCode: 500,
          body: {}
        }
      ).as("postTask");
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait("@postTask");
      cy.get("[data-cy='modal-message']").should("contain.text", "Could not create Task!");
    });

    it('can navigate to category creation page', () => {
      cy.get('[data-cy="category-button"]').click()

      cy.url().should('eq', 'http://localhost:9000/simulation/category');
    })
})