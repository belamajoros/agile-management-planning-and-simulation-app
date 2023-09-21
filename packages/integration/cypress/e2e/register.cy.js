/* eslint-disable no-undef */
/// <reference types="cypress" />

import Chance from 'chance';
const chance = new Chance();

describe('Register flow', () => {
    beforeEach(() => {
      cy.visit('http://localhost:9000/register');
    });

    it('should display the form', () => {
        cy.get('form').should('be.visible');
    });

    it('should display the input fields', () => {
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
    });

    it('should display the submit button', () => {
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('displays error messages when form fields are empty', () => {
        cy.get('button[type="submit"]').contains("Register!").click();
        cy.get('[data-cy="error-username"]').contains("The username must be between 3 and 20 characters.").should('exist');
        cy.get('[data-cy="error-email"]').contains("This field is required!").should('exist');
        cy.get('[data-cy="error-password"]').contains("The password must be between 6 and 40 characters.").should('exist');
    });

    it('displays an error message when the username field is invalid', () => {
      cy.get('[data-cy="username-input"]').type('ab');
      cy.get('[data-cy="email-input"]').type('valid@email.com');
      cy.get('[data-cy="password-input"]').type('12345abcde');
      cy.get('button[type="submit"]').contains('Register!').click();
      cy.get('[data-cy="error-username"]').should('contain', 'The username must be between 3 and 20 characters.');
    });

    it('displays an error message when the email field is invalid', () => {
      cy.get('[data-cy="email-input"]').type('wasd123');
      cy.get('[data-cy="username-input"]').type('valid123');
      cy.get('[data-cy="password-input"]').type('12345abcde');
      cy.get('button[type="submit"]').contains('Register!').click();
      cy.get('[data-cy="error-email"]').should('contain', 'This is not a valid email.');
    });

    it('displays an error message when the password field is invalid', () => {
      cy.get('[data-cy="email-input"]').type('valid@email.com');
      cy.get('[data-cy="username-input"]').type('valid123');
      cy.get('[data-cy="password-input"]').type('12345');
      cy.get('button[type="submit"]').contains('Register!').click();
      cy.get('[data-cy="error-password"]').contains("The password must be between 6 and 40 characters.").should('exist');
    });

    it('should display the position select dropdown', () => {
      cy.get('[data-cy="select-position"]').should('be.visible');
      cy.get('[data-cy="select-position"] option').should(
        'have.length',
        8
      );
    });

    it('navbar should display login and register', () => {
      cy.get('[data-cy="user-menu"]').should('exist');
      cy.get('[data-cy="login-button"]').should('not.be.visible');
      cy.get('[data-cy="register-button"]').should('not.be.visible');
      cy.get('[data-cy="user-menu"]').click();
      cy.get('[data-cy="login-button"]').should('be.visible');
      cy.get('[data-cy="register-button"]').should('be.visible');
    });

    it('navbar login click should redirect', () => {
      cy.get('[data-cy="user-menu"]').should('exist');
      cy.get('[data-cy="user-menu"]').click();
      cy.get('[data-cy="login-button"]').should('be.visible');
      cy.get('[data-cy="login-button"]').click();

      cy.url().should('eq', 'http://localhost:9000/login');
    });

    it('navbar register click should redirect', () => {
      cy.get('[data-cy="user-menu"]').should('exist');
      cy.get('[data-cy="user-menu"]').click();
      cy.get('[data-cy="register-button"]').should('be.visible');
      cy.get('[data-cy="register-button"]').click();

      cy.url().should('eq', 'http://localhost:9000/register');
    });

    it('registers a new user successfully', () => {
      cy.intercept('POST', 'http://localhost:5000/registration').as('register');
      const email = chance.email();
      const username = email.split('@')[0];
      const password = '12345abcde';

      cy.get('[data-cy="username-input"]').type(username);
      cy.get('[data-cy="email-input"]').type(email);
      cy.get('[data-cy="password-input"]').type(password);
      cy.get('button[type="submit"]').contains('Register!').click();

      cy.wait('@register').then((interception) => {
        if(interception.response.statusCode !== 201) {
          throw new Error("failed to register user")
        }
      });

      cy.url().should('eq', 'http://localhost:9000/login');
    });
  });