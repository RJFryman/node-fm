(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $('#toggle').click(showAddAlbum);
  }

  function showAddAlbum(){
    $('#hidden').toggleClass('hide');
  }

})();

