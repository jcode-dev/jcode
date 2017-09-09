/**
 * Create a namespace for the application.
 */
var JCODE = {};

JCODE.init = function() {

  var width = 400; //window.innerWidth;
  var height = 300; //window.innerHeight;

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  JCODE.scene = scene; // save global
  JCODE.DomElement = document.getElementById("WebGL-output");

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  var onresize = function(e) {
    // container の調整
    height = $('#top-component').height() - 38;
    width = height / 300 * 400;
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', onresize, false);


  // show axes in the screen
  //var axes = new THREE.AxisHelper(20);
  //scene.add(axes);

  // 方眼紙を書く
  var gridHelper = new THREE.GridHelper(100, 20,0x3cb371,0x5f9ea0);
  scene.add(gridHelper);
  // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -0.1;
    plane.position.z = 0;
    // add the plane to the scene
    scene.add(plane);

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    // add the cube to the scene
    scene.add(cube);

  // position and point the camera to the center of the scene
  camera.position.x = -30;
  camera.position.y = 10;//40;
  camera.position.z = 0;//30;
  camera.lookAt(scene.position);
  var controls = new THREE.OrbitControls( camera, JCODE.DomElement );

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);
  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -25);
  spotLight.castShadow = true;
  scene.add(spotLight);
  // add the output of the renderer to the html element
  JCODE.DomElement.appendChild(renderer.domElement);
  // call the render function
  var step = 0;
  renderScene();
  //var clock = new TREE.Clock();

  function renderScene() {
    // bounce the sphere up and down
    /*
    step += 0.04;
    sphere.position.x = 20 + ( 10 * (Math.cos(step)));
    sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
    */
    //var delta = clock.getDelta();
    controls.update();

    for (var i=0; i < JCODE.objects.length; i++) {
      JCODE.objects[i].update();
    }

    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
  function initStats() {
      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms
      // Align top-left
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.getElementById("Stats-output").appendChild(stats.domElement);
      return stats;
  }
}


/**
 * Construct the blocks required by the flyout for the colours category.
 * @param {!Blockly.Workspace} workspace The workspace this flyout is for.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
JCODE.coloursFlyoutCallback = function(workspace) {
  // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
  var colourList = ["a","b"];
  var xmlList = [];
  if (Blockly.Blocks['colour_picker']) {
    for (var i = 0; i < colourList.length; i++) {
      var blockText = '<xml>' +
          '<block type="colour_picker">' +
          '<field name="COLOUR">' + colourList[i] + '</field>' +
          '</block>' +
          '</xml>';
      var block = Blockly.Xml.textToDom(blockText).firstChild;
      xmlList.push(block);
    }
  }
  return xmlList;
};
// JCODE オブジェクトのツールボックス JCODE_OBJECT
JCODE.jcodeObjectCallback = function(workspace) {
  // Returns an array of hex colours, e.g. ['#4286f4', '#ef0447']
  var list = [
    "jcode_code",
    "JCODE_create_object",
    "object_getval",
    "object_operate",
    "object_do"];
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

JCODE.objects = [];
JCODE.object = function(mesh){
  this.mesh = mesh;
  this.step = 0;
  this.promise = Promise.resolve();
};
JCODE.object.prototype.update = function () {
  // rotate the cube around its axes
  this.mesh.rotation.x += 0.002;
  this.mesh.rotation.y += 0.002;
  this.mesh.rotation.z += 0.002;
  return;
}
JCODE.object.prototype.update1 = function () {
  // bounce the sphere up and down
  this.step += 0.04;
  this.mesh.position.x = 20 + ( 10 * (Math.cos(this.step)));
  this.mesh.position.y = 2 + ( 10 * Math.abs(Math.sin(this.step)));
  return;
}

JCODE.object.prototype.moveX = function (d) {
  console.log("movex");
  var mesh = this.mesh;
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          console.log("mesh", mesh.position.x, d);
          mesh.position.x += d;
          resolve();
        },1500);
      })
    }
  );
}

JCODE.object.prototype.wait = function (s) {
  console.log("wait");
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          console.log("timeout", s);
          resolve();
        }, s*1000);
      })
    }
  );
}

JCODE.object.prototype.moveZ = function (d) {
  console.log("movez");
  var mesh = this.mesh;
  this.promise = this.promise.then(
    function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          console.log("mesh z", mesh.position.z, d);
          mesh.position.z += d;
          resolve();
        },1500);
      })
    }
  );
}

JCODE.createObject = function( shape ){
  var shape = shape || 'sphere';
  var obj = {};
  switch(shape) {
    // create a cube
    case 'box':
      var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
      var obj = new THREE.Mesh(cubeGeometry, cubeMaterial);
       // position the cube
      obj.position.x = -4;
      obj.position.y = 2;
      obj.position.z = 10;
      break;
    case 'sphere':
    default:
      var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
      obj = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // position the sphere
      obj.position.x = 20;
      obj.position.y = 4;
      obj.position.z = 2;
      break;
  }
  obj.castShadow = true;
  JCODE.scene.add(obj);
  var jcode = new JCODE.object(obj);
  JCODE.objects.push(jcode);
  return jcode;
}

/*
 * ブロック
 */
