
// resize window
(function($){ 
  $.fn.funcResizeBox = function(userOptions) {
    var elements = this;
    var defaults = {
      minWidth: 0,
      minHeight: 0,
      maxWidth: 10000,
      maxHeight: 10000,
      mouseRange: 5,
      isWidthResize:true,
      isHeightResize:true};
    var option = $.extend(defaults,userOptions);

    $(this).css('resize', 'none'); 
    $(this).css('overflow', 'auto'); 
    var pos_left = $(this).offset().left;
    var pos_top = $(this).get(0).offsetTop;
    var pos_right = $(this).outerWidth() + pos_left;
    var pos_bottom = $(this).outerHeight() + pos_top;
    var right_min = pos_right - option.mouseRange;
    var bottom_min = pos_bottom - option.mouseRange;
    var right_flg = false;
    var bottom_flg = false;
    var $box = $(this);
    var resize_flg = false;
      
    $(this).mousemove(function(e){

      if(resize_flg) return;
      
      right_flg = false;
      bottom_flg = false;

      pos_left = $box.offset().left;
      pos_top = $box.offset().top;
      pos_right = $box.outerWidth() + pos_left;
      pos_bottom = $box.outerHeight() + pos_top;
      right_min = pos_right - option.mouseRange;
      bottom_min = pos_bottom - option.mouseRange;
      
      var pagex = window.event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft); 
      var pagey = window.event.clientY + (document.body.scrollTop || document.documentElement.scrollTop); 
      
      // right
      if(pagex <= pos_right && right_min <= pagex
          && pos_top <= pagey && pagey <= pos_bottom && option.isWidthResize)
      {
          right_flg = true;
      }
      // bottom
      if(pagex <= pos_right && pos_left <= pagex
          && bottom_min <= pagey && pagey <= pos_bottom && option.isHeightResize)
      {
          bottom_flg = true;
      }

      if(right_flg && bottom_flg)
      {
          $(this).css('cursor','se-resize');
      }
      else if(right_flg)
      {
          $(this).css('cursor','e-resize'); 
      }
      else if(bottom_flg)
      {
          $(this).css('cursor','n-resize');
      }
      else{
          $(this).css('cursor','auto');
      }
    });

    $(this).mousedown(function(e){
          
      var resize_right_flg = false;
      var resize_bottom_flg = false;
      
      var pagex = e.pageX;
      var pagey = e.pageY;
      var boxWidth = $box.width();
      var boxHeight = $box.height();
      
      if(right_flg){
          resize_right_flg = true;
      }
      
      if(bottom_flg){
          resize_bottom_flg = true;
      }
      $(document).mousemove(function(e){

        if(!resize_right_flg && !resize_bottom_flg)
            return;   
        
        $('body').css('cursor', $box.css('cursor'));
        resize_flg = true;

        var addWidth = e.pageX - pagex;
        var resize_width = boxWidth + addWidth
        if(resize_right_flg && resize_width <= option.maxWidth 
                                && option.minWidth <= resize_width){
            $box.width(resize_width);
        }
        
        var addheight = e.pageY - pagey;
        var resize_height = boxHeight + addheight
        if(resize_bottom_flg && resize_height <= option.maxHeight 
                                && option.minHeight <= resize_height){
            $box.height(resize_height);
        }
        JCODE.resizeEvent();

      }).mouseup(function(){
        $(document).off("mousemove");
        resize_bottom_flg = false;
        resize_right_flg = false;
        resize_flg = false;
        $('body').css('cursor','auto');
      });
    });
    return(this);
  };
})(jQuery);

/**
 * Create a namespace for the application.
 */
var JCODE = {};

JCODE.scene = null;

JCODE.resizeEvent = function() {
  var event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, false);
  window.dispatchEvent(event);
}

