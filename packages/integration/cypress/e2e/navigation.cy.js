/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Navigation flow for logged in user', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login');
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
    });

    it('navigates to planner when planner button is clicked', () => {
        cy.get('[data-cy="planner-button"]').click();

        cy.url().should('eq', 'http://localhost:9000/planner');
    });

    it('navigates to simulator when simulator button is clicked', () => {
        cy.get('[data-cy="simulator-button"]').click();

        cy.url().should('eq', 'http://localhost:9000/simulation');
    });

    it('navbar should render correctly', () => {
        cy.get('[data-cy="home-nav-button"]').should('exist');
        cy.get('[data-cy="planner-nav-button"]').should('exist');
        cy.get('[data-cy="simulation-nav-button"]').should('exist');
        cy.get('[data-cy="user-menu"]').should('exist');
        cy.get('[data-cy="logo"]').should('exist');
    })

    it('navbar user-menu should render correctly for logged in user', () => {
        cy.get('[data-cy="user-menu"]').should('exist');
        cy.get('[data-cy="profile-nav-button"]').should('not.be.visible');
        //cy.get('[data-cy="admin-nav-button"]').should('not.be.visible');
        cy.get('[data-cy="logout-nav-button"]').should('not.be.visible');
        cy.get('[data-cy="user-menu"]').click();
        cy.get('[data-cy="profile-nav-button"]').should('be.visible');
        //cy.get('[data-cy="admin-nav-button"]').should('be.visible');
        cy.get('[data-cy="logout-nav-button"]').should('be.visible');
    })

    it('navbar logout click should redirect to login page', () => {
        cy.get('[data-cy="user-menu"]').should('exist');
        cy.get('[data-cy="user-menu"]').click();
        cy.get('[data-cy="logout-nav-button"]').should('be.visible');
        cy.get('[data-cy="logout-nav-button"]').click();

        cy.url().should('eq', 'http://localhost:9000/login');
      });

    it('navbar profile click should redirect', () => {
        cy.get('[data-cy="user-menu"]').should('exist');
        cy.get('[data-cy="user-menu"]').click();
        cy.get('[data-cy="profile-nav-button"]').should('be.visible');
        cy.get('[data-cy="profile-nav-button"]').click();

        cy.url().should('eq', 'http://localhost:9000/profile');
    });

    it('navigates to home when its clicked in the navbar', () => {
        cy.get('[data-cy="home-nav-button"]').should('exist');
        cy.get('[data-cy="home-nav-button"]').click();

        cy.url().should('eq', 'http://localhost:9000/home');
    });

    it('navigates to planner when its clicked in the navbar', () => {
        cy.get('[data-cy="planner-nav-button"]').should('exist');
        cy.get('[data-cy="planner-nav-button"]').click({ multiple: true });

        cy.url().should('eq', 'http://localhost:9000/planner');
    });

    it('navigates to simulation when its clicked in the navbar', () => {
        cy.get('[data-cy="simulation-nav-button"]').should('exist');
        cy.get('[data-cy="simulation-nav-button"]').click({ multiple: true });

        cy.url().should('eq', 'http://localhost:9000/simulation');
    });
})