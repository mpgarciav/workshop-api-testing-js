const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');
chai.use(require('chai-subset'));

const baseUrl = 'https://github.com';

const { expect } = chai;;

describe('Consuming HEAD Mehtods', () => {
  let oldResponse;
  describe('When checking the page with HEAD', () => {

    before(async() => {
        try {
            await agent.head(`${baseUrl}/aperdomob/redirect-test`);
        } catch (response) {
            oldResponse = response;
        }
    });
    
    it('The the page should redirect', () => {
        expect(oldResponse.status).to.equal(statusCode.MOVED_PERMANENTLY);
        expect(oldResponse.response.headers.location).to.equal(`${baseUrl}/aperdomob/new-redirect-test`);
    });
  });

  describe('When checking the page with GET', () => {
    let response;
    before(async() => {
        response = await agent.get(`${baseUrl}/aperdomob/redirect-test`);
    });

    it('The the page should redirect', async () => {      
        expect(response.status).to.equal(statusCode.OK);
    });
  });
});