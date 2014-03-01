'use strict';

exports.index = function(req, res){
  res.render('artists/index', {title: 'Artist Page'});
};
