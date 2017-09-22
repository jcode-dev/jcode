/**
 * THREE blockly
 */
JCODE.three = {};

JCODE.three.blocks = {
  AxisHelper: {
    msg: " %1 は axisヘルパー 長さ %2", 
    code: function(operator, text) {
      return "var " + operator + " = new THREE.AxisHelper(" + text + ");\n";
    }
  },
  scene_add: {
    msg: "シーンに追加 %1",
    pno: 0, 
    code: function(operator, text) {
      return "JCODE.scene.add (" + operator + ");\n";
    }
  }
};
// CUSTOM toolbox
JCODE.three.toolbox = function(workspace) {
  var prefix = "three_";
  var obj = JCODE.three.blocks;
  var xmlList = [];
  for (var p in obj) {
    var blockText = '<xml>' +
    '<block type="'+prefix+p+'">' +
    '</block>' +
    '</xml>';
    var block = Blockly.Xml.textToDom(blockText).firstChild;
    xmlList.push(block);
  }              
  return xmlList;
};

(function() {
  var prefix = "three_";
  var obj = JCODE.three.blocks;
  for (var p in obj) {
    JCODE.createBlock(obj, prefix, p);
  }              
})();

