/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Category creation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.visit('http://localhost:9000/simulation/category')
    })

    it("should create a new category", () => {
        cy.intercept('POST', 'http://localhost:1337/category/post').as('createCategory')
        const categoryName = "Test category";
        const categoryDesc = "A new category description";
        cy.get("[data-cy='entity-creator-name']").should("contain.text", "Category");
        cy.get('[data-cy="category-name-input"]').type(categoryName);
        cy.get('[data-cy="category-description-input"]').type(categoryDesc);
        cy.get('[data-cy="submit-button"]').click()
        cy.wait('@createCategory').then(() => {
          cy.get("[data-cy='modal-message']").should("contain.text", "Category created successfully!");
        })
      });
  
      it("should update an existing category", () => {
        cy.intercept('POST', 'http://localhost:1337/category/update/*').as('updateCategory')
        cy.intercept('POST', 'http://localhost:1337/category/post').as('createCategory')
        const categoryName = "Test category";
        const categoryDesc = "A new category description";
        cy.get("[data-cy='entity-creator-name']").should("contain.text", "Category");
        cy.get('[data-cy="category-name-input"]').type(categoryName);
        cy.get('[data-cy="category-description-input"]').type(categoryDesc);
        cy.get('[data-cy="submit-button"]').click()
        cy.wait('@createCategory').then((interception) => {
          cy.get("[data-cy='modal-message']").should("contain.text", "Category created successfully!");
          cy.get('[data-cy="edit-category"]').click()
          cy.url().should('eq', 'http://localhost:9000/simulation/category/' + interception.response.body._id);
        })
        cy.get('[data-cy="category-description-input"] input').clear().type(categoryDesc + "haha");

        cy.get('[data-cy="submit-button"]').click()
        cy.get("[data-cy='modal-message']").should("contain.text", "Category updated successfully!");
      });

      it("should display an error message if the category could not be created", () => {
        const categoryName = "Test category";
        const categoryDesc = "A new category description";
        cy.get("[data-cy='entity-creator-name']").should("contain.text", "Category");
        cy.get('[data-cy="category-name-input"]').type(categoryName);
        cy.get('[data-cy="category-description-input"]').type(categoryDesc);
        cy.intercept(
          {
            method: "POST",
            url: "http://localhost:1337/category/post",
          },
          {
            statusCode: 500,
            body: {}
          }
        ).as("postCategory");
        cy.get('[data-cy="submit-button"]').click()
        cy.wait("@postCategory");
        cy.get("[data-cy='modal-message']").should("contain.text", "Could not create Category!");
      });
})