JCODE.initThreejs = function() {
  var threeCanvas = "threejs-canvas";
  var domElement = document.getElementById(threeCanvas);
  
  // 床を書く
  function addFloor() {
    // 地面
    var floor = new THREE.Group();
    var planeGeometry = new THREE.PlaneGeometry(10, 10);
    function newmesh (color) {
      var planeMaterial1 = new THREE.MeshPhongMaterial({color: color, opacity:0.8, transparent:true});
      var plane1 = new THREE.Mesh(planeGeometry, planeMaterial1);
      plane1.receiveShadow = true;
      // rotate and position the plane
      plane1.rotation.x = -0.5 * Math.PI;
      plane1.position.x = 0;
      plane1.position.y = 0;
      plane1.position.z = 0;
      return plane1;
    }
    var plane1 = newmesh(0xFFFFFF); // 白
    var plane2 = newmesh(0x303030); // 黒
    //var plane2 = newmesh(0); // 黒
    var plane3 = newmesh(0x000080); // 青
    for (var x=0; x<10; x++) {
      for (var z=0; z<10; z++) {
        var p = (x == 5 && z ==5) ? plane3.clone() : (( x + z) % 2) ? plane1.clone() : plane2.clone();
        p.position.z = z * 10 - 50;
        p.position.x = x * 10 - 50;
        floor.add(p);
      }
    }
    scene.add(floor);
  }

  function addGround() {
    // ground
    var loader = new THREE.TextureLoader();
    
    var groundTexture = loader.load( '/three/examples/textures/terrain/grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 500, 500 ), groundMaterial );
    mesh.position.y = 0.1;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

  }

  //スカイドームの生成
  function addSkydome() {
    var skydome = {
			enabled : true,         //スカイドーム利用の有無
			radius  : 300,           //スカイドームの半径
			topColor : 0x2E52FF,     //ドーム天頂色
			bottomColor : 0xFFFFFF,  //ドーム底面色
			exp : 0.8,               //混合指数
			offset : 20               //高さ基準点
    };

    //バーテックスシェーダー
    var vertexShader = `
      //頂点シェーダーからフラグメントシェーダーへの転送する変数
      varying vec3 vWorldPosition;
      void main() {
        //ワールド座標系における頂点座標
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `
    //フラグメントシェーダ―
    var fragmentShader = `
      //カスタムuniform変数の取得
      uniform vec3 topColor;     //ドーム頂点色
      uniform vec3 bottomColor;  //ドーム底辺色
      uniform	float exp;         //減衰指数
      uniform	float offset;      //高さ基準点
      //バーテックスシェーダーから転送された変数
      varying vec3 vWorldPosition;
      void main() {
        //高さの取得
        float h = normalize(vWorldPosition + vec3(0, offset, 0)).y;
        if( h < 0.0) h = 0.0;
        gl_FragColor = vec4(mix(bottomColor, topColor, pow(h, exp)), 1.0);
      }
    `
    var geometry = new THREE.SphereGeometry(skydome.radius, 100, 100);
    var uniforms = {
      topColor:  { type: "c", value: new THREE.Color().setHex(skydome.topColor) },
      bottomColor:  { type: "c", value: new THREE.Color().setHex(skydome.bottomColor) },
      exp:{ type: "f", value : skydome.exp  },
      offset:{ type: "f", value :skydome.offset } //高さ基準点
    };
    //材質オブジェクトの宣言と生成
    var material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms : uniforms,
      side: THREE.BackSide,
      depthWrite: false
    });
    //スカイドームの生成
    var skydome = new THREE.Mesh(geometry, material);
    scene.add(skydome);
  }

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 80, 500);

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0));
  renderer.shadowMap.enabled = true;

  // カメラ
  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, domElement.clientWidth / domElement.clientHeight, 0.01, 2000);
  // position and point the camera to the center of the scene
  camera.position.set(15, 25, 45);
  camera.lookAt(scene.position);

  var hemiLight = new THREE.HemisphereLight(0x0c00d9, 0xffffff, 0.18);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  // add DirectionalLight for the shadows
  var directionalLight = new THREE.DirectionalLight("#ffffff");
  directionalLight.position.set( 100, 100, 100);
  directionalLight.castShadow = true;
  directionalLight.intensity = 1.2;

  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 400;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 200;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  //var directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight);
  //scene.add( directionalLightHelper);

  if (false) {

   addFloor();   // 床を書く
  
  } else {
 
   addGround();  // 芝生を書く
    
  }
	//スカイドームの利用
  addSkydome();
 
  // マウスのコントロール
  var controls = new THREE.OrbitControls( camera, domElement );
  
  // resize 処理
  var onresize = function(e) {
    var width = domElement.clientWidth;
    var height = domElement.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onresize, false);
  onresize();
  
  // add the output of the renderer to the html element
  domElement.appendChild(renderer.domElement);

  JCODE.render = [];
  JCODE.render.push(controls.update);
  JCODE.render.push(TWEEN.update);
  function renderScene() {

    for (var i = 0; i < JCODE.render.length; i++) {
      JCODE.render[i]();
    }

    //controls.update();
    //TWEEN.update();
    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
  renderScene();

  JCODE.scene = scene;

}

