const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

// Create a stub for the sendMail function
const sendMailStub = sinon.stub();

// Create the nodemailer stub, including createTransport
const nodemailerStub = {
  createTransport: sinon.stub().returns({
    sendMail: sendMailStub
  })
};

// Create the firebase-functions stub
const functionsStub = {
  config: () => ({
    gmail: {
      user: 'test@gmail.com',
      pass: 'testpass'
    }
  })
};

// Use proxyquire to load index.js with the stubs
const myFunctions = proxyquire('../index', {
  'firebase-functions': functionsStub,
  'nodemailer': nodemailerStub
});


describe('Cloud Functions', function() {

  beforeEach(function() {
    // Reset stubs before each test
    sendMailStub.reset();
  });

  it('should have a mail function', function() {
    assert.isFunction(myFunctions.mail, 'mail is not a function');
  });

  it('should send an email successfully', (done) => { // Use done for async test
    // Configure the sendMail stub for success
    sendMailStub.yields(null, { response: '250 OK' });

    const req = { body: { name: 'test', email: 'test@test.com', message: 'hello' } };
    const res = {
      status: function(code) {
        assert.equal(code, 200);
        return this;
      },
      send: function(message) {
        assert.equal(message, 'Email sent successfully');
        done(); // Signal test completion
      }
    };

    myFunctions.mail(req, res);
  });

  it('should handle errors when sending email', (done) => {
    // Configure the sendMail stub for failure
    const error = new Error('Mail failed');
    sendMailStub.yields(error);

    const req = { body: { name: 'test', email: 'test@test.com', message: 'hello' } };
    const res = {
      status: function(code) {
        assert.equal(code, 500);
        return this;
      },
      send: function(message) {
        assert.equal(message, 'Error sending email: Error: Mail failed');
        done(); // Signal test completion
      }
    };

    myFunctions.mail(req, res);
  });
});
