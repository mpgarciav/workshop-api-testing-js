const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');
const statusCode = require('http-status-codes');
const { assert } = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('Consuming PUT Methods', () => {
    let response;
    describe('Following user aperdomob', () => {
        before( async() => {
            response = await agent.put(`${baseUrl}/user/following/aperdomob`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });
        it('then the user aperdomob should be followed', () => {
            expect(response.status).to.eql(statusCode.NO_CONTENT);
            expect(response.body).to.eql({});
        });
    });

    describe('Consulting user list', () => {
        let usr;
        before( async() => {
            const response = await agent.get(`${baseUrl}/user/following`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
            usr = response.body.find(list => list.login === 'aperdomob');
        });

        it('then the user aperdomob is followed', () => assert.exists(usr));
    });

    describe('Checking idempotence', () => {

        let response;
        describe('Following user aperdomob', () => {
            before( async() => {
                response = await agent.put(`${baseUrl}/user/following/aperdomob`)
                .set('User-Agent', 'agent')
                .auth('token', process.env.ACCESS_TOKEN);
            });
            it('then the user aperdomob should be followed', () => {
                expect(response.status).to.eql(statusCode.NO_CONTENT);
                expect(response.body).to.eql({});
            });
        });

        describe('Consulting user list', () => {
            let usr;
            before( async() => {
                const response = await agent.get(`${baseUrl}/user/following`)
                .set('User-Agent', 'agent')
                .auth('token', process.env.ACCESS_TOKEN);
                usr = response.body.find(list => list.login === 'aperdomob');
            });
            it('then the user aperdomob is followed', () => assert.exists(usr));
        });
    });    
});