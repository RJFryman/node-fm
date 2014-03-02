'use strict';

exports.index = function(req, res){
  res.render('artists/index', {title: 'Artist Page'});
};

exports.show = function(req, res){
  res.render('artists/show', {title: 'Artist Indivual page'});
};
