/**
 * Create a namespace for the application.
 */
var JCODE = {};

JCODE.init = function() {

  JCODE.objects = [];
  
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

  // 方眼紙を書く
  if (false) {
    var gridHelper = new THREE.GridHelper(100, 20,0x3cb371,0x5f9ea0);
    gridHelper.rotation.x = -0.5 * Math.PI;
    gridHelper.rotation.y = 0; //-0.5 * Math.PI;
    gridHelper.position.x = 0;
    gridHelper.position.z = -0.1;
    scene.add(gridHelper);
  }
if (true){
  // 地面
  var floor = new THREE.Group();
  var planeGeometry = new THREE.PlaneGeometry(10, 10);
  var planeMaterial1 = new THREE.MeshPhongMaterial({color: 0xFFFFFF, opacity:0.8, transparent:true});
  var plane1 = new THREE.Mesh(planeGeometry, planeMaterial1);
  plane1.receiveShadow = true;
  // rotate and position the plane
  plane1.rotation.x = -0.5 * Math.PI;
  plane1.position.x = 0;
  plane1.position.y = 0;
  plane1.position.z = 0;
  var planeMaterial2 = new THREE.MeshPhongMaterial({color: 0x303030, opacity:0.8, transparent:true});
  var plane2 = new THREE.Mesh(planeGeometry, planeMaterial2);
  plane2.receiveShadow = true;
  // rotate and position the plane
  plane2.rotation.x = -0.5 * Math.PI;
  plane2.position.x = 10;
  plane2.position.y = 0;
  plane2.position.z = 0;
  for (var x=0; x<10; x++) {
    for (var z=0; z<10; z++) {
      var p = (( x + z) % 2) ? plane1.clone() : plane2.clone();
      p.position.z = z * 10 - 50;
      p.position.x = x * 10 - 50;
      floor.add(p);
    }
  }
  scene.add(floor);
}
if (false){
  // 後ろの壁
    var planeGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xFFFF00, opacity:0.1, transparent:true});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // rotate and position the plane
    plane.position.y = 50; //-0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.z = 0;
    plane.rotation.x = 0.5 * Math.PI;
    //plane.position.z = -0.1;
    // add the plane to the scene
    scene.add(plane);
}
// カメラ
  // position and point the camera to the center of the scene
  camera.position.x = 15;
  camera.position.y = 25;
  camera.position.z = 45;
  camera.lookAt(scene.position);
// マウスのコントロール
  var controls = new THREE.OrbitControls( camera, JCODE.DomElement );

// ライト

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(15, 45, 30);
    spotLight.castShadow = true;
    scene.add(spotLight);
  
  if (true) {
    var hemisphereLight = new THREE.HemisphereLight( 0x00003f, 0x00ff00, 0.3);
    hemisphereLight.position.set( 0, 500, 0);
    scene.add( hemisphereLight );
  }else{
  // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

  }
	//スカイドームの利用
	if (true) {
    var skydome = {
			enabled : true,         //スカイドーム利用の有無
			radius  : 100,           //スカイドームの半径
			topColor : 0x2E52FF,     //ドーム天頂色
			bottomColor : 0xFFFFFF,  //ドーム底面色
			exp : 0.8,               //混合指数
			offset : 20               //高さ基準点
    };
    		var vertexShader = "//バーテックスシェーダー\n" +
		"//頂点シェーダーからフラグメントシェーダーへの転送する変数\n" +
		"varying vec3 vWorldPosition;\n" +
		"void main( ) {\n" +
		"	//ワールド座標系における頂点座標\n" +
		"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n" +
		"	vWorldPosition = worldPosition.xyz;\n" +
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
		"}\n";

		var fragmentShader = "//フラグメントシェーダ―\n" +
		"//カスタムuniform変数の取得\n" +
		"uniform vec3 topColor;     //ドーム頂点色\n" +
		"uniform vec3 bottomColor;  //ドーム底辺色\n" +
		"uniform	float exp;         //減衰指数\n" +
		"uniform	float offset;      //高さ基準点\n" +
		"//バーテックスシェーダーから転送された変数\n" +
		"varying vec3 vWorldPosition;\n" +
		"void main( ) {\n" +
		"	//高さの取得\n" +
		"	float h = normalize( vWorldPosition + vec3(0, offset, 0) ).y;\n" +
		"	if( h < 0.0) h = 0.0;\n" +
		"	gl_FragColor = vec4( mix( bottomColor, topColor, pow(h, exp) ), 1.0 );\n" +
		"}\n";
    //形状オブジェクトの宣言と生成
    var geometry = new THREE.SphereGeometry(  skydome.radius, 100, 100 );
    var uniforms = {
      topColor:  { type: "c", value: new THREE.Color( ).setHex( skydome.topColor  ) },
      bottomColor:  { type: "c", value: new THREE.Color( ).setHex( skydome.bottomColor )},
      exp:{ type: "f", value : skydome.exp  },
      offset:{ type: "f", value :skydome.offset } //高さ基準点
    };
    //材質オブジェクトの宣言と生成
    var material = new THREE.ShaderMaterial( {
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms : uniforms,
      side: THREE.BackSide,
      depthWrite: false
    } );

    //スカイドームの生成
    var skydome = new THREE.Mesh( geometry, material);
    scene.add( skydome );
  } else {

  }

/*
  var spotLight = new THREE.DirectionalLight(0xffffff, 1.2);
  spotLight.position.set(5, 10, -7.5);
  spotLight.castShadow = true;
  scene.add(spotLight);
*/
/*
文字列の生成方法
文字列を表示する平面オブジェクトに関する情報を保持するTextBoardObjectクラスのオブジェクトを生成します。
*/
/*
var textBoardObject = new TextBoardObject({
  fontSize : 80, // [%]
  textColor : {r:1, g:1, b:1, a:1},//文字色
  backgroundColor : { r:1, g:1, b:1, a:0.1 },//背景色（RGBA値を0から１で指定）
  boardWidth : 100,  //マッ*ピング対象平面オブジェクトの横幅
  boardHeight : 100, //マッピング対象平面オブジェクトの縦幅
  fontName :"Times New Roman"
});
//TextBoardObjectクラスのcleatePlaneObjectメソッドで生成される平面オブジェクトをthree.jsのsceneオブジェクトに追加します。
//平面オブジェクトの生成とシーンへの追加
scene.add( textBoardObject.cleatePlaneObject() );
*/

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
    TWEEN.update();

    for (var i=0; i < JCODE.objects.length; i++) {
      //JCODE.objects[i].update();
    }

    /*
    step++;
    if( step % 60 == 0){
      var step2 = (step / 60) % 100;
      var indent = ( Math.log10( step2 ) >= 1 )? 10 : 30;
      textBoardObject.clear();
      textBoardObject.addTextLine( step2.toString(), indent, 1 );
      textBoardObject.update();
    }
*/

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
* Execute the user's code.
* Just a quick and dirty eval.  Catch infinite loops.
*/
JCODE.runScript = function(inst) {
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  try {
    eval(inst);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};
