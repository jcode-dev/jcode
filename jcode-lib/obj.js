


JCODE.createAngle = function(obj, prefix, funcname, color) {
  var blockid = prefix + funcname;
  var colour = obj[funcname].colour || color;
  Blockly.Blocks[blockid] = {
    init: function() {
      this.jsonInit({
        "output": null,
        "colour": colour
      });
      this.appendDummyInput()
      .appendField(obj[funcname].msg)
      .appendField(new Blockly.FieldAngle(obj[funcname].angle), 'FIELDNAME');
    }
  };
  Blockly.JavaScript[blockid] = function(block) {
    var text = parseFloat(block.getFieldValue('FIELDNAME'));
    return [text, Blockly.JavaScript.ORDER_ATOMIC];
  };
}

JCODE.createDropdown = function(obj, prefix, funcname, color) {
  var blockid = prefix + funcname;
  var colour = obj[funcname].colour || color;
  Blockly.Blocks[blockid] = {
    init: function() {
      this.jsonInit({
        "output": null,
        "colour": colour
      });
      this.appendDummyInput()
      .appendField(obj[funcname].msg)
      .appendField(new Blockly.FieldDropdown(
        obj[funcname].dropdown
       /* 
        [
        [ "たま", "sphere" ],
        [ "ぴん", "pin" ],
        [ "はこ", "box" ]
        ]
      */
      ), 'FIELDNAME');
    }
  };
  Blockly.JavaScript[blockid] = function(block) {
    var text = this.getFieldValue('FIELDNAME');
    var code = '"' + text + '"';
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  };
}
/*
 *  オブジェクトの値を返さない JCODE.obj.withoutReturn();
 */

JCODE.createBlock = function(obj, prefix, funcname, color) {
  var colour = obj[funcname].colour || color;
  var blockid = prefix + funcname;
  var pno = (typeof obj[funcname].pno === "undefined") ? 1 : obj[funcname].pno;
  var args = [];
  args.push({"type": "field_variable", "name": "VAR", "variable": "obj"});
  if (pno) {
    args.push({"type": "input_value", "name": "VALUE"});
  }
  Blockly.Blocks[blockid] = {
    init: function() {
      this.jsonInit({
        "message0": obj[funcname].msg,
        "args0": args,
        "previousStatement": null,
        "nextStatement": null,
        "colour": colour
      });
      this.setInputsInline(true);
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
      this.setTooltip(function() {
        return 'へんすう "%1"　にオブジェクトをわりあて.'.replace('%1',
            thisBlock.getFieldValue('VAR'));
      });
    }
  };
  Blockly.JavaScript[blockid] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    var operator = this.getFieldValue('VAR');
    var subString = "substr";
    console.log(text);
    var code = obj[funcname].code(operator, text);
    return code ;
  };
};

