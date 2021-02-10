const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');
const statusCode = require('http-status-codes');
const { assert } = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('Consuming POST and PATCH methods', () => {
    let usr;
    describe('Get logged user and check if it has at least one public repo', () => { 
        let response       
        before(async() =>{
            response = await agent.get(`${baseUrl}/user`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);

            usr = response.body
        });

        it('Then a user should be logged', async() => {
            expect(response.status).to.equal(statusCode.OK);
        });

        it('Then the user has at least one public repo', () => {
            expect(usr.public_repos).to.be.above(0);
        });
    });
    let repo
    describe('Getting a repo', () => {
        
        before(async() =>{
            const response = await agent.get(usr.repos_url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN)
            repo = response.body[0];
        });
        it('then there should be a repo', () => {
            expect(repo).to.not.equal(undefined);
        });
    });
    let issue;
    describe('Creating an issue', () => {
        
        before(async() =>{
            const response = await agent.post(`${baseUrl}/repos/${usr.login}/${repo.name}/issues`)
            .send({ title: 'This is an issue' })
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
            issue = response.body;
        });

        it('Then an issue should be created', () => {
            expect(issue.title).to.equal('This is an issue');
            expect(issue.body).to.equal(null);
        });
    });

    describe('Modifying an issue', () =>{
        let modIssue;
        before(async() => {
            const response = await agent.patch(`${baseUrl}/repos/${usr.login}/${repo.name}/issues/${issue.number}`)
            .send({ body: 'This is the body of the issue' })
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
            modIssue = response.body;
        });

        it('Then an issue should be modified', () => {
            expect(modIssue.title).to.equal(issue.title);
            expect(modIssue.body).to.equal('This is the body of the issue');
        });
    });
});