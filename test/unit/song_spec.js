'use strict';

process.env.DBNAME = 'node-song-test-unit';
var fs = require('fs');
var exec = require('child_process').exec;
var expect = require('chai').expect;
var Song;
var Album;

describe('Song', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Song = require('../../app/models/song');
      Album = require('../../app/models/album');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/audios/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var ogFile = __dirname + '/../fixtures/euro.jpg';
      var copyFile = __dirname + '/../fixtures/euro-copy.jpg';
      fs.createReadStream(ogFile).pipe(fs.createWriteStream(copyFile));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new Song object', function(){
      var alb = {};
      alb.title = 'Test Album';
      alb.artist = 'Test Artist';
      alb.genre = 'Beef Stock';
      alb.year = 1978;
      var a1 = new Album(alb);
      a1.insert(function(){
        var obj = {};
        obj.title = 'Test Song';
        //obj.file = ;
        obj.tags = 'heavy, drums';
        obj.albumId = a1._id;
        console.log(obj.albumId);
        var s1 = new Song(obj);
        expect(s1).to.be.instanceof(Song);
        expect(s1.title).to.equal('Test Song');
        expect(s1.tags).to.deep.equal(['heavy','drums']);
        console.log(s1.albumId);
        expect(s1.albumId.toString()).to.have.length(24);
      });
    });
  });

  describe('#save', function(){
    it('should add a song to the album', function(){
      var alb = {};
      alb.title = 'Test Album';
      alb.artist = 'Test Artist';
      alb.genre = 'Beef Stock';
      alb.year = 1978;
      var a1 = new Album(alb);
      a1.insert(function(){
        var obj = {};
        obj.title = 'Test Song';
        //obj.file = ;
        obj.tags = 'fuck, suck, bang';
        console.log(obj.tags);
        obj.albumId = a1._id;
        var s1 = new Song(obj);
        var oldName = __dirname + '/../fixtures/euro-copy.jpg';
        s1.save(oldName, function(record){
          expect(s1._id.toString()).to.have.length(24);
        });
      });
    });
  });

  describe('findAll', function(){
    it('should return all songs in the songs collection', function(){
      var s1 = new Song({title:'Fuck', tags: 'suck, bang'});
      var s2 = new Song({title:'Suck', tags: 'fuck, bang'});
      console.log(
      var s3 = new Song({title:'Bang', tags: 'suck, fuck'});
      var oldName = __dirname + '/../fixtures/euro-copy.jpg';
      s1.save(oldName, function(record){
        expect(s1._id.toString()).to.have.length(24);
      });
    });
  });
});

