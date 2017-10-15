/*
インストラクションのヘルパー
JCODE.instruction
JCODE.balloon
*/

// インストラクション ブロックの定義
JCODE.jcodeInstractionCallback = function(workspace) {
var list = [
  "JCODE_block_getvar",
  "JCODE_block_setvar",
  "JCODE_block_method",
  "JCODE_block_constr",
  "JCODE_block_prop",
  "JCODE_instruction_new",
    "JCODE_instruction_html",
    "JCODE_instruction_click"
];
var xmlList = [];
  for (var i = 0; i < list.length; i++) {
    var blockText = '<xml>' +
        '<block type="'+list[i]+'">' +
        '</block>' +
        '</xml>';
    var block = Blockly.Xml.textToDom(blockText).firstChild;
    xmlList.push(block);

  }
  var blockText = '<xml><button text="A button" callbackKey="myFirstButtonPressed"></button></xml>';
  var block = Blockly.Xml.textToDom(blockText).firstChild;
  xmlList.push(block);
  workspace.registerButtonCallback("myFirstButtonPressed", function(){
    Blockly.Variables.createVariable(workspace, null, 'THREE');
  });
  return xmlList;
};

var var_list = {
  list:{
    "new JCODE.object3d": ["three_constr", "新しく作る", "% % % "],
    //"new JCODE.object3d": ["three_method", "新しく作る", "% % % ",{constr:true}],
    //"new JCODE.object3d": ["three_method", "新しく作る", "%は% %"],
    ".moveForward": ["three_method", "前にうごく", "%が% %センチ"],
    ".trunRight": ["three_method", "右に向く", "%が% %度"],
    ".setColor": ["three_method", "色は", "%の% %"],
    //" .position.x": ["three_method", "X座標", "%の% %"],
    ".position.x": ["three_prop", "X座標", "%の% %"],
    ".position.y": ["three_prop", "Y座標", "%の% %"],
    ".position.z": ["three_prop", "Z座標", "%の% %"]
  },
  getOptions: function(group) {
    var a =[];
    for (var prop in this.list) {
      if (this.list[prop][0] === group) {
        a.push([this.list[prop][1], prop]);
      }
    }
    if (!a.length) {
      a.push(["error","error"]);
    }
    //console.log(a);
    return a;
  },
  getLabels: function(method) {
    var r = [];
    if (this.list[method] && this.list[method][2]) {
      r = this.list[method][2].split('%');
    }
    return r;
  },
  getConfig: function(method) {
    var r = {};
    if (this.list[method] && this.list[method][3]) {
      r = this.list[method][3];
    }
    return r;
  }
};

