import chai from 'chai';
import supertest from 'supertest';
import nock from 'nock';
chai.config.includeStack = true;
global.expect = chai.expect;
global.nock = nock;
global.request = supertest;