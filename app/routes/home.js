'use strict';

var Song = require('../models/song');

exports.index = function(req, res){
  Song.findAll(function(songs){
    res.render('home/index', {title: 'Node-FM', songs:songs});
  });
};

