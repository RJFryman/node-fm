'use strict';

process.env.DBNAME = 'nodealbumtest';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var Album;

describe('albums', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/covers/test* ' + __dirname + '/../../app/static/audios/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro1.jpg';
      var copy2file = __dirname + '/../fixtures/euro2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(){
        done();
      });
    });
  });

  describe('GET /albums', function(){
    it('should display the album html page', function(done){
      request(app)
      .get('/albums')
      .expect(200, done);
    });
  });

  describe('POST /albums', function(){
    it('should create a new album and send user back to home', function(done){
      var filename = __dirname + '/../fixtures/euro1.jpg';
      request(app)
      .post('/albums')
      .attach('cover', filename)
      .field('title', 'Test Thriller')
      .field('artist', 'Michael Jackson')
      .field('genre', 'Pop')
      .field('year', '1983')
      .expect(302, done);
    });
  });

});