// new blocks ブロックたち  new object(); オブジェクトの生成
Blockly.Blocks['JCODE_create_object'] = {
  init: function() {
    this.jsonInit({
      "message0": "新しいオブジェクト %1",
      "args0": [
        {"type": "field_dropdown", "name": "FIELDNAME",
          "options": [
            [ "たま", "sphere" ],
            [ "はこ", "box" ]
          ]
        }
      ],
      "output": null,
      "colour": 60
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};
Blockly.JavaScript['JCODE_create_object'] = function(block) {
  var text = this.getFieldValue('FIELDNAME');
  var code = 'JCODE.createObject("' + text + '")';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};
  
  // new blocks ブロックたち object...　オブジェクト操作の開始
  var objectOperate = {
    "message0": "オブジェクト %1　%2",
    "args0": [
      {"type": "field_variable", "name": "VAR", "variable": "object"},
      {"type": "input_value", "name": "VALUE"}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 60
  };
  
  Blockly.Blocks['object_operate'] = {
    init: function() {
      this.jsonInit(objectOperate);
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
      this.setTooltip(function() {
        return 'へんすう "%1"　にオブジェクトをわりあて.'.replace('%1',
            thisBlock.getFieldValue('VAR'));
      });
    }
  };
  Blockly.JavaScript['object_operate'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    var operator = this.getFieldValue('VAR');
    var subString = "substr";
    var code = operator + text;
    return code + ';\n';
  };
  
  // new blocks ブロックたち object...　オブジェクト値を得る
  var objectGetval = {
    "message0": "オブジェクト %1　%2",
    "args0": [
      {"type": "field_variable", "name": "VAR", "variable": "object"},
      {"type": "input_value", "name": "VALUE"}
    ],
    "output": null,
    "colour": 60
  };
  
  Blockly.Blocks['object_getval'] = {
    init: function() {
      this.jsonInit(objectGetval);
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
      this.setTooltip(function() {
        return 'へんすう "%1"　にオブジェクトをわりあて.'.replace('%1',
            thisBlock.getFieldValue('VAR'));
      });
    }
  };
  Blockly.JavaScript['object_getval'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
    Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    var operator = this.getFieldValue('VAR');
    var subString = "substr";
    var code = operator + text;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  };
  
  // new blocks ブロックたち .operator(x)
   Blockly.Blocks['object_do'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 うごく　%2 ピクセル",
        "args0": [
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
  Blockly.JavaScript['object_do'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
    var operator = this.getFieldValue('FIELDNAME');
    var code = '.' + operator + '(' + text + ')';
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

Blockly.Blocks['jcode_code'] = {
  init: function() {
      this.jsonInit({
        "message0": "no spell check: %1",
        "args0": [
          {
            "type": "field_input",
            "name": "FIELDNAME",
            "text": "default text",
            "spellcheck": false
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
          "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
  }
};
Blockly.JavaScript['jcode_code'] = function(block) {
var code = this.getFieldValue('FIELDNAME') + ";\n";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

