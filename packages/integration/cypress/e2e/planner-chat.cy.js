/* eslint-disable no-undef */
/// <reference types="cypress" />


describe('Planner chat flow', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:5000/login').as('login');
        cy.intercept('POST', 'http://localhost:5000/project/all').as('getUserProjects');
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc1@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.wait('@login').then((interception) => {
            cy.wait(500)
            cy.visit('http://localhost:9000/planner')
        });
        cy.wait('@getUserProjects').then((interception) => {
            cy.get('[data-cy="select-project"]', { timeout: 5000 }).first().click()
            cy.intercept('GET', 'http://localhost:5000/project/' + interception.response.body[0]._id).as('getProjectRequest')
        });
    })

    it('displays project chat window when chat icon is clicked', () => {
        cy.get('[data-cy="chat-button"]').click();
        cy.get('[data-cy="project-chat-modal"]').should('be.visible');
    });

    it('sends a message when the send button is clicked', () => {
        cy.get('[data-cy="chat-button"]').click();

        cy.get('[data-cy="message-input"]').type('New test message');
        cy.intercept('POST', 'http://localhost:3232/messages/sendMessage').as('sendMessage')
        cy.get('[data-cy="send-message-button"]').click();

        cy.wait('@sendMessage');
        cy.get('[data-cy="message"]').last().should('contain', 'New test message');
        cy.get('[data-cy="message-div"]')
            .last()
            .should('have.attr', 'id')
            .then((id) => {
                expect(id).to.equal('you');
            });
    });

  it('displays existing messages in the chat window', () => {
    cy.intercept('GET', 'http://localhost:3232/messages/getMessages/*').as('getChatForProject')
    cy.get('[data-cy="chat-button"]').click();
    cy.wait('@getChatForProject');

    cy.get('[data-cy="message"]').last().should('contain', 'New test message');
  });

  it('sends a message when the enter key is pressed', () => {
    cy.get('[data-cy="chat-button"]').click();

    cy.intercept('POST', 'http://localhost:3232/messages/sendMessage').as('sendMessage')

    cy.get('[data-cy="message-input"]').type('New test message with Enter{enter}');

    cy.wait('@sendMessage').then((interception) => {
        cy.url().then((url) => {
            const chatId = url.split('/planner/')[1]
            expect(interception.request.body.chatId).to.equal(chatId)
        })
    });
    cy.get('[data-cy="message"]').last().should('contain', 'New test message with Enter');
  });
});