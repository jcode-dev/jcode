/**
 * Create a namespace for the application.
 */
// JCODE オブジェクトのツールボックス JCODE_OBJECT


JCODE.obj = function(shape){
  this.mesh = {};
  JCODE.objects.push(this);
  this.step = 0;
  this.promise = Promise.resolve();

  if ( shape ) {
      this.loader(shape);
  }
  return this;
};


JCODE.jcodeObjectCallback = function(workspace) {
  // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
  var list = [
    "JCODE_obj_create",
    "JCODE_obj_wait",
    "JCODE_obj_move",
    "JCODE_obj_without_return",
    "JCODE_obj_with_return"
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

/*
 * ブロック
 */
Blockly.Blocks['JCODE_obj_create'] = {
  init: function() {
    this.jsonInit({
      "message0": "新しい %1",
      "args0": [
        {"type": "field_dropdown", "name": "FIELDNAME",
          "options": [
            [ "たま", "sphere" ],
            [ "ぴん", "pin" ],
            [ "はこ", "box" ]
          ]
        }
      ],
      "output": null,
      "colour": 309
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};
Blockly.JavaScript['JCODE_obj_create'] = function(block) {
  var text = this.getFieldValue('FIELDNAME');
  var code = 'new JCODE.obj("' + text + '")';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

JCODE.obj.prototype.loader = function( shape ){
  var shape = shape || 'sphere';

  switch(shape) {
    // create a cube
    case 'box':
      var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
      var mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
       // position the cube
       //mesh.position.x = -4;
       mesh.position.y = 2;
       //mesh.position.z = 10;
      break;
    case 'sphere':
      var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
      mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // position the sphere
      //mesh.position.x = 20;
      mesh.position.y = 4;
      //mesh.position.z = 2;
      break;
    case 'pin':
    default:
      mesh = JCODE.obj.loadJson();
      break;
    }
    mesh.castShadow = true;
    JCODE.scene.add(mesh);
    this.mesh = mesh;
    return this;
}

JCODE.obj.loadJson = function() {
  var jsonobj = 

  {
    "metadata": {
      "version": 4.5,
      "type": "Object",
      "generator": "Object3D.toJSON"
    },
    "geometries": [
      {
        "uuid": "C507E6D4-EA6A-4F57-BDD5-605CFC5785BC",
        "type": "SphereBufferGeometry",
        "radius": 1,
        "widthSegments": 32,
        "heightSegments": 16,
        "phiStart": 0,
        "phiLength": 6.283185,
        "thetaStart": 0,
        "thetaLength": 3.141593
      },
      {
        "uuid": "A61FD6B3-F839-47C7-AD6B-9D5A315A1DE6",
        "type": "CylinderBufferGeometry",
        "radiusTop": 1,
        "radiusBottom": 0,
        "height": 2,
        "radialSegments": 32,
        "heightSegments": 1,
        "openEnded": false
      },
      {
        "uuid": "40EA369E-5851-47C5-AF00-61749FADF2B7",
        "type": "SphereBufferGeometry",
        "radius": 1,
        "widthSegments": 32,
        "heightSegments": 16,
        "phiStart": 0,
        "phiLength": 6.283185,
        "thetaStart": 0,
        "thetaLength": 3.141593
      }],
    "materials": [
      {
        "uuid": "8E73D23A-D636-4E11-B685-DCFB47AD0FD0",
        "type": "MeshLambertMaterial",
        "color": 197379,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false,
        "dithering": false
      },
      {
        "uuid": "88520194-9788-4DAF-B6FD-6BE274E14BA7",
        "type": "MeshLambertMaterial",
        "color": 510190,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false,
        "dithering": false
      },
      {
        "uuid": "94AF5EDB-0D0D-41A4-BF52-757696683E5F",
        "type": "MeshLambertMaterial",
        "color": 16248578,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false,
        "dithering": false
      }],
    "object": {
      "uuid": "3A4436A2-E212-449D-9C06-BBC7D5B03D4A",
      "type": "Group",
      "name": "Group 1",
      "castShadow": true,
      "receiveShadow": true,
      "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1],
      "children": [
        {
          "uuid": "9D4AAD1F-7487-4E1B-BF36-C4087042B418",
          "type": "Mesh",
          "name": "Sphere 1",
          "matrix": [0.2,0,0,0,0,0.2,0,0,0,0,0.2,0,0.744314,6.425803,1.095651,1],
          "geometry": "C507E6D4-EA6A-4F57-BDD5-605CFC5785BC",
          "material": "8E73D23A-D636-4E11-B685-DCFB47AD0FD0"
        },
        {
          "uuid": "BF15D2A5-E1AD-40A4-B80D-E03496BDA7C3",
          "type": "Mesh",
          "name": "Cylinder 2",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [2,0,0,0,0,3,0,0,0,0,2,0,0,2,0,1],
          "geometry": "A61FD6B3-F839-47C7-AD6B-9D5A315A1DE6",
          "material": "88520194-9788-4DAF-B6FD-6BE274E14BA7"
        },
        {
          "uuid": "51169206-4CA1-4966-B061-88BD8DB4D2BD",
          "type": "Mesh",
          "name": "Sphere 3",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1.5,0,0,0,0,1.5,0,0,0,0,1.5,0,0,6.260093,0,1],
          "geometry": "40EA369E-5851-47C5-AF00-61749FADF2B7",
          "material": "94AF5EDB-0D0D-41A4-BF52-757696683E5F"
        },
        {
          "uuid": "E988CC3D-B772-4E49-B8F4-87D972C47B12",
          "type": "Mesh",
          "name": "Sphere 1",
          "matrix": [0.2,0,0,0,0,0.2,0,0,0,0,0.2,0,-0.431375,6.431071,1.250825,1],
          "geometry": "C507E6D4-EA6A-4F57-BDD5-605CFC5785BC",
          "material": "8E73D23A-D636-4E11-B685-DCFB47AD0FD0"
        }]
    }
  }

  var loader = new THREE.ObjectLoader();
  return loader.parse(jsonobj);
}

/*
 *  JCODE.obj.wait(sec)  オブジェクトの操作を sec 秒待つ
 */
JCODE.obj.prototype.wait = function (sec) {
  console.log("wait");
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          console.log("timeout", sec);
          resolve();
        }, sec*1000);
      })
    }
  );
}
// ブロック
Blockly.Blocks['JCODE_obj_wait'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 秒間",
      "args0": [
        {"type": "field_dropdown", "name": "FIELDNAME",
          "options": [
            [ "まつ", "wait" ]
          ]
        },
        {"type": "input_value", "name": "VALUE"}
      ],
      "output": null,
      "colour": 60
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};
Blockly.JavaScript['JCODE_obj_wait'] = function(block) {
  var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
  var operator = this.getFieldValue('FIELDNAME');
  var code = '.' + operator + '(' + text + ')';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

// new blocks ブロックたち .operator(x)
Blockly.Blocks['JCODE_obj_move'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 が %3 センチ %2 に うごく ",
      "args0": [
        {"type": "field_variable", "name": "VAR", "variable": "obj"},
        {"type": "field_dropdown", "name": "FIELDNAME",
          "options": [
            [ "まえ", "moveForward" ],
            [ "うしろ", "moveBack" ],
            [ "うえ", "moveUp" ],
            [ "した", "moveDown" ],
            [ "ひだり", "moveLeft" ],
            [ "みぎ", "moveRight" ]
          ]
        },
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
Blockly.JavaScript['JCODE_obj_move'] = function(block) {
  var obj = this.getFieldValue('VAR');
  var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
  var operator = this.getFieldValue('FIELDNAME');
  var code = obj + '.' + operator + '(' + text + ')';
  return code + ";\n";
};

JCODE.obj.prototype.moveForward = function (d) {
  var mesh = this.mesh;
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          //mesh.position.z += d;
          resolve();
        },1500);
        var coords = { z: mesh.position.z };
        var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ z: mesh.position.z + d }, 1200) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            mesh.position.z = coords.z;
        })
        .start(); // Start the tween immediately.
      })
    }
  );
}
JCODE.obj.prototype.moveBack = function (d) {
  var mesh = this.mesh;
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          mesh.position.z -= d;
          resolve();
        },1500);
      })
    }
  );
}
JCODE.obj.prototype.moveLeft = function (d) {
  var mesh = this.mesh;
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          mesh.position.x -= d;
          resolve();
        },1500);
      })
    }
  );
}
JCODE.obj.prototype.moveRight = function (d) {
  var mesh = this.mesh;
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          mesh.position.x += d;
          resolve();
        },1500);
      })
    }
  );
}





