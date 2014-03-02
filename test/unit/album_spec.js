'use strict';

process.env.DBNAME='nodealbumtest';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Album;
var Song;

describe('Album', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Album = require('../../app/models/album');
      Song = require('../../app/models/song');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/covers/test* ' + __dirname + '/../../app/static/audios/test*';
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

  describe('new', function(){
    it('should create a new instance of album', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      expect(a1).to.be.instanceof(Album);
      expect(a1.title).to.equal('Test Thriller');
      expect(a1.artist).to.equal('Michael Jackson');
      expect(a1.genre).to.equal('Pop');
      expect(a1.year).to.equal(1983);
      done();
    });
  });

  describe('#addCover', function(){
    it('should add a cover to the album', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var oldname = __dirname + '/../fixtures/euro1.jpg';
      a1.addCover(oldname);
      expect(a1.cover).to.equal('/img/covers/testthriller.jpg');
      done();
    });
  });

  describe('#insert', function(){
    it('should save the god damn album', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var oldname = __dirname + '/../fixtures/euro1.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('#update', function(){
    it('should update an album in the db', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var oldname = __dirname + '/../fixtures/euro1.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        a1.title='Real Thriller';
        a1.update(function(count){
          expect(a1.title).to.equal('Real Thriller');
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('#addSong', function(){
    it('should add a song to an album', function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var s1 = new Song({title:'Beat It', tags:'Beatin It'});
      var oldname = __dirname + '/../fixtures/euro1.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        a1.addSong(s1._id.toString(), function(){
          expect(a1.songs[0]).to.equal('/audios/testthriller/eurosong.jpg');
          done();
        });
      });
    });
  });

  describe('find methods', function(){
    beforeEach(function(done){
      var a1 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      var a2 = new Album({title:'Test Off the Wall', artist:'Michael Jackson', genre:'Pop', year:'1981'});
      var a3 = new Album({title:'Test History', artist:'Michael Jackson', genre:'Pop', year:'1993'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            done();
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should return all the albums in the collection', function(done){
        Album.findAll(function(records){
          expect(records).to.have.length(3);
          done();
        });
      });
    });

    describe('findby', function(){
      it('should find by ID', function(done){
        var a4 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
        a4.insert(function(){
          Album.findById(a4._id.toString(), function(record){
            expect(record._id.toString()).to.equal(a4._id.toString());
            done();
          });
        });
      });

      it('should find by album title', function(done){
        var a5 = new Album({title:'Test Thriller', artist:'Dudley Dooright', genre:'Pop', year:'1983'});
        a5.insert(function(){
          Album.findByTitle('Test Thriller', function(records){
            expect(records).to.have.length(2);
            done();
          });
        });
      });

      it('should find by genre', function(done){
        Album.findByGenre('Pop', function(records){
          expect(records).to.have.length(3);
          done();
        });
      });

      it('should find by artist', function(done){
        Album.findByArtist('Michael Jackson', function(records){
          expect(records).to.have.length(3);
          done();
        });
      });
      /*
      it('should find song ID', function(done){
        Album.findBySongId('Pop', function(records){
          expect(records).to.have.length(3);
          done();
        });
      });
      */
    });
  });

  describe('.deleteById', function(){
    it('should delete an album by ID', function(done){
      var a4 = new Album({title:'Test Thriller', artist:'Michael Jackson', genre:'Pop', year:'1983'});
      a4.insert(function(){
        Album.deleteById(a4._id.toString(), function(count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });


});
