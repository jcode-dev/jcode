/*
インストラクションのヘルパー
JCODE.instruction
JCODE.balloon
*/

// インストラクション ブロックの定義
JCODE.jcodeInstractionCallback = function(workspace) {
    var list = [
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
    return xmlList;
};

// インストラクションの初期化
Blockly.Blocks['JCODE_instruction_new'] = {
    init: function() {
      this.jsonInit({
        "message0": "インストラクション %1 です",
        "args0": [
            {"type": "input_value", "name": "VALUE"}
        ],
        "output": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_new'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
    var code = 'new JCODE.instruction(' + text + ')';
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};

JCODE.instruction = function(html) {
    this.$inst = $('<div>').appendTo('#JCODE-instruction');
    if (html) {
        this.$inst.html(html);
    }
    return this;
} 
// インストラクションに文を追加
Blockly.Blocks['JCODE_instruction_html'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 に、インストラクション %2 を追加",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "inst"},
            {"type": "input_value", "name": "VALUE"}
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
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER)
    var code = obj + '.html(' + text + ')';
    return code + ";\n";
};

JCODE.instruction.prototype.html = function(html) {
    this.$inst.html(html);  
}
// インストラクションのボタンに関数を割当
Blockly.Blocks['JCODE_instruction_click'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 がクリックされたら %2 を実行",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "inst"},
            {"type": "input_value", "name": "VALUE"}
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
   //var text = this.getFieldValue('VALUE');
   var text = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
   text = text.replace(/\(\)/, ""); // += "a"; // TODO: 関数名の後ろの()を取り除く
   //var text = Blockly.JavaScript.getFieldValue(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
    var code = obj + '.click(' + text + ')';
    return code + ";\n";
};
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