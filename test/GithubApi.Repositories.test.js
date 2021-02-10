const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');
const statusCode = require('http-status-codes');
const { assert } = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('Consuming GET Methods', () => {
    const username = 'aperdomob';
    const repo = 'jasmine-awesome-report';
    describe('Checking the user', () => {
        it('Then the user should be checked', () => agent.get(`${baseUrl}/users/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCES_TOKEN)
        .then((response) => {
            expect(response.status).to.equal(statusCode.StatusCodes.OK);
            expect(response.body.name).to.equal('Alejandro Perdomo');
            expect(response.body.company).to.equal('PSL');
            expect(response.body.location).to.equal('Colombia');
        }));
    });

    describe('Checking the repository', () => {
        it(`Then the ${repo} repository should be checked`, () => agent.get(`${baseUrl}/users/${username}/repos`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.status).to.equal(statusCode.OK);
            const repository = response.body.find((repos) => repos.name === repo);
            expect(repository.name).to.equal(repo);
            expect(repository.private).to.equal(false);
            expect(repository.description).to.equal('An awesome html report for Jasmine');
          }));
      });
    
      describe('Downloading the repository', () => {
        const noExpectedMd5 = 'd41d8cd98f00b204e9800998ecf8427e';
        const expectedMd5 = 'f2c7f95660350363942d51680365bb56';
        let zip;
    
        before(async () => {
          const downloadQueryResponse = await agent.get(`https://github.com/${username}/${repo}/archive/master.zip`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent')
            .buffer(true);
    
          zip = downloadQueryResponse.text;
        });
    
        it('then the repository should be downloaded', () => {
          expect(md5(zip)).to.not.equal(noExpectedMd5);
          expect(md5(zip)).to.equal(expectedMd5);
        });
      });
    
      describe('When checking and dowloading the README file', () => {
        let readme;
        let files;
        const readmeInfo = {
          name: 'README.md',
          path: 'README.md',
          sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
        };
        
        before(async () => {
          const response = await agent.get(`${baseUrl}/repos/${username}/${repo}/contents/`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);

          files = response.body
          readme = files.find((file) => file.name === 'README.md');
        });
    
        it('Then the README file should be checked', async () => {            
          assert.exists(readme);
          expect(readme).containSubset(readmeInfo);
        });
        const expectedMd5 = '97ee7616a991aa6535f24053957596b1';
        let content;

        before(async () => {            
            const responseDownload = await agent.get(readme.download_url);
            content = responseDownload.text;
          });
        it('Then the README file should be downloaded', () => {          
          expect(md5(content)).to.equal(expectedMd5);
        });
      });
});
  