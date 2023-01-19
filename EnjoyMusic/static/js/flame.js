'use strict';

var fallingFlame = function(fallingFlame) {
  this.fallingFlame = fallingFlame;
  this.notesCtx = this.fallingFlame.getContext('2d');
  this.xFlame = this.fallingFlame.width/3;
  this.yFlame = 0;
  this.imgTag = new Image();
}

fallingFlame.prototype.setfallingFlame = function (fallingFlame) {
  this.fallingFlame = fallingFlame;
}

fallingFlame.prototype.getfallingFlame = function () {
  return this.fallingFlame;
}

fallingFlame.prototype.setNotesCtx = function (notesCtx) {
  this.notesCtx = notesCtx;
}
fallingFlame.prototype.getNotesCtx = function () {
  return this.notesCtx;
}

fallingFlame.prototype.setXFlame = function (xFlame) {
  this.xFlame = xFlame;
}
fallingFlame.prototype.getXFlame = function () {
  return this.xFlame;
}

fallingFlame.prototype.setYFlame = function (yFlame) {
  this.yFlame = yFlame;
}
fallingFlame.prototype.getYFlame = function () {
  return this.yFlame;
}

fallingFlame.prototype.setImgTag = function (src) {
  this.imgTag.onload = this.draw.bind(this);
  this.imgTag.src = src;
}
fallingFlame.prototype.getImgTag = function () {
  return this.imgTag;
}

fallingFlame.prototype.draw = function () {
   //this.notesCtx.clearRect(0, 0, this.fallingFlame.width, this.fallingFlame.height);  // clear canvas
   this.notesCtx.clearRect(this.xFlame, this.yFlame-5, 140, 5);  // clear canvas
   this.notesCtx.drawImage(this.imgTag, this.xFlame, this.yFlame, 140, 5); // draw image at current position
}
