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
    .get('/albums')
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

  describe('GET /albums/:id', function(){
    it('should display the specific album with that id', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var a2 = new Album({title:'Test Off the Wall', artist:'Michael Jackson', genre:'Pop', year:'1981'});
      var a3 = new Album({title:'Test History', artist:'Michael Jackson', genre:'Pop', year:'1993'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            request(app)
            .get('/albums/'+a1._id.toString())
            .expect(200, done);
          });
        });
      });
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

  /*describe('PUT /albums/:id', function(){
    it('should update an album', function(done){

    });
  });*/

  describe('DEL /albums/:id', function(){
    it('should delete an album', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var a2 = new Album({title:'Test Off the Wall', artist:'Michael Jackson', genre:'Pop', year:'1981'});
      var a3 = new Album({title:'Test History', artist:'Michael Jackson', genre:'Pop', year:'1993'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            request(app)
            .del('/albums/'+a1._id.toString())
            .expect(302, done);
          });
        });
      });
    });
  });

});
