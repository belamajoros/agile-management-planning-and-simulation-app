/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Worker creation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.visit('http://localhost:9000/simulation/worker')
    })

    it("should create a new worker", () => {
      cy.intercept('POST', 'http://localhost:1337/worker/post').as('createWorker')
      const workerName = "John";
      const workerDesc = "A new worker description";
      const talentName = "Design talent";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Worker");
      cy.get('[data-cy="worker-name-input"]').type(workerName);
      cy.get('[data-cy="worker-description-input"]').type(workerDesc);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(talentName).click();
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait('@createWorker').then(() => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Worker created successfully!");
      })
    });

    it("should update an existing worker", () => {
      cy.intercept('POST', 'http://localhost:1337/worker/update/*').as('updateWorker')
      cy.intercept('POST', 'http://localhost:1337/worker/post').as('createWorker')
      const workerName = "John";
      const workerDesc = "A new worker description";
      const talentName = "Design talent";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Worker");
      cy.get('[data-cy="worker-name-input"]').type(workerName);
      cy.get('[data-cy="worker-description-input"]').type(workerDesc);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(talentName).click();
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait('@createWorker').then((interception) => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Worker created successfully!");
        cy.get('[data-cy="edit-worker"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/worker/' + interception.response.body._id);
      })

      cy.get('[data-cy="worker-description-input"] input').clear().type(workerDesc + "haha");

      cy.get('[data-cy="submit-button"]').click()
      cy.get("[data-cy='modal-message']").should("contain.text", "Worker updated successfully!");
    });

    it("should display an error message if the worker could not be created", () => {
        const workerName = "John";
        const workerDesc = "A new worker description";
        const talentName = "Design talent";
        cy.get("[data-cy='entity-creator-name']").should("contain.text", "Worker");
        cy.get('[data-cy="worker-name-input"]').type(workerName);
        cy.get('[data-cy="worker-description-input"]').type(workerDesc);
        cy.get('[data-cy="select-category"]').click();
        cy.contains(talentName).click();
      cy.intercept(
        {
          method: "POST",
          url: "http://localhost:1337/worker/post",
        },
        {
          statusCode: 500,
          body: {}
        }
      ).as("postWorker");
      cy.get('[data-cy="submit-button"]').click({ force: true })
      cy.wait("@postWorker");
      cy.get("[data-cy='modal-message']").should("contain.text", "Could not create Worker!");
    });

    it('can navigate to talent creation page', () => {
      cy.get('[data-cy="talent-button"]').click()

      cy.url().should('eq', 'http://localhost:9000/simulation/talent');
    })
})