JCODE.project = {
  selectedIndex: 0,
  name: "テスト",
  type: "project",
  children:[
    {
      name: "プログラム1",
      type: "jsxml",
      xml:"",
    }
  ]
};

JCODE.projectInit = function() {

  // Populate the language selection menu.
  var programMenu = document.getElementById('programMenu');

  // ワークスペースの初期化
  //Code.workspace.clear();
  function saveWorkspace() {
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    if (JCODE.project.children && JCODE.project.selectedIndex) {
      JCODE.project.children[JCODE.project.selectedIndex].xml = xmlText;
    }
  }
  function loadBlocks() {
    var defaultXml = JCODE.project.children[JCODE.project.selectedIndex].xml;
    Code.workspace.clear();
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  }
  function　restoreBlocks() {
    var url = window.location.href.split('#')[0];
    if ('localStorage' in window && window.localStorage[url]) {
      var json = null;
      try {
        json = JSON.parse(window.localStorage[url]);
      } catch (e) {
        console.log("cannot restore:", url);
      }
      if (json && json.type && json.type == "project") {
        JCODE.project = json;
        loadBlocks();
        if (!JCODE.project.selectedIndex) {
          JCODE.project.selectedIndex = 0;
        }
        console.log("restore:", url, JCODE.project.selectedIndex);
      }
    }
  }
  restoreBlocks();

  function updateProgramMenu() {
    var programs = JCODE.project.children;
    programMenu.options.length = 0;
    for (var i = 0; i < programs.length; i++) {
      var option = new Option(programs[i].name, i);
      if (i == JCODE.project.selectedIndex) {
        option.selected = true;
      }
      programMenu.options.add(option);
    }
    programMenu.options.add(new Option('（新しく作る）', i));
  }
  updateProgramMenu();
  
  window.addEventListener('unload', function() {
    var url = window.location.href.split('#')[0];
    console.log("backup:", url, JCODE.project.selectedIndex);
    saveWorkspace();
    if ('localStorage' in window) {
      //var xml = Blockly.Xml.workspaceToDom(workspace);
      // Gets the current URL, not including the hash.
      var url = window.location.href.split('#')[0];
      window.localStorage.setItem(url, JSON.stringify(JCODE.project));
     }
  }
  , false);

  programMenu.addEventListener('change', function(){
    var programs = JCODE.project.children;
    console.log("change program：", programMenu.selectedIndex);
    saveWorkspace();
    JCODE.project.selectedIndex = programMenu.selectedIndex;
    if (programs.length < (programMenu.selectedIndex+1)) {
      console.log("push", programMenu.selectedIndex);
      programs.push({
        name: "プログラム"+(programMenu.selectedIndex+1),
        type: "jsxml",
        xml:"",
      });
      Code.workspace.clear();
      updateProgramMenu();
      
    } else {
      loadBlocks();
    }
  }, true);

}
