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
      var copyFile2 = __dirname + '/../fixtures/copy-2-euro.jpg';
      fs.createReadStream(ogFile).pipe(fs.createWriteStream(copyFile2));
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
        obj.tags = 'heavy, drums';
        obj.albumId = a1._id;
        var s1 = new Song(obj);
        expect(s1).to.be.instanceof(Song);
        expect(s1.title).to.equal('Test Song');
        expect(s1.tags).to.deep.equal(['heavy','drums']);
        expect(s1.albumId.toString()).to.have.length(24);
      });
    });
  });

  describe('#addFile', function(){
    it('should add a file to the song', function(done){
      var alb = {};
      alb.title = 'Test Album';
      alb.artist = 'Test Artist';
      alb.genre = 'Beef Stock';
      alb.year = 1978;
      var a1 = new Album(alb);
      a1.insert(function(){
        var obj = {};
        obj.title = 'Test Song';
        obj.tags = 'heavy, drums';
        obj.albumId = a1._id;
        var s1 = new Song(obj);
        var oldName = __dirname + '/../fixtures/copy-2-euro.jpg';
        s1.addFile(oldName, 'song.jpg', function(){
          expect(s1.file).to.equal('/audios/testalbum/song.jpg');
          done();
        });
      });
    });
  });

  describe('#insert', function(){
    it('should add a song to the album', function(){
      var alb = {};
      alb.title = 'Test Album';
      alb.artist = 'Test Artist';
      alb.genre = 'Beef Stock';
      alb.year = 1978;
      var a1 = new Album(alb);
      a1.makeDirectory();
      a1.insert(function(){
        var obj = {};
        obj.title = 'Test Song';
        obj.tags = 'drums, sitar, bang';
        obj.albumId = a1._id;
        var s1 = new Song(obj);
        s1.insert(function(err){
          expect(s1._id.toString()).to.have.length(24);
        });
      });
    });
  });

  describe('#update', function(){
    it('should update an existing song', function(done){
      var s1 = new Song({title:'Crazy', tags: 'pow, bang'});

      s1.insert(function(){
        s1.title = 'High';
        var oldId = s1._id.toString();
        s1.update(function(){
          Song.findById(oldId, function(song){
            expect(song.title).to.equal('High');
            expect(song._id.toString()).to.equal(oldId);
            done();
          });
        });
      });
    });
  });

  describe('findByAlbumId', function(){
    it('should return songs with matching album ID', function(done){
      var alb = {};
      alb.title = 'Test Album';
      alb.artist = 'Test Artist';
      alb.genre = 'Beef Stock';
      alb.year = 1978;
      var a1 = new Album(alb);
      a1.insert(function(){
        var s1 = new Song({title:'Good Song', tags: 'pow, bang', albumId:a1._id});
        var s2 = new Song({title:'Great Song', tags: 'bob, bang', albumId:a1._id});
        var s3 = new Song({title:'Better Song', tags: 'geek, nerd', albumId:a1._id});

        s1.insert(function(){
          s2.insert(function(){
            var id = s2.albumId.toString();
            s3.insert(function(){
              Song.findByAlbumId(id, function(songs){
                expect(songs).to.have.length(3);
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('find methods', function(){
    var s1, s2, s3;
    beforeEach(function(done){
      s1 = new Song({title:'Fuck', tags: 'suck, bang'});
      s2 = new Song({title:'Suck', tags: 'fuck, bang'});
      s3 = new Song({title:'Bang', tags: 'suck, fuck'});

      s1.insert(function(){
        s2.insert(function(){
          s3.insert(function(){
            done();
          });
        });
      });
    });

    describe('findAll', function(){
      it('should return all songs in the songs collection', function(done){
        Song.findAll(function(songs){
          expect(songs).to.have.length(3);
          expect(songs[0]._id.toString()).to.have.length(24);
          expect(songs[1]).to.have.property('title');
          expect(songs[2]).to.have.property('tags');
          done();
        });
      });
    });

    describe('findById', function(){
      it('should return a song object with matching Id', function(done){
        Song.findById(s3._id.toString(), function(song){
          expect(song._id.toString()).to.have.length(24);
          expect(song).to.have.property('title');
          expect(song).to.have.property('tags');
          done();
        });
      });
    });

    describe('findByTitle', function(){
      it('should return song objects with matching title', function(done){
        Song.findByTitle(s2.title, function(songs){
          expect(songs[0]._id.toString()).to.have.length(24);
          expect(songs[0]).to.have.property('title');
          expect(songs[0]).to.have.property('tags');
          done();
        });
      });
    });

    describe('findByTag', function(){
      it('should return song objects with matching tag', function(done){
        Song.findByTag(s1.tags, function(songs){
          expect(songs[0]._id.toString()).to.have.length(24);
          expect(songs[0]).to.have.property('title');
          expect(songs[0]).to.have.property('tags');
          done();
        });
      });
    });

    describe('deleteById', function(){
      it('should delete a song object with matching Id', function(done){
        Song.deleteById(s3._id.toString(), function(count){
          Song.findById(s3._id.toString(), function(song){
            expect(count).to.equal(1);
            expect(song).to.equal(null);
            done();
          });
        });
      });
    });
  });
});

