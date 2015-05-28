'use strict';
 
var should = require('chai').should(),
    sinon = require('sinon'),
    ajax = require('basic-ajax');

describe('#ajax', function() {
    beforeEach(function() {
        this.server = sinon.fakeServer.create();
    });

    afterEach(function() {
        this.server.restore();
    });

    it('200 response executes the "then" promise with json response as an object', function(done) {
        this.server.respondWith('GET', 'http://localhost:8000/users', [200, { 'Content-Type': 'application/json' }, '[{"name": "Nick", "age": 21}, {"name": "John", "age": 18}]']);

        var promise = ajax.get('http://localhost:8000/users');

        promise.then(function handleGetUsers(response) {
            response.status.should.equal(200);
            response.json[0].name.should.equal('Nick');
        })
        .fail(function handleGetUsersFailed(response) {
            if (response instanceof Error) throw response; // here to handle exceptions in then() function falling through to fail()
            response.status.should.equal(200);
        })
        .catch(function (err) {
            done(err); })
        .finally(function () {
            done();
        });
        
        this.server.respond();
    });
});
 