JCODE.obj.prototype.update = function () {
  this.step += 0.025;
  this.mesh.rotation.y = (Math.cos(this.step)) /2;//- Math.PI / 4;
  return;
}
JCODE.obj.prototype.update2 = function () {
  // rotate the cube around its axes
  this.mesh.rotation.x += 0.002;
  this.mesh.rotation.y += 0.002;
  this.mesh.rotation.z += 0.002;
  return;
}
JCODE.obj.prototype.update1 = function () {
  // bounce the sphere up and down
  this.step += 0.04;
  this.mesh.position.x = 20 + ( 10 * (Math.cos(this.step)));
  this.mesh.position.y = 2 + ( 10 * Math.abs(Math.sin(this.step)));
  return;
}



  
/*
 *  オブジェクトの値を返さない JCODE.obj.withoutReturn();
 */
  
Blockly.Blocks['JCODE_obj_without_return'] = {
  init: function() {
    this.jsonInit({
      "message0": "オブジェクト %1 は %2",
      "args0": [
        {"type": "field_variable", "name": "VAR", "variable": "obj"},
        {"type": "input_value", "name": "VALUE"}
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 60
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return 'へんすう "%1"　にオブジェクトをわりあて.'.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};
Blockly.JavaScript['JCODE_obj_without_return'] = function(block) {
  var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
  Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
  var operator = this.getFieldValue('VAR');
  var subString = "substr";
  var code = "var " + operator + " = " + text;
  return code + ';\n';
};

/*
 *  オブジェクトの値を返す JCODE.obj.withReturn();
 */
  Blockly.Blocks['JCODE_obj_with_return'] = {
    init: function() {
      this.jsonInit({
        "message0": "オブジェクト %1　%2",
        "args0": [
          {"type": "field_variable", "name": "VAR", "variable": "obj"},
          {"type": "input_value", "name": "VALUE"}
        ],
        "output": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
      this.setTooltip(function() {
        return 'へんすう "%1"　にオブジェクトをわりあて.'.replace('%1',
            thisBlock.getFieldValue('VAR'));
      });
    }
  };
  Blockly.JavaScript['JCODE_obj_with_return'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    var operator = this.getFieldValue('VAR');
    var subString = "substr";
    var code = operator + text;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  };
  
  
// new blocks ブロックたち .operator(x)
   
Blockly.Blocks['object_do3'] = {
    init: function() {
        this.jsonInit({
        "message0": "object_do %1 が %2　%3 %4 ピクセル",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "object"},
            {"type": "field_dropdown", "name": "FIELDNAME2",
            "options": [
                [ "aaよこに", "amoveZ" ],
                [ "b前後に", "bmoveX" ],
                [ "cまえに", "cmoveFoward" ],
                [ "dうしろに", "dmoveBack" ]
            ]
            },
            {"type": "field_dropdown", "name": "FIELDNAME",
            "options": [
            [ "よこに", "moveZ" ],
            [ "前後に", "moveX" ],
            [ "まえに", "moveFoward" ],
            [ "まつ", "wait" ]
            ]
        },
        {"type": "input_value", "name": "VALUE"}
        ],
        "output": null,
        "colour": 60
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
    }
};
Blockly.JavaScript['object_do3'] = function(block) {
var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
var operator = this.getFieldValue('FIELDNAME');
var operator2 = this.getFieldValue('FIELDNAME2');
var v = this.getFieldValue('VAR');
var code = v + '.' + operator + '.' + operator2 + '(' + text + ')';
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};
