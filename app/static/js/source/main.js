(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#toggle').click(showAddAlbum);
    getAllSongs();
  }

  function showAddAlbum(){
    $('#hidden').toggleClass('hide');
  }

  function getAllSongs(){
    var url = '/songs';
    $.getJSON(url, function(data){
      for(var i = 0; i < data.songs.length; i++){
        addSongToTable(data.songs[i]);
      }
    });
  }
  function addSongToTable(song){
    var $row = $('<tr>');
    var $title = $('<td>');
    var $artist = $('<td>');
    var $album = $('<td>');
    var $tags = $('<td>');
//    var $play = $('<audio>');

    $row.attr('data-song-id', song._id);
    $title.text(song.title);
    $artist.text(song.artist);
    $album.text(song.album);
    $tags.text(song.tags);
//    $play.att('src', song.song);
//    $play.addClass('controls=true');

    $row.append($title, $artist, $album, $tags);
    $('#songTable > tbody').append($row);
  }




})();

