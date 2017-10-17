/*
インストラクションのヘルパー
JCODE.instruction
JCODE.balloon
*/

// インストラクション ブロックの定義
JCODE.jcodeInstractionCallback = function(workspace) {
  var list = [
    "THREE_constr_blocks",
    "THREE_method_blocks",
    "THREE_accessor_blocks",
    "THREE_prop_blocks",
    "JS_method_blocks",
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

(function (){

  function setupConstrBlocks(
    dropDownList,
    blockName,
    mutatorName ,
    color ) 
    {
    var dropDownList = dropDownList;


  Blockly.Blocks[blockName] = {
    init: function() {
      this.jsonInit({
        "message0": "%1",
        "args0": [{
            "type": "field_dropdown",
            "name": "CODE",
            "options": getOptions(dropDownList)
         }],
         "message1": "%1",
         "args1": [
           {"type": "input_value", "name": 'ARG0'}
         ],
        "inputsInline": true,
        "output": "OBJECT",
        "colour": color,
        "mutator": mutatorName
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
  }
  
  Blockly.JavaScript[blockName] = function(block) {
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
  Blockly.Extensions.registerMutator(mutatorName,
    {
      arg0: true,
      arg1: false,
      checkMethod_: function(method) {
        return ;
      },
      /**
       * Create XML to represent whether the 'divisorInput' should be present.
       * @return {Element} XML storage element.
       * @this Blockly.Block
       */
      mutationToDom: function() {
        var container = document.createElement('mutation');
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
        this.arg0 = (xmlElement.getAttribute('arg0') == 'true');
        this.arg1 = (xmlElement.getAttribute('arg1') == 'true');
        this.updateStatement_();
      },
       updateStatement_: function() {
        
        var newStatement = this.arg0;
        var oldStatement = !! this.getInput('ARG0');
         if (newStatement != oldStatement) {
          if (! newStatement) {
            this.removeInput('ARG0', true);
           } else {
            this.appendValueInput('ARG0');
          }
        }
        var newStatement = this.arg1;
        var oldStatement = !! this.getInput('ARG1');
         if (newStatement != oldStatement) {
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
      this.getField('CODE').setValidator(function(option) {
        this.sourceBlock_.checkMethod_(option);
        this.sourceBlock_.updateStatement_();
      });
    });
  }


  function setupMethodBlocks(
    dropDownList,
    blockName,
    mutatorName ,
    color ) 
    {
    var dropDownList = dropDownList;

    // プロパティ　ブロック
    // インストラクションの初期化
    Blockly.Blocks[blockName] = {
    
      init: function() {
    
        this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'),'OUTPUT');
        this.appendValueInput('OBJECT');
        this.appendDummyInput().appendField('', 'LABEL1');
        this.appendDummyInput().appendField(new Blockly.FieldDropdown(getOptions(dropDownList)), 'CODE');
        this.appendDummyInput().appendField('', 'LABEL2');
        this.appendValueInput('ARG0');
        this.appendDummyInput().appendField('', 'LABEL3');
          
        this.jsonInit({
          "inputsInline": true,
          "nextStatement": null,
          "previousStatement": null,
          "colour": color,
          "mutator": mutatorName
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
      }
    };
    
    Blockly.JavaScript[blockName] = function(block) {
      var obj = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_MEMBER);
      var method = this.getFieldValue('CODE');
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
        var code = obj + method + args + ';\n';
        return code;
      } else {
        var code = obj + method + args;
        return [code, Blockly.JavaScript.ORDER_MEMBER];
      }
    };

    Blockly.Extensions.registerMutator(mutatorName, {
      output_: false,
      argsNumber_: 1,
      method: "error",
      
      checkCode_: function(method) {
        this.method = method;
        this.updateStatement_();
      },
      checkOutput_: function(op) {
        if (op) {
          this.output_ = true;
        } else {
          this.output_ = false;
        }
        this.updateStatement_();
      },
      /**
       * Create XML to represent whether the 'divisorInput' should be present.
       * @return {Element} XML storage element.
       * @this Blockly.Block
       */
      mutationToDom: function() {
        var container = document.createElement('mutation');

        if (this.output_) {
          container.setAttribute('output', this.output_);
        }
        if (this.argsNumber_) {
          container.setAttribute('args', this.argsNumber_);
        }
        //if (this.method) {
        //  container.setAttribute('method', this.method);
        //}
        this.checkCode_(this.getFieldValue('CODE'));
        this.checkOutput_(this.getFieldValue('OUTPUT')=="TRUE");

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
        //var a = xmlElement.getAttribute('method');
        //if (a) {
        //  this.method = a;
        //}
        var a = (xmlElement.getAttribute('args'));
        if (a) {
          this.argsNumber_ = a;
        }
        //console.log("domToMutation:",this.output_);
        
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

        //var method = this.method;
        var method = this.method;
        var label = getLabels(dropDownList, method);

       // console.log("method:",method);

        this.getField('LABEL1').setText(label[1]);
        this.getField('LABEL3').setText(label[3]);
        
        var newStatement = this.output_;
        var oldStatement = !! this.outputConnection;
        if (newStatement != oldStatement) {
          this.unplug(true, true);
          //console.log("unplug");
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
    
        //this.render();
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
    },
    function() {
      this.getField('CODE').setValidator(function(option) {
        this.sourceBlock_.checkCode_(option);
        this.sourceBlock_.updateStatement_();
      });
      this.getField('OUTPUT').setValidator(function(option) {
        this.sourceBlock_.checkOutput_(option);
        this.sourceBlock_.updateStatement_();
      });
    });
  }


  ////////////////////////////////////////////
  // METHOD
  function setupMethod2Blocks(config) {
    var config = config;

    // プロパティ　ブロック
    // インストラクションの初期化
    Blockly.Blocks[config.blockname] = {
    
      init: function() {
    
        this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'),'OUTPUT');

        if (config.objects) {
          this.appendValueInput('OBJECT');
        }
        this.appendDummyInput().appendField('', 'LABEL1');
        this.appendDummyInput().appendField(new Blockly.FieldDropdown(getOptions(config.list)), 'CODE');
        this.appendDummyInput().appendField('', 'LABEL2');
        this.appendValueInput('ARG0');
        this.appendDummyInput().appendField('', 'LABEL3');
          
        this.jsonInit({
          "inputsInline": true,
          "nextStatement": null,
          "previousStatement": null,
          "colour": config.color,
          "mutator": config.mutatorname
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
      }
    };
    
    Blockly.JavaScript[config.blockname] = function(block) {
      var obj = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_MEMBER);
      var method = this.getFieldValue('CODE');
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
        var code = obj + method + args + ';\n';
        return code;
      } else {
        var code = obj + method + args;
        return [code, Blockly.JavaScript.ORDER_MEMBER];
      }
    };

    Blockly.Extensions.registerMutator(config.mutatorname, {
      output_: false,
      argsNumber_: 1,
      method: "error",
      
      checkCode_: function(method) {
        this.method = method;
        this.updateStatement_();
      },
      checkOutput_: function(op) {
        if (op) {
          this.output_ = true;
        } else {
          this.output_ = false;
        }
        this.updateStatement_();
      },
      /**
       * Create XML to represent whether the 'divisorInput' should be present.
       * @return {Element} XML storage element.
       * @this Blockly.Block
       */
      mutationToDom: function() {
        var container = document.createElement('mutation');

        if (this.output_) {
          container.setAttribute('output', this.output_);
        }
        if (this.argsNumber_) {
          container.setAttribute('args', this.argsNumber_);
        }
        //if (this.method) {
        //  container.setAttribute('method', this.method);
        //}
        this.checkCode_(this.getFieldValue('CODE'));
        this.checkOutput_(this.getFieldValue('OUTPUT')=="TRUE");

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
        //var a = xmlElement.getAttribute('method');
        //if (a) {
        //  this.method = a;
        //}
        var a = (xmlElement.getAttribute('args'));
        if (a) {
          this.argsNumber_ = a;
        }
        //console.log("domToMutation:",this.output_);
        
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

        //var method = this.method;
        var method = this.method;
        var label = getLabels(config.list, method);

       // console.log("method:",method);

        this.getField('LABEL1').setText(label[1]);
        this.getField('LABEL3').setText(label[3]);
        
        var newStatement = this.output_;
        var oldStatement = !! this.outputConnection;
        if (newStatement != oldStatement) {
          this.unplug(true, true);
          //console.log("unplug");
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
    
        //this.render();
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
    },
    function() {
      this.getField('CODE').setValidator(function(option) {
        this.sourceBlock_.checkCode_(option);
        this.sourceBlock_.updateStatement_();
      });
      this.getField('OUTPUT').setValidator(function(option) {
        this.sourceBlock_.checkOutput_(option);
        this.sourceBlock_.updateStatement_();
      });
    });
  }
  ////////////////////////////////////////////
  // PROP
  function setupPropBlocks(
    dropDownList,
    blockName,
    mutatorName ,
    color ) 
    {
    var dropDownList = dropDownList;

// プロパティ　ブロック
// インストラクションの初期化
Blockly.Blocks[blockName] = {
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
          "options": getOptions(dropDownList)
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
      "mutator": mutatorName
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};
Blockly.JavaScript[blockName] = function(block) {
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
Blockly.Extensions.registerMutator(mutatorName,
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
        //console.log("unplug");
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
  });
}

  function getOptions(list){
    var a = [];
    for (var prop in list) {
      a.push([list[prop][0], prop]);
    }
    return a;
  }

  function getLabels(list, method){
    var r = [];
    if (list[method]) {
      r = list[method][1].split('%');
    }
    return r;
  }

  var THREE_BLOCKS_COLOR = 60;
  var JS_BLOCKS_COLOR = 20;

  setupConstrBlocks({
    
    "new JCODE.object3d": ["新しく作る", "%%%"]
    
  },'THREE_constr_blocks','THREE_constr_mutator',THREE_BLOCKS_COLOR);
    
  setupMethodBlocks({

    ".moveForward": ["が 前にうごく", "%%%センチ"],
    ".turnRight":   ["が 右を向く", "%%%度"],
    ".lookUpward":  ["が 上を向く", "%%%度"]

  },'THREE_method_blocks','THREE_method_mutator',THREE_BLOCKS_COLOR);

  setupMethod2Blocks({
    objects: 0, args: 1, color:THREE_BLOCKS_COLOR,
    blockname:'THREE_accessor_blocks', mutatorname:'THREE_accessor_mutator',
    list: {
      ".setColor":    ["の 色 は", "%% %"],
      ".setScale":    ["の 大きさ は", "%% %倍"],
      ".setSpeed":    ["の 速さ は", "%% %倍"],
      ".setTransparent": ["の とうめいど は", "%% %％"],
      }
  });

  setupPropBlocks({

    ".position.x": ["X座標", "%の% %"],
    ".position.y": ["Y座標", "%の% %"],
    ".position.z": ["Z座標", "%の% %"]

  },'THREE_prop_blocks','THREE_prop_mutator',THREE_BLOCKS_COLOR);

  setupMethod2Blocks({
    objects: 0, args: 1, color:JS_BLOCKS_COLOR,
    blockname:'JS_method_blocks', mutatorname:'JS_method_mutator',
    list: {
      "console.log": ["コンソールログ", "%%%"],
      "document.getElementById": ["ID要素をさがす", "%%%"]
    }
  });
})();

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