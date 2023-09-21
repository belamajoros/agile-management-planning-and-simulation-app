/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Project simulation flow', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/login')
        cy.get('input[name="email"]').clear().type('testacc@gmail.com');
        cy.get('input[name="password"]').clear().type('testacc123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', 'http://localhost:9000/home');
        cy.get('[data-cy="simulator-button"]').click()
        /* cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate'); */
    })

    it('selecting a project to simulate from the invited project list should wait for everyone to join', () => {
        const proj_id = '64230eb117aa3fe4e5b72c53'
        cy.intercept(
            {
                method: "GET",
                url: 'http://localhost:1337/project/get/all',
            },
            {
                statusCode: 200,
                body: [
                    {
                        "collaborators": ['640e08a504d8f3958ed80e53'],
                        "_id": proj_id,
                        "name": "Haha Template",
                        "description": "asdasdas",
                        "template": false,
                        "tasks": [],
                        "team": [],
                        "backlogs": [],
                        "creator": "63d2e69f1925003210ad8e41",
                        "createdAt": "2023-01-26T20:51:48.093Z",
                        "updatedAt": "2023-01-26T20:51:48.093Z",
                        "__v": 0
                    }
                ]
            }
        ).as("getProjects");

        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');
        cy.wait('@getProjects').then((interception) => {
            console.log(interception)
            cy.get('[data-cy="project-card"]').contains(proj_id).click()
            cy.url().should('eq', 'http://localhost:9000/simulate/sprint');
            cy.get('[data-cy="wait-for-others"]').should('be.visible').should('contain', `Waiting for your teamate(s) to join... 1/${interception.response.body[0].collaborators.length + 1}`)
        })
    })


    it('Simulating project with no collaborators', () => {
        cy.viewport(1920, 1080);
        cy.intercept('GET', 'http://localhost:1337/project/get/all').as("getProjects")

        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');

        cy.wait('@getProjects').then((interception) => {
            const data = interception.response.body;
            const project_id = data.find(p => p.name === "Tester proj" && p.template === false)._id
            cy.contains('[data-cy="project-card"]', project_id).click()
        })

        cy.url().should('eq', 'http://localhost:9000/simulate/sprint');

        cy.get('[data-cy="drag-list"]').should('not.exist')

        cy.contains('Pick No. of Sprints per Project :').should('be.visible')
        cy.get('[data-cy="pick-sprint-num"]').type('{selectall}2')
        cy.get('[data-cy="pick-sprint-num"]').should('have.value', 2)

        cy.get('[data-cy="submit"]').contains("Submit").click()
        /* cy.get('[data-cy="submit"]').invoke('css', 'pointer-events', 'none'); */


        cy.get('[data-cy="drag-list"]').should('be.visible')

        cy.wait(500)
        cy.get('[data-cy="Desing this"]').dragAndDrop(
            '[data-cy="Desing this"]',
            '[data-cy="Sprint 1"]'
          )
        cy.wait(500)
        cy.get('[data-cy="Test task"]').dragAndDrop(
            '[data-cy="Test task"]',
            '[data-cy="Sprint 2"]'
          )
        cy.wait(500)
        cy.get('[data-cy="Write documentation"]').dragAndDrop(
            '[data-cy="Write documentation"]',
            '[data-cy="Sprint 2"]'
          )
        cy.wait(500)
        cy.get('body').trigger('keydown', { keyCode: 27, which: 27 });

        cy.get('[data-cy="nextbutton"]').click()
        cy.wait(1000)
        cy.url().should('eq', 'http://localhost:9000/simulate/backlog');

        cy.get('[data-cy="worker-capacity"]').contains('Workers capacity: 100.00 hours')
        cy.get('[data-cy="worker-capacity-input"]').first().invoke('val').should('contain', '33.33');
        cy.get('[data-cy="used-worker-capacity-input"]').first().invoke('val').should('contain', '33.33');
        cy.get('[data-cy="worker-capacity-input"]').first().clear().type(1)
        const projectTasks = ["Desing this", "Write documentation", "Test task"];
        cy.get('[data-cy="worker-capacity"]').contains('Workers capacity: 76.66 hours')
        cy.get('[data-cy="task-select"]').first().click()

        projectTasks.forEach((task) => {
            if(task === "Desing this"){
                cy.get('[data-cy="select-tasks-item"]').contains(task).click()
            } else {
                cy.get('[data-cy="select-tasks-item"]').should('not.contain', task)
            }
          })
        cy.get('body').trigger('keydown', { keyCode: 27, which: 27 });
        cy.get('[data-cy="next-btn"]').should('have.attr', 'disabled')
        cy.get('[data-cy="review-btn"]').should('not.be.disabled')
        cy.get('[data-cy="review-btn"]').click()
        cy.wait(500)
        cy.get('[data-cy="sprint-title"]').contains("Sprint No. 1")
        cy.get('[data-cy="sprint-title"]').should('not.contain', "Sprint No. 2")
        cy.get('[data-cy="backlogcard"]').should('contain', "Desing this")
        cy.get('[data-cy="backlogcard"]').should('contain', "Progress: 40")

        cy.get('[data-cy="next-btn"]').should('not.be.disabled')
        cy.get('[data-cy="review-btn"]').should('have.attr', 'disabled')
        cy.get('[data-cy="next-btn"]').click()
        cy.wait(500)
        cy.get('[data-cy="task-select"]').eq(1).click();
        projectTasks.forEach((task) => {
            cy.get('[data-cy="select-tasks-item"]').contains(task).click()
          })
        cy.get('body').trigger('keydown', { keyCode: 27, which: 27 });

        cy.get('[data-cy="next-btn"]').should('have.attr', 'disabled')
        cy.get('[data-cy="review-btn"]').should('not.be.disabled')
        cy.get('[data-cy="review-btn"]').click()
        cy.get('[data-cy="sprint-title"]').contains("Sprint No. 2")
        cy.get('[data-cy="sprint-title"]').should('not.contain', "Sprint No. 1")

        cy.get('[data-cy="backlogcard"]').first().should('contain', "Write documentation")
        cy.get('[data-cy="backlogcard"]').first().should('contain', "Progress: 100")

        cy.get('[data-cy="backlogcard"]').eq(1).should('contain', "Test task")
        cy.get('[data-cy="backlogcard"]').eq(1).should('contain', "Progress: 41.65")

        cy.get('[data-cy="backlogcard"]').eq(2).should('contain', "Desing this")
        cy.get('[data-cy="backlogcard"]').eq(2).should('contain', "Progress: 43.33")

        cy.get('[data-cy="next-btn"]').should('not.be.disabled').contains('Finish')
        cy.get('[data-cy="review-btn"]').should('have.attr', 'disabled')

        cy.get('[data-cy="next-btn"]').click()
        cy.wait(500)

        cy.get('[data-cy="projReview"]').should('contain', "Project review")

        cy.wait(2000)
    })

    it('Must assign every task to a sprint', () => {
        cy.viewport(1920, 1080);
        cy.intercept('GET', 'http://localhost:1337/project/get/all').as("getProjects")

        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');

        cy.wait('@getProjects').then((interception) => {
            const data = interception.response.body;
            const project_id = data.find(p => p.name === "Tester proj" && p.template === false)._id
            cy.contains('[data-cy="project-card"]', project_id).click()
        })

        cy.url().should('eq', 'http://localhost:9000/simulate/sprint');

        cy.get('[data-cy="drag-list"]').should('not.exist')

        cy.contains('Pick No. of Sprints per Project :').should('be.visible')
        cy.get('[data-cy="pick-sprint-num"]').type('{selectall}2')
        cy.get('[data-cy="pick-sprint-num"]').should('have.value', 2)

        cy.get('[data-cy="submit"]').contains("Submit").click()
        /* cy.get('[data-cy="submit"]').invoke('css', 'pointer-events', 'none'); */


        cy.get('[data-cy="drag-list"]').should('be.visible')

        cy.wait(1000)
        cy.get('[data-cy="Desing this"]').dragAndDrop(
            '[data-cy="Desing this"]',
            '[data-cy="Sprint 1"]'
          )

        cy.get('body').trigger('keydown', { keyCode: 27, which: 27 });
        cy.on('window:alert', (message) => {
            // Check the alert message
            expect(message).to.equal('You have to assign every task to a sprint!');
        });
        cy.get('[data-cy="nextbutton"]').click()
        cy.wait(1000)
    })
})