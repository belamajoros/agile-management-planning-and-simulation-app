/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Simulation routes', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.get('[data-cy="planner-button"]').should('exist');
        cy.get('[data-cy="simulator-button"]').click();
        cy.url().should('eq', 'http://localhost:9000/simulation');
    })

    it('simulation entity creation page renders correctly', () => {
        cy.get('[data-cy="simulate-button"]').should('be.visible')
        cy.get('[data-cy="category-button"]').should('be.visible')
        cy.get('[data-cy="talent-button"]').should('be.visible')
        cy.get('[data-cy="task-button"]').should('be.visible')
        cy.get('[data-cy="worker-button"]').should('be.visible')
        cy.get('[data-cy="backlog-button"]').should('be.visible')
        cy.get('[data-cy="project-button"]').should('be.visible')
    })
    //cy.get('[data-cy=""]')
    it('can navigate to category creation page and it renders correctly' , () => {
        cy.get('[data-cy="category-button"]').click()

        cy.url().should('eq', 'http://localhost:9000/simulation/category');

        cy.get('[data-cy="entity-creator-name"]').contains('Category')

        cy.get('label')
            .contains('Name: *')
            .should('be.visible');

        cy.get('input[name="name"]')
        .should('exist');

        cy.get('label')
            .contains('Description: *')
            .should('be.visible');

        cy.get('[data-cy="submit-button"]').should('be.visible')
        //cy.get('[-creation-component]')data-cy="entity-creator-name"
        //cy.get('[data-cy="data-cy="entity-creator-name""]').contains('')
        //cy.get('[data-cy="submit-button"]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
    })

    it('can navigate to talent creation page ,it renders correctly and sends request on mount' , () => {

        cy.intercept('GET', 'http://localhost:1337/category/get/all').as('getCategories')
        cy.get('[data-cy="talent-button"]').click()

        cy.wait('@getCategories').then((interception) => {
            console.log(interception.response.body)
        })

        cy.url().should('eq', 'http://localhost:9000/simulation/talent');

        cy.get('[data-cy="entity-creator-name"]').contains('Talent')

        cy.get('label')
            .contains('Name : *')
            .should('be.visible');

        cy.get('input[name="name"]')
        .should('exist');

        cy.get('label')
            .contains('Description : *')
            .should('be.visible');

        cy.get('input[name="description"]')
        .should('exist');

        cy.get('label')
            .contains('Buff : *')
            .should('be.visible');

        cy.get('input[name="buff_value"]')
        .should('exist');

        cy.get('[data-cy="submit-button"]').should('be.visible')

        //cy.get('[-creation-component]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
    })

    it('can navigate to worker creation page and it renders correctly' , () => {
        cy.get('[data-cy="worker-button"]').click()

        cy.url().should('eq', 'http://localhost:9000/simulation/worker');

        cy.get('[data-cy="entity-creator-name"]').contains('Worker')

        cy.get('label')
            .contains('Name : *')
            .should('be.visible');

        cy.get('input[name="name"]')
        .should('exist');

        cy.get('label')
            .contains('Description : *')
            .should('be.visible');

        cy.get('input[name="description"]')
        .should('exist');

        cy.get('[data-cy="submit-button"]').should('be.visible')

        //cy.get('[-creation-component]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
    })

    it('can navigate to task creation page and it renders correctly' , () => {
        cy.get('[data-cy="task-button"]').click()

        cy.url().should('eq', 'http://localhost:9000/simulation/task');

        cy.get('[data-cy="entity-creator-name"]').contains('Task')
        cy.get('label')
            .contains('Title : *')
            .should('be.visible');

        cy.get('input[name="title"]')
        .should('exist');

        cy.get('label')
            .contains('Description : *')
            .should('be.visible');

        cy.get('input[name="description"]')
        .should('exist');

        cy.get('label')
            .contains('Priority :')
            .should('be.visible');

        cy.get('label')
            .contains('Estimation (h - hours) : *')
            .should('be.visible');

        cy.get('[data-cy="submit-button"]').should('be.visible')
        //cy.get('[-creation-component]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
    })

    it('can navigate to project creation page and it renders correctly' , () => {
        cy.get('[data-cy="project-button"]').click()

        cy.url().should('eq', 'http://localhost:9000/simulation/project');

        cy.get('[data-cy="entity-creator-name"]').contains('Project')
        cy.get('[data-cy="submit-button"]').should('be.visible')

        cy.get('label')
            .contains('Name : *')
            .should('be.visible');

        cy.get('input[name="name"]')
        .should('exist');

        cy.get('label')
            .contains('Description : *')
            .should('be.visible');

        cy.get('input[name="description"]')
        .should('exist');
        //cy.get('[-creation-component]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
    })

    it('can navigate to simulation chooser page and it renders correctly' , () => {
        cy.get('[data-cy="simulate-button"]').click()

        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');
        //cy.get('[-creation-component]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
        //cy.get('[data-cy=""]')
    })
})