// インストラクションの初期化
Blockly.Blocks['JCODE_block_setvar'] = {
  init: function() {
    this.jsonInit({
      "message0": "変数 %1 は %2",
      "args0": [
        {"type": "field_variable",
        "name": "OBJECT",
        "variable": "obj",
        "variableTypes":["OBJECT"]
        },
        {"type": "input_value", "name": 'ARG0'}
      ],
      //"output": "OBJECT",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 60,
      //"mutator": "JCODE_mutator_setvar"
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
}
// インストラクションの初期化
Blockly.Blocks['JCODE_block_getvar'] = {
  init: function() {
    this.jsonInit({
      "message0": " %1",
      "args0": [
        {"type": "field_variable",
        "name": "OBJECT",
        "variable": "obj",
        "variableTypes":["OBJECT"]
        },
      ],
      "output": "OBJECT",
      //"previousStatement": null,
      //"nextStatement": null,
      "colour": 60,
      //"mutator": "JCODE_mutator_getvar"
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
}

Blockly.JavaScript['JCODE_block_getvar'] = function(block) {
  var code = this.getFieldValue('OBJECT');
 return [code, Blockly.JavaScript.ORDER_MEMBER];
}
Blockly.JavaScript['JCODE_block_setvar'] = function(block) {
  var args = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
  var obj = this.getFieldValue('OBJECT');
  var code = obj + " = " + args + ";\n";
 return [code, Blockly.JavaScript.ORDER_MEMBER];
}

Blockly.Blocks['JCODE_block_constr'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [{
          "type": "field_dropdown",
          "name": "CODE",
          "options": var_list.getOptions("three_constr")
       }],
       "message1": "%1",
       "args1": [
         {"type": "input_value", "name": 'ARG0'}
       ],
      "inputsInline": true,
      "output": "OBJECT",
      "colour": 60,
      "mutator": "JCODE_mutator_constr"
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
}

Blockly.JavaScript['JCODE_block_constr'] = function(block) {
  var args = '(';
  if (!! this.getInput('ARG0')) {
    args += Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
  }
  if (!! this.getInput('ARG1')) {
    args += ',';
    args += Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_MEMBER);
  }
  args += ')';
  var code = this.getFieldValue('CODE') + args;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

/**
 * Mixin for mutator functions in the 'math_is_divisibleby_mutator'
 * extension.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Extensions.registerMutator('JCODE_mutator_constr',
  {
    checkMethod_: function(method) {

      var ret = {};
      ret.return_output = "true";
      ret.new_constructor = "false";
      ret.param_num = "1";
      return ret;
  
  /*
      var item = method.split('_');
      var ret = {};
      ret.return_output = (item[0] == "RETN");
      ret.new_constructor = (item[1] == "NEW");
      ret.param_num = (item[3] == "PRM1")? "1" : "0";
      return ret;
  */
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');

      container.setAttribute('output', !! this.outputConnection);
      container.setAttribute('object', !! this.getInput('OBJECT'));
      container.setAttribute('arg0', !! this.getInput('ARG0'));
      container.setAttribute('arg1', !! this.getInput('ARG1'));
      return container;
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      var ret = {};
      ret.output = (xmlElement.getAttribute('output') == 'true');
      ret.object = (xmlElement.getAttribute('object') == 'true');
      ret.arg0 = (xmlElement.getAttribute('arg0') == 'true');
      ret.arg1 = (xmlElement.getAttribute('arg1') == 'true');
      this.updateStatement_(ret);
    },
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    // newStatement == true 値を返す関数
    updateStatement_: function(inp) {
      var newStatement = inp.output;
      var oldStatement = !! this.outputConnection;
      if (newStatement != oldStatement) {
        this.unplug(true, true);
        //console.log("unplug", newStatement);
        if (newStatement) {
          //console.log("add output");
          this.setPreviousStatement(false);
          this.setNextStatement(false);
          this.setOutput(true);
        } else {
          //console.log("remove output");
          this.setOutput(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }
      }

      var newStatement = inp.object;
      var oldStatement = !! this.getInput('OBJECT');
      //console.log("obj", oldStatement, newStatement);
      if (newStatement != oldStatement) {
        if (! newStatement) {
          this.removeInput('OBJECT');
         } else {

          this.appendValueInput('OBJECT')
          .setCheck('OBJECT');
          this.moveInputBefore('OBJECT', 'LABEL1');
          //this.appendField('obj');
        }
      }

      //this.removeInput('LABEL1', true);
      
      var newStatement = inp.arg0;
      var oldStatement = !! this.getInput('ARG0');
       if (newStatement != oldStatement) {
        console.log("ccc");
        if (! newStatement) {
          this.removeInput('ARG0', true);
         } else {
          this.appendValueInput('ARG0');
        }
      }
      var newStatement = inp.arg1;
      var oldStatement = !! this.getInput('ARG1');
       if (newStatement != oldStatement) {
        console.log("ccc");
        if (! newStatement) {
          this.removeInput('ARG1', true);
         } else {
          this.appendValueInput('ARG1');
        }
      }
       //this.render();

    }
  },
  function() {
    if (! this.getField('OUTPUT')) return;
    this.getField('OUTPUT').setValidator(function(option) {
      var ret = this.sourceBlock_.checkMethod_(option);
      this.sourceBlock_.updateStatement_(ret);
    });
  }
);

Blockly.Extensions.registerMutator('JCODE_mutator_var',
{

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('output', !! this.outputConnection);
    return container;
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var output = (xmlElement.getAttribute('output') == 'true');
    this.updateStatement_(output);
  },
  /**
   * Modify this block to have (or not have) an input for 'is divisible by'.
   * @param {boolean} divisorInput True if this block has a divisor input.
   * @private
   * @this Blockly.Block
   */
  // newStatement == true 値を返す関数
  updateStatement_: function(output) {
 
    var newStatement = output;
    var oldStatement = !! this.outputConnection;
    if (newStatement != oldStatement) {
      this.unplug(true, true);
      //console.log("unplug", newStatement);
      if (newStatement) {
        //console.log("add output");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true);
      } else {
        //console.log("remove output");
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      }
    }

    if (false){
      
    var newStatement = output;
    var oldStatement = ! this.getInput('ARG0');
     if (newStatement != oldStatement) {
      if (newStatement) {
        this.removeInput('ARG0', true);
       } else {
        this.appendValueInput('ARG0');
      }
    }  }
  }


},
function() {
 }
);



/*
var three_list = {
  list:{
    ".moveForward": ["前にうごく", "%は% %センチ"],
    ".trunRight": ["右に向く", "%は% %度"],
    ".setColor": ["色は", "%の% %"]
  },
  getOptions: function() {
    var a =[];
    for (var prop in this.list) {
      console.log(prop);
      a.push([this.list[prop][0], prop]);
    }
    return a;
  },
  getLabels: function(method) {
    var r = [];
    if (this.list[method] && this.list[method][1]) {
      r = this.list[method][1].split('%');
    }
    return r;
  }
};
*/

// プロパティ　ブロック
// インストラクションの初期化
Blockly.Blocks['JCODE_block_method'] = {

  init: function() {

    this.appendDummyInput()
    .appendField(new Blockly.FieldCheckbox('FALSE'),'OUTPUT');
    this.appendValueInput('OBJECT');
    this.appendDummyInput().appendField('', 'LABEL1');
    this.appendDummyInput().appendField(new Blockly.FieldDropdown(
      var_list.getOptions("three_method")), 'METHOD');
    this.appendDummyInput().appendField('', 'LABEL2');
    this.appendValueInput('ARG0');
    this.appendDummyInput().appendField('', 'LABEL3');
      
    this.jsonInit({
      "inputsInline": true,
      "nextStatement": null,
      "previousStatement": null,
      "colour": 60,
      "mutator": "JCODE_mutator_method"
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};

Blockly.Extensions.registerMutator('JCODE_mutator_method',
  {
    output_: false,
    argsNumber_: 1,
    method: "error",
    rmvobj: false,
    constr: false,
    prop: false,
    
    checkOperand2_: function(method) {
      //console.log("change:",method, op)
      console.log("checkOperand2_",this.method);
      this.method = method;
    },
    checkOutput_: function(op) {
      console.log("checkOutput_1", op);
      if (op) {
        this.output_ = true;
        if (this.method === "new JCODE.object3d") {
          this.rmvobj = true;
        }
      } else {
        this.output_ = false;
        if (this.method === "new JCODE.object3d") {
          this.rmvobj = false;
        }
      }
      console.log("checkOutput_2",this.output_);
      this.updateStatement_();
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      //var ret2 = (this.checkOperand2_(
      //  this.getFieldValue('METHOD'),
      //  this.getFieldValue('OPERAND')
      //));
      console.log("mutationToDom output",this.output_);
      if (this.output_) {
        container.setAttribute('output', this.output_);
      }
      if (this.argsNumber_) {
        container.setAttribute('args', this.argsNumber_);
      }
      if (this.rmvobj) {
        container.setAttribute('rmvobj', this.rmvobj);
      }
      if (this.method) {
        container.setAttribute('method', this.method);
      }
      if (this.prop) {
        container.setAttribute('prop', this.prop);
      }
      this.checkOperand2_(this.getFieldValue('METHOD'));
      this.checkOutput_(this.getFieldValue('OUTPUT')=="TRUE");
      //container.setAttribute('method', ret.method);
      return container;
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      var a = xmlElement.getAttribute('output');
      if (a && a === "true") {
        this.output_ = true;
      }
      var a = xmlElement.getAttribute('rmvobj');
      if (a && a === "true") {
        this.rmvobj = true;
      }
      var a = xmlElement.getAttribute('method');
      if (a) {
        this.method = a;
      }
      var a = xmlElement.getAttribute('prop');
      if (a) {
        this.prop = a;
      }
      var a = (xmlElement.getAttribute('args'));
      if (a) {
        this.argsNumber_ = a;
      }
      console.log("domToMutation:",this.output_);
      
      this.updateStatement_();
    },
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    // newStatement == true 値を返す関数
    updateStatement_: function() {

      var method = this.method;
      var label = var_list.getLabels(method);
      var config = var_list.getConfig(method);
      if (config && config.constr) {
        this.constr = true;
      } else {
        this.constr = false;
      }
      if (this.rmvobj) {
        label[1] = ""
      }
      console.log("method:",method, label, config, this.constr);

      this.getField('LABEL1').setText(label[1]);
      this.getField('LABEL3').setText(label[3]);
      

      var newStatement = this.output_;
      var oldStatement = !! this.outputConnection;
      if (newStatement != oldStatement) {
        this.unplug(true, true);
        console.log("unplug");
        if (newStatement) {
          this.setPreviousStatement(false);
          this.setNextStatement(false);
          this.setOutput(true);
        } else {
          this.setOutput(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }
      }
  
      if (true) {
        var newStatement = this.rmvobj;
        var oldStatement = ! this.getInput('OBJECT');
        if (newStatement != oldStatement) {
          if (newStatement) {
            this.removeInput('OBJECT');
           } else {
            console.log("appppp");
            this.appendValueInput('OBJECT');
            //.setCheck('OBJECT');
            //this.moveInputBefore('OBJECT', 'LABEL1');
  
            this.moveInputBefore('OBJECT', "METHOD");
            //this.appendField('obj');
          }
        }
      }
     
       //this.render();
       if (this.prop) {

        this.removeInput('ARG0', true);

        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
                       ['first item', 'ITEM1'],
                       ['second item', 'ITEM2']
                     ]),
                     'OPERAND');
        this.appendValueInput('ARG0');
      } else {
        var newStatement = this.argsNumber_ || "0";
        var oldStatement = this.getInput('ARG0') ? "1": "0";
         if (newStatement != oldStatement) {
          console.log("ccc");
          if (newStatement == "0") {
            this.removeInput('ARG0', true);
          } else {
            this.appendValueInput('ARG0')
            .appendField("value:");
            //this.appendDummyInput('DUMMY')
            //.appendField('とする');
          }
        }
  
  
      }

 
    }
  },
  function() {
    this.getField('METHOD').setValidator(function(option) {
      this.sourceBlock_.checkOperand2_( option );

      this.sourceBlock_.updateStatement_();
    });
    this.getField('OUTPUT').setValidator(function(option) {
      console.log("setValidator", option);
      this.sourceBlock_.checkOutput_(option);
      this.sourceBlock_.updateStatement_();
    });
  }
);

Blockly.JavaScript['JCODE_block_method'] = function(block) {
  var obj = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_MEMBER);
  var method = this.getFieldValue('METHOD');
  var args = '(';
  if (!! this.getInput('ARG0')) {
    args += Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
  }
  if (!! this.getInput('ARG1')) {
    args += ',';
    args += Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_MEMBER);
  }
  args += ')';

  if (! this.outputConnection) {
    //var value = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
    if (method === "new JCODE.object3d") {
      method = " = " + method;
    }
    var code = obj + method + args + ';\n';
    console.log(code);
    return code;
  } else {
    var code = obj + method + args;
    console.log(code);
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  }
};

// プロパティ　ブロック
// インストラクションの初期化
Blockly.Blocks['JCODE_block_prop'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {"type": "input_value", "name": "OBJECT"},
      ],
      "message1": "の %1 は",
      "args1": [{
          "type": "field_dropdown",
          "name": "PROP",
          "options": var_list.getOptions("three_prop")
        },
       ],
       "message2": "%1",
       "args2": [{
         "type": "field_dropdown",
         "name": "OPERAND",
         "options": [
          [" =",   "="],
          ["+=",  "+="],
          ["?",   "?"]
        ]},
       ],
        "message3": "%1",
       "args3": [
         {"type": "input_value", "name": 'ARG0'}
       ],
      "inputsInline": true,
      "output": null,
      "colour": 60,
      "mutator": "JCODE_mutator_prop"
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};
Blockly.JavaScript['JCODE_block_prop'] = function(block) {
  var obj = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_MEMBER);
  var prop = this.getFieldValue('PROP');
  var op = this.getFieldValue('OPERAND');
  if (op !== '?') {
    var value = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
    var code = obj + prop + ' ' + op + ' ' + value + ';\n';
    console.log(code);
    return code;
  } else {
    var code = obj + prop;
    console.log(code);
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  }
};



