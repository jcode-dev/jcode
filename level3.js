//////////////////
// 手本をうごかす

// 始まり

function startLesson() {

  //document.getElementById("broadcasting-start1").play();
  print(`
  自由にすきなグラフィックスをつくろう。<br />
  下の「リフレッシュ」ボタンを押すと、すべてのオブジェクトをけして、画面をクリアできます。<br />
  `);
}

// ここから開始します。
$(function(){
    setTimeout(startLesson,100);  
});

function particleInit() {

	var snow = {
		//positionStyle    : ,
		positionBase     : new THREE.Vector3( 0, 60, 0 ),
		positionSpread   : new THREE.Vector3( 90, 40, 90 ),
		
		//velocityStyle    : ,
		velocityBase     : new THREE.Vector3( 0, -60, 0 ),
		velocitySpread   : new THREE.Vector3( 50, 20, 50 ), 
		accelerationBase : new THREE.Vector3( 0, -10,0 ),
		
		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       :  0,
		angleVelocitySpread     : 60,
		
		//particleTexture : THREE.ImageUtils.loadTexture( 'images/snowflake.png' ),
			
		//sizeTween    : new Tween( [0, 0.25], [1, 10] ),
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
		//opacityTween : new Tween( [2, 3], [0.8, 0] ),

		particlesPerSecond : 200,
		particleDeathAge   : 4.0,		
    emitterDeathAge    : 60,
    particleCount: 5000,
    particleMoving: 0
	};

  function randomVector3(base, spread)
  {
    var rand3 = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
    return new THREE.Vector3().addVectors( base, new THREE.Vector3().multiplyVectors( spread, rand3 ) );
  }
  function create() {
    particle.position = this.randomVector3( this.positionBase, this.positionSpread ); 
    particle.velocity     = this.randomVector3( this.velocityBase,     this.velocitySpread ); 
    
  }
  function update() {
    this.position.add( this.velocity.clone().multiplyScalar(dt) );
    this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );
    // convert from degrees to radians: 0.01745329251 = Math.PI/180
    this.angle         += this.angleVelocity     * 0.01745329251 * dt;
    this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;
    this.age += dt;
  }


  var materials = [];

  geometry = new THREE.Geometry();

  var textureLoader = new THREE.TextureLoader();
  sprite1 = textureLoader.load( "/three/examples/textures/sprites/snowflake1.png" );
  sprite2 = textureLoader.load( "/three/examples/textures/sprites/snowflake2.png" );
  sprite3 = textureLoader.load( "/three/examples/textures/sprites/snowflake3.png" );
  sprite4 = textureLoader.load( "/three/examples/textures/sprites/snowflake4.png" );
  sprite5 = textureLoader.load( "/three/examples/textures/sprites/snowflake5.png" );


  for ( i = 0; i < snow.particleCount; i ++ ) {

    var vertex = randomVector3(snow.positionBase, snow.positionSpread); //new THREE.Vector3();
    geometry.vertices.push( vertex );

  }

  materials[i] = new THREE.PointsMaterial({
    opacity: 0.9,
    fog: false,
    map:sprite2, 
    size:2,
    blending:THREE.AdditiveBlending, depthTest:false, transparent:true } );
  materials[i].color.setHSL( 0.95, 0, 0.8 );

  particles = new THREE.Points( geometry, materials[i] );
  JCODE.scene.add( particles );

  function velocity () {

    var v = geometry.vertices.find(function(x) {
      return !x.velocity;
    });
    if (v) {
      v.velocity = randomVector3(snow.velocityBase, snow.velocitySpread);
    }

  }
  setInterval(velocity, 20);

  function render() {
    
    var dt = 0.001;
    geometry.vertices.forEach(function(v) {
      if (v.velocity) {
        v.x = v.x + (v.velocity.x) * dt;
        v.y = v.y + (v.velocity.y) * dt;
        v.z = v.z + (v.velocity.z) * dt;
        if (v.y < 0) {
          v.y = 300;
        }
      }
    });
    geometry.verticesNeedUpdate = true;

  }
  JCODE.render.push(render);

}

