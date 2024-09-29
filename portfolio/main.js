import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.outputColorSpace= THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor('#FFFFFF');
// renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

//creating scene now

const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);
camera.position.set(200,200,-400); // moving camera farther or closer from middle , increae value for farther 0,500,10 200,200,-400
camera.lookAt(0,0,0);

//OrbitalControls
const control=new OrbitControls(camera,renderer.domElement);
control.enableDamping=true;
control.dampingFactor=0.25;
control.enableZoom=true;
control.zoomSpeed=1.0;

const textureLoader=new THREE.TextureLoader();
const groundTexture=textureLoader.load('./images/officeFloor.jpg')


const groundGeometry=new THREE.BoxGeometry(500,15,400);  //500,300,32,32
//groundGeometry.rotateX(-Math.PI/2);  // rotate it by 90' to make sure that the plane is flat on the ground
const groundMaterial=new THREE.MeshStandardMaterial({map:groundTexture, side:THREE.DoubleSide})






const createRoundedWall = (width,height,depth,position,radius)=>{
  
  const shape=new THREE.Shape();
  shape.moveTo(-width/2+radius,-height/2);
  shape.lineTo(width/2,-height/2,width/2,-height/2+radius);
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  

   
  const extrudeSettings = {
    depth:depth,
    bevelEnabled:false
  };
  const geometry = new THREE.ExtrudeGeometry(shape,extrudeSettings)
  const material=new THREE.MeshStandardMaterial({color:'#72A0C1'});
  const wall = new THREE.Mesh(geometry,material);

  wall.position.set(...position);
  scene.add(wall);

  const board=new THREE.BoxGeometry(1,1,1);

  //const boardMaterial=new THREE.MeshStandardMaterial({color:'#FFFFFF'});

  const canvas=document.createElement('canvas');
  canvas.width=1024;
  canvas.height=512;
  const context=canvas.getContext('2d');
  context.fillStyle='#FFFFFF';
  context.fillRect(0,0,canvas.width,canvas.height);
  context.font='60px Arial';
  context.fillStyle='#000000';
  context.textAlign='center';
  context.textBaseline='middle';

 
 context.fillText('Todo List!!',canvas.width/2,canvas.height/2-150);
 const x1=250;
 const y1=200;
 context.font='20px Arial';
 context.fillStyle = '#000000'; // Ensure the text color is set
context.textAlign = 'left'; // Align to the left
 context.fillText('1. Check out the GitHub Repo of Sehrish khan : ',x1,y1)

 const link=canvas.getContext('2d');
 const linkText='https://github.com/SehrishKhanSE2001?tab=repositories';
 link.font='20px Arial';
 context.fillStyle='#0000FF';
 context.textAlign='left';
 const x=250;
 const y=250;
link.fillText(linkText,x,y);
const textWidth=link.measureText(linkText).width;


  const texture=new THREE.CanvasTexture(canvas);
  const boardMaterial=new THREE.MeshStandardMaterial({map:texture});


  const boardMesh=new THREE.Mesh(board,boardMaterial);
  boardMesh.scale.set(200,100,10)
  boardMesh.position.set(5,30,0)
  wall.add(boardMesh)
  
 const raycaster=new THREE.Raycaster();
 const mouse=new THREE.Vector2();

 const handleLinkClick = (event) =>{
  mouse.x=(event.clientX/window.innerWidth)*2-1;
  mouse.y=-(event.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);
  const intersects=raycaster.intersectObject(boardMesh);
  if(intersects.length>0)
  {
    window.open(linkText,'_blank');
  }
 };

 window.addEventListener('click',handleLinkClick);

 const skillsBoard=new THREE.BoxGeometry(100,150,10);
 const skillsBoardMaterial=new THREE.MeshStandardMaterial({color:'#FFFFFF'})
 const skillsBoardMesh=new THREE.Mesh(skillsBoard,skillsBoardMaterial);
 skillsBoardMesh.scale.set(1,1,1);
 skillsBoardMesh.position.set(-160,5,-1);
 wall.add(skillsBoardMesh);

  
};


 createRoundedWall(500, 250, 50, [-25, 50, 150], 20);

















const groundMesh=new THREE.Mesh(groundGeometry,groundMaterial);
groundMesh.position.set(-25,-75,0)
scene.add(groundMesh)

const spotLight=new THREE.SpotLight(0xffffff,1000,1000,Math.PI/4,0.5); // color , intensity , distance, spotlight attanuates near it's eedges
spotLight.position.set(5,800,5); // x, y , zs , here only y position is defined , directly overhead our model 5,200,5


scene.add(spotLight);

const ambientLight=new THREE.AmbientLight(0xffffff,0.8);
scene.add(ambientLight);

const loader=new GLTFLoader().setPath('./blenderFile/');
console.log(loader);
loader.load('new_model1.gltf', (gltf)=>{
  console.log(gltf.scene)
  const mesh=gltf.scene;
  mesh.scale.set(3.0,3.0,3.0);
  mesh.position.set(0,-60,-1);
  scene.add(mesh);
},undefined,
(error)=>{
  console.log('An error occured loading the model: ',error)
}

)
loader.load('plant123.gltf',(gltf)=>{
  const mesh=gltf.scene;
  mesh.scale.set(3.0,3.0,3.0);
  mesh.position.set(150,-70,100);
  scene.add(mesh);
})

const pointLight=new THREE.PointLight(0xffffff,6.6,10);
pointLight.position.set(0,100,-5);
scene.add(pointLight);

const pointLightHelper=new THREE.PointLightHelper(pointLight,10);
scene.add(pointLightHelper);

const spotLight1=new THREE.SpotLight(0xffffff,6.6,300,Math.PI/4,0.3);
spotLight1.position.set(100,150,100);
scene.add(spotLight1);

const ambientLight1=new THREE.AmbientLight(0xffffff,1.2);
scene.add(ambientLight1);

function animate(){
requestAnimationFrame(animate);
control.update();
renderer.render(scene,camera);
}

animate();

window.addEventListener('resize' , ()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
})