/**
 * Mixin for mutator functions in the 'math_is_divisibleby_mutator'
 * extension.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Extensions.registerMutator('JCODE_mutator_prop',
  {
    checkOperand_: function(op) {

      var ret = {};
      if (op == "?") {
        ret.return_output = true;
        ret.param_num = "0";
      } else {
        ret.return_output = false;
        ret.param_num = "1";
      }
      ret.new_constructor = false;
      return ret;
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      var ret = (this.checkOperand_(this.getFieldValue('OPERAND')));
      container.setAttribute('output', ret.return_output);
      container.setAttribute('value', ret.param_num);
      return container;
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      var ret = {};
      ret.return_output = (xmlElement.getAttribute('output') == 'true');
      ret.param_num = (xmlElement.getAttribute('value'));
      this.updateStatement_(ret);
    },
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    // newStatement == true 値を返す関数
    updateStatement_: function(inp) {
      var newStatement = inp.return_output;
      var oldStatement = !! this.outputConnection;
      if (newStatement != oldStatement) {
        this.unplug(true, true);
        console.log("unplug");
        if (newStatement) {
          this.setPreviousStatement(false);
          this.setNextStatement(false);
          this.setOutput(true);
        } else {
          this.setOutput(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }
      }

      if (false) {
        var newStatement = inp.new_constructor;
        var oldStatement = ! this.getInput('OBJECT');
        if (newStatement != oldStatement) {
          if (newStatement) {
            this.removeInput('OBJECT');
           } else {
            console.log("appppp");
            this.appendValueInput('OBJECT');
            //this.moveInputBefore('OBJECT', "METHOD");
            //this.appendField('obj');
          }
        }
  
      }
      
      var newStatement = inp.param_num || "0";
      var oldStatement = this.getInput('ARG0') ? "1": "0";
       if (newStatement != oldStatement) {
        console.log("ccc");
        if (newStatement == "0") {
          this.removeInput('ARG0', true);
        } else {
          this.appendValueInput('ARG0');
          //this.appendDummyInput('DUMMY')
          //.appendField('とする');
        }
      }
      //this.render();

    }
  },
  function() {
    this.getField('OPERAND').setValidator(function(option) {
      var ret = this.sourceBlock_.checkOperand_(option);
      this.sourceBlock_.updateStatement_(ret);
    });
  }
);

Blockly.Blocks['JCODE_instruction_new'] = {
    init: function() {
      this.jsonInit({
        "message0": "インストラクション %1 です",
        "args0": [
            {"type": "input_value", "name": 'ARG0'}
        ],
        "output": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_new'] = function(block) {
  var args = '(';
  if (!! this.getInput('ARG0')) {
    args += Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
  }
  if (!! this.getInput('ARG1')) {
    args += ',';
    args += Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_MEMBER);
  }
  args += ')';
   var code = 'new JCODE.instruction(' + text + ')';
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};

// インストラクションに文を追加
Blockly.Blocks['JCODE_instruction_html'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 に、インストラクション %2 を追加",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "inst"},
            {"type": "input_value", "name": 'ARG0'}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_html'] = function(block) {
    var obj = this.getFieldValue('VAR');
    var text = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER)
    var code = obj + '.html(' + text + ')';
    return code + ";\n";
};

// インストラクションのボタンに関数を割当
Blockly.Blocks['JCODE_instruction_click'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 がクリックされたら %2 を実行",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "inst"},
            {"type": "input_value", "name": 'ARG0'}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_click'] = function(block) {
    var obj = this.getFieldValue('VAR');
    //var text = this.getFieldValue('FIELDNAME');
   //var text = this.getFieldValue('ARG0');
   var text = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
   text = text.replace(/\(\)/, ""); // += "a"; // TODO: 関数名の後ろの()を取り除く
   //var text = Blockly.JavaScript.getFieldValue(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
    var code = obj + '.click(' + text + ')';
    return code + ";\n";
};

JCODE.instruction = function(html) {
    this.$inst = $('#JCODE-instruction');
    if (html) {
        $('<p>').html(html).appendTo(this.$inst);
    }
    return this;
} 

JCODE.instruction.prototype.add = function(html) {
    console.log(html);
    $('<p>').html(html).appendTo(this.$inst);
    //this.$inst.html(html);  
}


JCODE.instruction.prototype.click = function( f ) {
    $(this.$inst).find("button").click(function(e) {
       f(e);
    }); 
}

// balloon （吹)き出し）ヘルパーの初期化
JCODE.balloon = function() {
    var p = $('<div>').css("position","absolute").css("z-index",1000).prependTo("body");
    var b = $('<div id="ballon-layer">').css("position","relative").prependTo( p );
    this.$balloon = $('<div class="balloon">baloon</div>').css("position","fixed").css("left","100px").css("top","250px").appendTo ( b );
    return this;
};
// 吹き出しの文字を変更
JCODE.balloon.prototype.html = function(html) {
    this.$balloon.html(html);
}

function test() {
    //JCODE.instruction.add("こんにちは、ようこそ<br />ここに注目を見てください。そして<button>ここ</button>をクリックして。");
    var b = new JCODE.balloon();
    b.html("ここに注目");
    var i = new JCODE.instruction();
    i.html("こんにちは、ようこそ<br />ここに注目を見てください。そして<button>ここ</button>をクリックして。");
    i.click(test2);
}
function test2() {
    var i = new JCODE.instruction();
    i.html("わかりましたね！そしたら<button>ここ</button>をクリックして。");
    i.click(test3);
}
function test3() {
    var i = new JCODE.instruction();
    i.html("おわり");
}