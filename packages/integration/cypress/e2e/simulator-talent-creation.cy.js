/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Talent creation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.visit('http://localhost:9000/simulation/talent')
    })

    it("should create a new talent", () => {
      cy.intercept('POST', 'http://localhost:1337/talent/post').as('createTalent')
      const talentName = "New Talent";
      const talentDesc = "A new talent description";
      const talentBuff = 10;
      const categoryName = "Test category";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Talent");
      cy.get('[data-cy="talent-name-input"]').type(talentName);
      cy.get('[data-cy="talent-description-input"]').type(talentDesc);
      cy.get('[data-cy="talent-buff-input"]').type(talentBuff);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(categoryName).click();

      cy.get('[data-cy="submit-button"]').click()
      cy.wait('@createTalent').then(() => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Talent created successfully!");
      })
    });

    it("should update an existing talent", () => {
      cy.intercept('POST', 'http://localhost:1337/talent/update/*').as('updateTalent')
      cy.intercept('POST', 'http://localhost:1337/talent/post').as('createTalent')
      const talentName = "New Talent";
      const talentDesc = "A new talent description";
      const talentBuff = 10;
      const categoryName = "Test category";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Talent");
      cy.get('[data-cy="talent-name-input"]').type(talentName);
      cy.get('[data-cy="talent-description-input"]').type(talentDesc);
      cy.get('[data-cy="talent-buff-input"]').type(talentBuff);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(categoryName).click();

      cy.get('[data-cy="submit-button"]').click()
      cy.wait('@createTalent').then((interception) => {
        cy.get("[data-cy='modal-message']").should("contain.text", "Talent created successfully!");
        console.log(interception)
        cy.get('[data-cy="edit-talent"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/talent/' + interception.response.body._id);
      })

      cy.get('[data-cy="talent-buff-input"] input').clear().type(talentBuff+1);

      cy.get('[data-cy="submit-button"]').click()
      cy.get("[data-cy='modal-message']").should("contain.text", "Talent updated successfully!");
    });

    it("should display an error message if the talent could not be created", () => {
      const talentName = "New Talent";
      const talentDesc = "A new talent description";
      const talentBuff = 10;
      const categoryName = "Test category";
      cy.get("[data-cy='entity-creator-name']").should("contain.text", "Talent");
      cy.get('[data-cy="talent-name-input"]').type(talentName);
      cy.get('[data-cy="talent-description-input"]').type(talentDesc);
      cy.get('[data-cy="talent-buff-input"]').type(talentBuff);
      cy.get('[data-cy="select-category"]').click();
      cy.contains(categoryName).click();
      cy.intercept(
        {
          method: "POST",
          url: "http://localhost:1337/talent/post",
        },
        {
          statusCode: 500,
          body: {}
        }
      ).as("postTalent");
      cy.get("[data-cy='submit-button']").click();
      cy.wait("@postTalent");
      cy.get("[data-cy='modal-message']").should("contain.text", "Could not create Talent!");
    });

    it('can navigate to category creation page', () => {
      cy.get('[data-cy="category-button"]').click()

      cy.url().should('eq', 'http://localhost:9000/simulation/category');
    })
})