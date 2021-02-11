const agent = require('superagent');
const chai = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('Query parameters test', () => {

    describe('Checking for the default users', () => {
        let response;
        before(async() => {
            response = await agent.get(`${baseUrl}/users`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('Then there should be a user default number', () => {      
            expect(response.body.length).to.equal(30);
        });
    });

    describe('Checking for 10 users', () => {
        let response;
        before(async() => {
            response = await agent.get(`${baseUrl}/users`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN)
            .query({ per_page: 10 });
        });

        it('Then there should be 10 users ', () => {        
            expect(response.body.length).to.equal(10);
        });
    });

    describe('Checking for 50 users', () => {
        let response;
        before(async() => {
            response = await agent.get(`${baseUrl}/users`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN)
            .query({ per_page: 50 });
        });

        it('Then there should be 50 users ', () => {        
            expect(response.body.length).to.equal(50);
        });
    });
});