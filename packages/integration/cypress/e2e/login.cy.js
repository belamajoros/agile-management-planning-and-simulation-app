/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Login flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/login')
  })

  it('displays the login form', () => {
    cy.contains('Login');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.contains('Login').should('exist');
    cy.contains('Register a new account').should('exist');
  });

  it('displays validation errors for empty form fields', () => {
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.contains('This field is required!').should('exist');
  });

  it('displays validation errors for empty password field', () => {
    cy.get('input[name="email"]').clear().type('test123@gmail.com');
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="error-password"]').contains('This field is required!').should('exist');
  });

  it('displays validation errors for empty email filed', () => {
    cy.get('input[name="email"]').clear()
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="error-email"]').contains('This field is required!').should('exist');
  });

  it('displays validation errors for invalid email', () => {
    cy.get('input[name="email"]').clear().type('invalid email');
    cy.get('input[name="password"]').clear().type('validpassword');
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="error-email"]').contains('This is not a valid email.').should('exist');
  });

  it('displays validation errors for incorrect password', () => {
    cy.get('input[name="email"]').clear().type('test123@gmail.com');
    cy.get('input[name="password"]').clear().type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="error-msg"]').contains('Incorrect Password !').should('exist');
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

  it('successfully sends requests, generates JWT token, logs in', () => {
    cy.intercept('POST', 'http://localhost:1337/jwt/signJWT').as('genJWT');
    cy.intercept('POST', 'http://localhost:5000/login').as('login');
    cy.get('input[name="email"]').clear().type('testacc@gmail.com');
    cy.get('input[name="password"]').clear().type('testacc123');
    cy.get('button[type="submit"]').click();

    cy.wait('@genJWT').then((interception) => {
      if(interception.response.statusCode !== 200) {
        throw new Error("failed to gen jwt")
      }
    });

    cy.wait('@login').then((interception) => {
      if(interception.response.statusCode !== 200) {
        throw new Error("failed to login")
      }
    });

    cy.url().should('eq', 'http://localhost:9000/home');
  });
});