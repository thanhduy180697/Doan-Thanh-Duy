/* Babylon JS is available as **npm** package.  
You can easily build a simple `React` Component around a `canvas` and Babylon JS
I have created a minimal example with React+ Babylon:
 */
import React, { Component } from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';

let scene;

/**
 * Example temnplate of using Babylon JS with React
 */
class BabylonScene extends Component  {
  constructor(props) {
    super(props);
    this.state = { useWireFrame: false, shouldAnimate: false };
  }
  componentDidMount = () => {
    // start ENGINE
    this.engine = new BABYLON.Engine(this.canvas, true);

    //Create Scene
    scene = new BABYLON.Scene(this.engine);
    scene.collisionsEnabled = true;
    //--Scene--
    this.addScene()
    //--Light---
    this.addLight();

    //--Camera---
    this.addCamera(2);

    //--Meshes---
    this.addModels();

    //--Ground---
    this.addGround();

    // Add Events
    window.addEventListener("resize", this.onWindowResize, false);

    // Render Loop
    this.engine.runRenderLoop(() => {
      scene.render();
    });

    //Animation
    scene.registerBeforeRender(() => {
      
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize, false);
  }

  onWindowResize = event => {
    this.engine.resize();
  };

  /**
   * Add Lights
   */
  addLight = (x=0,y=10,z=0) => {
    //---------- LIGHT---------------------
    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    let light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 10, 0),
      scene
    );
  };
  addScene = () =>{
    BABYLON.SceneLoader.Append("Typeroom/", "PhongBep.glb", scene, function (scene) {
      // Create a default arc rotate camera and light.  
        let allmesh= scene.meshes;
        allmesh.map(mesh =>{
          console.log(mesh.name);
          mesh.checkCollisions=true;
           if (mesh.name.search("kinh")!=-1  ){
            //this.addGlass(mesh);
           
           
            
           }
        });                   
      });
  }
  /**
   * Add Camera 
   * type : 1 = FreeCamera
   * type : 2 = ArcRotateCamera
   */
  addCamera = (type=1) => {
    let camera;
    if(type=="1"){
      // ---------------ArcRotateCamera or Orbit Control----------
       camera = new BABYLON.ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 4,
        4,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.inertia = 0;
      camera.angularSensibilityX = 250;
      camera.angularSensibilityY = 250;

      // This attaches the camera to the canvas
      camera.attachControl(this.canvas, true);
      camera.setPosition(new BABYLON.Vector3(5, 5, 5));
    }
    else{
     camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -20), scene);
     camera.rotation.y=3.14;
      camera.position =new BABYLON.Vector3(-9,18,-1);
      camera.attachControl(this.canvas, true);    
      camera.speed=1.5;
      camera.applyGravity = true;
       camera.ellipsoid= new BABYLON.Vector3(8,18,8)
      // camera.ellipsoidOffset = new BABYLON.Vector3(15, 13, 15);
      camera.checkCollisions=true;
    }
    
  };

  /**
   * Create Stage and Skybox
   */
  addGround = () => {
    // Create a built-in "ground" shape.
    let ground = BABYLON.MeshBuilder.CreateGround(
      "ground1",
      { height: 900, width: 900, subdivisions: 2 },
      scene
    );
    let groundMaterial = new BABYLON.StandardMaterial("grass0", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture(
      "Typeroom/textures/glass.jpg",
      scene
    );
    ground.material = groundMaterial;
    ground.position.y=-1;
    ground.checkCollisions = true;
    //Add SkyBox
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Typeroom/textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;		
  };

  /**
   * Add Models
   */
  addModels = () => {

  };
  addGlass = () =>{
    // console.log("Duy ne");
    // let material = new BABYLON.StandardMaterial("glass", scene);
    // material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // material.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    // material.reflectionTexture.level = 1;
    // material.specularPower = 150;
    // material.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    // material.alpha = 0.1;
    // return material;
  };
  render() {
    return (
      <canvas
        style={{ width: window.innerWidth*0.70, height: window.innerHeight }}
        ref={canvas => {
          this.canvas = canvas;
          
        }}  
      />
    );
  }
}
export default BabylonScene;