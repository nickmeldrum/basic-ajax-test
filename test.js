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

    it('200 response executes the "then" promise', function(done) {
        this.server.respondWith('GET', 'http://localhost:8000/users', [404, { 'Content-Type': 'application/json' }, '[{"name": "Nick", "age": 21}, {"name": "John", "age": 18}]']);

        var promise = ajax.get('http://localhost:8000/users');

        promise.then(function handleGetUsers(response) {
            console.log('then');

            response.status.should.equal(200);
            //response.json.length.should.equaal(2);
            response.json[0].name.should.equal('Nick');
        })
        .fail(function handleGetUsersFailed(response) {
            console.log('fail');
            console.log(response);

            false.should.equal(true);
        })
        .catch(function (err) {
            console.log('catch');
            console.log(err);

            done(err); })
        .finally(function () {
            console.log('finally');
            done();
        });
        
        this.server.respond();
    });
});
 
