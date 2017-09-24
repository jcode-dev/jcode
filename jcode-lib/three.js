/**
 * THREE blockly
 */
JCODE.three = {};

JCODE.three.blocks = {
  angle: {
    msg: "", 
    angle: 90 ,
    colour: 191
  },
  typeName: {
    msg: "", 
    colour: 191,
    dropdown:[
      [ "たま", "sphere" ],
      [ "ぴん", "pin" ],
      [ "はこ", "box" ]
    ] ,
    code: function(operator, text) {
      return "var " + operator + " = new JCODE.object3d(" + text + ");\n";
    }
  },
  createNew: {
    msg: "3Dオブジェクト %1 は %2", 
    msg2: "var %1 = new JCODE.object3d( %2 );", 
    code: function(operator, text) {
      return "var " + operator + " = new JCODE.object3d(" + text + ");\n";
    }
  },
  moveForward: {
    msg: "%1 が %2 センチ 前にうごく ",
    msg2: "%1.moveForward( %2 );",
    code: function(operator, text) {
      return operator + ".moveForward(" + text + ");\n";
    }
  },
  turnRight: {
    msg: "%1 が %2 度 右にまがる ",
    code: function(operator, text) {
      return operator + ".turnRight(" + text + ");\n";
    }
  },
  lookUpward: {
    msg: "%1 が %2 度 上を向く ",
    code: function(operator, text) {
      return operator + ".lookUpward(" + text + ");\n";
    }
  },
  AxisHelper: {
    msg: " %1 は軸ヘルパーで長さは %2", 
    code: function(operator, text) {
      return "var " + operator + " = new THREE.AxisHelper(" + text + ");\n";
    }
  },
  scene_add: {
    msg: "シーンに %1 を追加",
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
    if (obj[p].dropdown) {
      JCODE.createDropdown(obj, prefix, p, 76);
    } else if (obj[p].angle) {
        JCODE.createAngle(obj, prefix, p, 76);
     } else {
      JCODE.createBlock(obj, prefix, p, 76);
    }
  }              
})();



JCODE.object3d = function(shape){
  this.outer = {};
  //JCODE.object3dects.push(this);
  //this.step = 0;
  this.promise = Promise.resolve();

  if ( shape ) {
      this.loader(shape);
  }
  return this;
};

JCODE.object3d.prototype.loader = function( shape ){
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
      var sphereGeometry = new THREE.SphereGeometry(2, 20, 20);
      var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
      mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // position the sphere
      //mesh.position.x = 20;
      mesh.position.y = 2;
      //mesh.position.z = 2;
      break;
    case 'pin':
    default:
      mesh = JCODE.object3d.loadJson();
      break;
    }
    mesh.castShadow = true;

    var dir = new THREE.Vector3( 0, 0, 5 );
    var origin = new THREE.Vector3( 0, 4, 4 );
    var length = 5;
    var hex = 0xffff00;
    var arrow = new THREE.ArrowHelper( dir, origin, length, hex, 2, 1 );
    arrow.visible=false;    
    var axis = new THREE.AxisHelper(20);
    axis.visible=false;
    var inner = new THREE.Group();
    inner.add(mesh);
    inner.add(axis);
    inner.add(arrow);
    var outer = new THREE.Group();
    outer.add(inner);

    JCODE.scene.add(outer);
    outer.userData = {};
    outer.userData.inner =inner;
    outer.userData.axis = axis;
    outer.userData.arrow = arrow;
    this.outer = outer;
    return this;
}

JCODE.object3d.loadJson = function() {
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
 *  JCODE.object3d.wait(sec)  オブジェクトの操作を sec 秒待つ
 */
JCODE.object3d.prototype.wait = function (sec) {
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

JCODE.object3d.prototype.moveForward = function (d) {
  var mesh = this.outer;
  this.promise = this.promise.then(
    function () {
      mesh.userData.arrow.visible = true;  
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          mesh.userData.arrow.visible = false;  
          resolve();
        },1500);
        var coords = mesh.position.clone();
        var direction = mesh.position.clone();
        var forward = new THREE.Vector4(0, 0, 1, 0);
        forward.applyMatrix4(mesh.matrix).normalize();
        direction.addVectors( coords, forward.multiplyScalar( d ) );

        var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to( direction , 1200) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            mesh.position.x = coords.x;
            mesh.position.y = coords.y;
            mesh.position.z = coords.z;
          })
        .start(); // Start the tween immediately.
      })
    }
  );
}

JCODE.object3d.prototype.turnRight = function (d) {
  var outer = this.outer;
  this.promise = this.promise.then(
    function () {
      outer.userData.arrow.visible = true;  
      //outer.userData.axis.visible = true;  
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          outer.userData.arrow.visible = false;  
          //outer.userData.axis.visible = false;  
          resolve();
        },1400);

        //全体を右に曲げる
        var coords2 = outer.quaternion.clone();
        var axis = new THREE.Vector4(0, 1, 0, 0);
        axis.applyMatrix4(outer.matrix).normalize();
        var direction = new THREE.Quaternion();
        direction.setFromAxisAngle(axis, Math.PI * -d / 180).multiply(coords2);
        outer.quaternion.copy(direction);
        //中を左にまげて元に戻すアニメーション
        var start = outer.userData.inner.rotation.clone();
        var goal = outer.userData.inner.rotation.clone();
        start.y = goal.y + (Math.PI * d / 180);
        var tween = new TWEEN.Tween(start) // Create a new tween that modifies 'coords'.
        .to( goal , 1200) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            outer.userData.inner.rotation.y = start.y;
          })
        .start(); // Start the tween immediately.
      })
    }
  );
}
JCODE.object3d.prototype.lookUpward = function (d) {
  var outer = this.outer;
  this.promise = this.promise.then(
    function () {
      outer.userData.arrow.visible = true;  
      outer.userData.axis.visible = true;  
      return new Promise(function (resolve, reject) {
        setTimeout(function(){
          outer.userData.arrow.visible = false;  
          outer.userData.axis.visible = false;  
          resolve();
        },1400);

        //mesh.useQuaternion = true;
        var coords = outer.quaternion.clone();
        //var direction = mesh.rotation.clone();
        var axis = new THREE.Vector4(1, 0, 0, 0);
        axis.applyMatrix4(outer.matrix).normalize();
        var direction = new THREE.Quaternion();
        direction.setFromAxisAngle(axis, Math.PI * -d / 180).multiply(coords);
        var tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to( direction , 1200) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            outer.quaternion.copy(coords);
          })
        .start(); // Start the tween immediately.
      })
    }
  );
}

JCODE.object3d.prototype.update = function () {
  this.step += 0.025;
  this.outer.rotation.y = (Math.cos(this.step)) /2;//- Math.PI / 4;
  return;
}
JCODE.object3d.prototype.update2 = function () {
  // rotate the cube around its axes
  this.outer.rotation.x += 0.002;
  this.outer.rotation.y += 0.002;
  this.outer.rotation.z += 0.002;
  return;
}
JCODE.object3d.prototype.update1 = function () {
  // bounce the sphere up and down
  this.step += 0.04;
  this.outer.position.x = 20 + ( 10 * (Math.cos(this.step)));
  this.outer.position.y = 2 + ( 10 * Math.abs(Math.sin(this.step)));
  return;
}


