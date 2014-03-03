(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $('#toggle').click(showAddAlbum);
    $('.delButton').click(clickDeleteSong);
    $('.delAlbum').click(clickDeleteAlbum);
  }

  function showAddAlbum(){
    $('#hidden').toggleClass('hide');
  }

  function clickDeleteSong(){
    var url = '/songs/'+$(this).parent().attr('data-id');
    var type = 'DELETE';
    var success = reloadPage;
    $.ajax({url:url, type:type, success:success});
  }

  function clickDeleteAlbum(){
    var url = '/albums/'+$(this).parent().attr('data-id');
    var type = 'DELETE';
    var success = reloadPage;
    $.ajax({url:url, type:type, success:success});
  }

  function reloadPage(data){
    if(data.success){
      location.reload();
    }
  }

})();

