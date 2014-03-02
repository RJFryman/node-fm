(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#toggle').click(showAddAlbum);
  }

  function showAddAlbum(){
    $('#hidden').toggleClass('hide');
  }

})();

