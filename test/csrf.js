/**
 * Module Dependencies
 */

var request = require('supertest');
var server = require('./server');
var assert = require('assert');

describe('csrf', function() {

  it('should create a CSRF token on get requests', function(done) {
    request(server.listen())
      .get('/')
      .set('Cookie', 'token=hiya')
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.text, 'ae16aaa64e64136e446d40a11a4bce1d57792861b01f0c3d574b4ed6303d22640f26650342733815628c854a0d8a05d639db176523a83fb93d8a90570d5da1f9')
        done();
      });
  })

  it('should verify a CSRF token', function(done) {
    request(server.listen())
      .post('/')
      .set('Cookie', 'token=hiya')
      .send({ _csrf: 'ae16aaa64e64136e446d40a11a4bce1d57792861b01f0c3d574b4ed6303d22640f26650342733815628c854a0d8a05d639db176523a83fb93d8a90570d5da1f9' })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.text, 'you are in!');
        done();
      });
  });

  it('should return 403 when there is no cookie present', function(done) {
    request(server.listen())
      .post('/')
      .set('Accept', 'text/plain')
      .send({ _csrf: 'ae16aaa64e64136e446d40a11a4bce1d57792861b01f0c3d574b4ed6303d22640f26650342733815628c854a0d8a05d639db176523a83fb93d8a90570d5da1f9' })
      .expect(403)
      .end(function(err, res) {
        assert.equal(res.text, 'failed csrf check, no cookie value found');
        done();
      })
  })

  it('should return 403 when there is no csrf token present', function(done) {
    request(server.listen())
      .post('/')
      .set('Accept', 'text/plain')
      .set('Cookie', 'token=hiya')
      .expect(403)
      .end(function(err, res) {
        assert.equal(res.text, 'failed csrf check, no csrf token present');
        done();
      })
  })

  it('should return 403 when the csrf token doesnt match', function(done) {
    request(server.listen())
      .post('/')
      .set('Accept', 'text/plain')
      .set('Cookie', 'token=hiya')
      .send({ _csrf: 'ae16aaa64e64136e446d40a11a4bce1d57792861b01f0c3d574b4ed6303d22640f26650342733815628c854a0d8a05d639db176523a83fb93d8a90570d5da1f9' })
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.text, 'you are in!');
        done();
      })
  })

})
