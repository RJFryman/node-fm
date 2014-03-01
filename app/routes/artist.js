'use strict';

exports.index = function(req, res){
  res.render('artist/index', {title: 'Artist Page'});
};
