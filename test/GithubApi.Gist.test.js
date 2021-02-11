const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');
const statusCode = require('http-status-codes');
const { assert } = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

describe('Consuming DELETE Methods', () => {    
    const createGist = {
        description: 'this is an example about promise',
        public: true,
        files: {
            'promise.js': {
                content: jsCode
            }
        }
    };
    let gist;
    describe('Creating a gist', () => {        
        let response;    
        before(async() => {
            response = await agent.post(`${baseUrl}/gists`)
            .send(createGist)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
            gist = response.body;
        });

        it('Then a gist should be created', () => {        
            expect(gist).to.containSubset(createGist);
            expect(response.status).to.equal(statusCode.CREATED);
        });
    });
    
    describe('Checking the gist exists', () => {
        let response;
        before(async() => {
            response = await agent.get(gist.url)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('Then the gist should exist', () => {
            expect(response.status).to.equal(statusCode.OK);
        });
    });

  describe('Deleting the gist', () => {
        let response;
        before(async() => {
            response = await agent.del(gist.url)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });
        
        it('Then the gist should be deleted', () => {      
            expect(response.status).to.equal(statusCode.NO_CONTENT);
        });
  });

  describe('When checking the gist exists again', () => {
        let responseStatus;
        before(async() => {
            try {
                await agent.get(gist.url)
                .set('User-Agent', 'agent')
                .auth('token', process.env.ACCESS_TOKEN);
            } catch (response) {
                responseStatus = response.status;
            }
        });
        
        it('Then the gist should not exist anymore', () => {  
            expect(responseStatus).to.equal(statusCode.NOT_FOUND);
        });
    });
});