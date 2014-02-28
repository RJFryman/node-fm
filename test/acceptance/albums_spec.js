'use strict';

process.env.DBNAME = 'nodealbumtest';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child-process').exec;
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
    var testdir = __dirname + '/../../app/static/img/covers/test*';
    var cmd = 'rm -rf' + testdir;

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


});
