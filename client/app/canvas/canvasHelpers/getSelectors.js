var strokeColorSelect = document.getElementById('strokeColor');
var fillColorSelect = document.getElementById('fillColor');
var lineWidthSelect = document.getElementById('lineWidth');
var toolSelect = document.getElementById('toolSelect');
var clearAllButton = document.getElementById('clearAll');
var undoButton = document.getElementById('undo');
var redoButton = document.getElementById('redo');
var copyButton = document.getElementById('copy');
var deleteButton = document.getElementById('delete');
var imageUpload = document.getElementById('imageUpload');

module.exports = {
  stroke: strokeColorSelect,
  fill: fillColorSelect,
  lineWidth: lineWidthSelect,
  tool: toolSelect,
  clear: clearAllButton,
  undo: undoButton,
  redo: redoButton,
  copy: copyButton,
  delete: deleteButton,
  image: imageUpload
};