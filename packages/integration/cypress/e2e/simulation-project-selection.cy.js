/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Simulation project selection flow', () => {
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

    it("it should display message if there are no projects created for the user", () => {
        cy.intercept(
            {
            method: "GET",
            url: /http:\/\/localhost:1337\/user\/get\/[0-9a-fA-F]{24}/,
            },
            {
            statusCode: 500,
            body: {
                projects: []
            }
            }
        ).as("getUserProjects");
        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');
        cy.wait('@getUserProjects')
        cy.get('[data-cy="no-projects"]').should('have.text', "You have not created any projects")
    })

    it("it should display project card if there are projects created for the user", () => {
        const proj_id = '64230eb117aa3fe4e5b72c53'
        cy.intercept(
            {
            method: "GET",
            url: /http:\/\/localhost:1337\/user\/get\/[0-9a-fA-F]{24}/,
            },
            {
                statusCode: 200,
                body: {
                    projects: [ proj_id ]
                }
            }
        ).as("getUserProjects");
        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');
        cy.get('[data-cy="project-card"]').should('not.contain', proj_id)
        cy.wait('@getUserProjects')
        cy.get('[data-cy="no-projects"]').should('not.exist')
        cy.get('[data-cy="project-card"]').contains(proj_id)
    })

    it('it should display message if there are no template projects created and no invited projects for the user', () => {
        cy.intercept(
            {
                method: "GET",
                url: 'http://localhost:1337/project/get/all',
            },
            {
                statusCode: 500,
                body: [
                ]
            }
        ).as("getProjects");

        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');
        cy.wait('@getProjects')

        cy.get('[data-cy="no-template"]').should('have.text', "No template projects found")
        cy.get('[data-cy="no-invited"]').should('have.text', "You have not been invited to any projects")
    })

    it('it should display template card if there are template projects created', () => {
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
                        "collaborators": [],
                        "_id": proj_id,
                        "name": "Haha Template copy",
                        "description": "asdasdas",
                        "template": true,
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
        //cy.get('[data-cy="project-card"]').should('not.contain', proj_id)
        cy.wait('@getProjects')

        cy.get('[data-cy="no-template"]').should('not.exist')
        cy.get('[data-cy="project-card"]').contains(proj_id)
    })

    it('it should display invited project card if the user has been invited to a project', () => {
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
        //cy.get('[data-cy="project-card"]').should('not.contain', proj_id)
        cy.wait('@getProjects')

        cy.get('[data-cy="project-card"]').contains(proj_id)
        cy.get('[data-cy="no-invited"]').should('not.exist')
    })

    //cy.get('[]')

    it('it should redirect to the project edit page when the user clicks on open project details in the project card (My Projects)' , () => {
        const proj_id = '64230eb117aa3fe4e5b72c53'
        cy.intercept(
            {
            method: "GET",
            url: /http:\/\/localhost:1337\/user\/get\/[0-9a-fA-F]{24}/,
            },
            {
                statusCode: 200,
                body: {
                    projects: [ proj_id ]
                }
            }
        ).as("getUserProjects");

        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');

        cy.wait('@getUserProjects').then(() => {
            cy.contains('[data-cy="project-card"]', proj_id).find('[data-cy="open-details"]').click();
            cy.url().should('eq', 'http://localhost:9000/simulation/project/' + proj_id)
        })
    })

    it('it should redirect to the project edit page when the user clicks on open project details in the project card (Template projects)' , () => {
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
                        "collaborators": [],
                        "_id": proj_id,
                        "name": "Haha Template copy",
                        "description": "asdasdas",
                        "template": true,
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

        cy.wait('@getProjects').then(() => {
            cy.contains('[data-cy="project-card"]', proj_id).find('[data-cy="open-details"]').click();
            cy.url().should('eq', 'http://localhost:9000/simulation/project/' + proj_id)
        })
    })

    it('it should redirect to the project edit page when the user clicks on open project details in the project card (Invited projects)' , () => {
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

        cy.wait('@getProjects').then(() => {
            cy.contains('[data-cy="project-card"]', proj_id).find('[data-cy="open-details"]').click();
            cy.url().should('eq', 'http://localhost:9000/simulation/project/' + proj_id)
        })
    })


    it('user can copy templated project when clicking on the templated project card' , () => {
        const proj_id = '64230eb117aa3fe4e5b72c53'
        const proj_name = 'Haha Template'
        cy.intercept(
            {
                method: "GET",
                url: 'http://localhost:1337/project/get/all',
            },
            {
                statusCode: 200,
                body: [
                    {
                        "collaborators": [],
                        "_id": proj_id,
                        "name": proj_name,
                        "description": "asdasdas",
                        "template": true,
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

        cy.wait('@getProjects').then(() => {
            cy.get('[data-cy="copy-proj-modal"]').should('not.exist')
            cy.contains('[data-cy="project-card"]', proj_id).find('[data-cy="proj-click"]').click();
            cy.get('[data-cy="copy-proj-modal"]').should('be.visible')
        })

        cy.intercept('POST', 'http://localhost:1337/project/post').as('addToMyProjects')
        cy.get('[data-cy="add-button"]').contains("Add to My Projects").click()
        cy.wait('@addToMyProjects').then((interception) => {
            console.log(interception)
            expect(interception.request.body.name).to.equal(proj_name + " copy")
            expect(interception.response.statusMessage).to.equal('Created');
            cy.contains('[data-cy="project-card"]', interception.response.body._id).should('be.visible')
        })
    })

    it('Projects from "My Projects" can be deleted', () => {
        cy.intercept("GET", /http:\/\/localhost:1337\/user\/get\/[0-9a-fA-F]{24}/).as("getProjects")
        cy.intercept('PATCH', /http:\/\/localhost:1337\/user\/update\/[0-9a-fA-F]{24}/).as("updateAfterDelete")
        cy.get('[data-cy="simulate-button"]').click()
        cy.url().should('eq', 'http://localhost:9000/simulation/simulate');

        cy.get('[data-cy="delete-project-modal"]').should('not.exist');
        cy.wait('@getProjects')
        cy.contains('[data-cy="project-card"]', 'Haha Template copy').find('[data-cy="trash-icon"]').click();

        cy.get('[data-cy="delete-project-modal"]').should('be.visible');
        cy.get('[data-cy="yes-delete"]').contains("Yes").click();

        cy.wait('@updateAfterDelete').then((interception) => {
            console.log(interception)
        })
    })
})