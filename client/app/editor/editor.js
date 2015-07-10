module.exports = function() {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");

  //setting defaults
  var editSession = ace.createEditSession('ff', 'javascript');
  editor.getSession().setTabSize(2);
  editor.getSession().setUseWrapMode(true);

  editor.on('change', function(data){
    // console.log(data);  //data.data.text === whatever's in the editor
                        //data.data.action === "insertText"
  });

  //extensions
  $('#settings').on('click', function(){
      editor.execCommand('showSettingsMenu');
  });

  //menu functionality
  $('#fontSize').on('change', function(){
    var fontSize = this.options[this.selectedIndex].value;
    editor.setFontSize(parseInt(fontSize));
  });

  $('#wordWrap').on('change', function(){
    var wordWrap = this.options[this.selectedIndex].value;
    if (wordWrap === "false"){
      wordWrap = false;
    } else {
      wordWrap = true;
    }
    editor.getSession().setUseWrapMode(wordWrap);
  });

  $('#tabSize').on('change', function(){
    var tabSize = this.options[this.selectedIndex].value;
    editor.getSession().setTabSize(tabSize);
  });

  $('#highlightActiveLine').on('change', function(){
    var highlightActiveLine = this.options[this.selectedIndex].value;
    if (highlightActiveLine === "false"){
      highlightActiveLine = false;
    } else {
      highlightActiveLine = true;
    }
    editor.setHighlightActiveLine(highlightActiveLine);
  });

  $('#language').on('change', function(){
    var language = this.options[this.selectedIndex].value;
    editor.session.setMode("ace/mode/" + language);
  });
};

