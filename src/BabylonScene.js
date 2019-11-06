/* Babylon JS is available as **npm** package.  
You can easily build a simple `React` Component around a `canvas` and Babylon JS
I have created a minimal example with React+ Babylon:
 */
import React, { Component } from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';
import 'babylonjs-serializers';
import * as BABYLONGUI from 'babylonjs-gui'
import { isNumber } from "util";
import { NullEngine } from "babylonjs";

/**
 * Example temnplate of using Babylon JS with React
 */
class BabylonScene extends Component  {
  constructor(props) {
    super(props);
    this.state = { useWireFrame: false, shouldAnimate: false ,type :"PhongNgu"}; 
  }
  
  async componentDidMount () {
    // start ENGINE
    
    this.engine = new BABYLON.Engine(this.canvas, true);

    //Create this.scene
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.collisionsEnabled = true;
    
    //--this.scene--
    await this.addScene()
    
    
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
      this.scene
    );
  };
  addScene = async () =>{
    let {type} = this.state;
    this.assetsManager = new BABYLON.AssetsManager(this.scene);
    let meshTask = this.assetsManager.addMeshTask("", "", "Typeroom/", "PhongNgu6.glb");
    this.assetsManager.load();
    this.assetsManager.useDefaultLoadingScreen = false;
    let i;
    let models=[];
    meshTask.onSuccess = (task) => {
      console.log(task)
      for (i = 0; i < task.loadedMeshes.length; i++) {     
        models[i] = task.loadedMeshes[i];//add them to our models-object, we will call them later via their name
      }
      models.length=task.loadedMeshes.length;
      this.importMesh=models;
      this.loadComplete();
    }
    meshTask.onError = await function (task, message, exception) {
      console.log(message, exception);
    }
  }
  loadComplete = () => {
    this.addLight();

    //--Camera---
    this.addCamera(2);

    //--Meshes---
   // this.addModels();

    //--Ground---
    this.addGround();
    //--Panel---
    this.addPanel();
    //Event
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("keydown", function(e) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
    }, false);
    
    // Render Loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    //Animation
    this.scene.registerBeforeRender(() => {
    });
  }
  save=()=>{   
    let serializedScene = BABYLON.SceneSerializer.Serialize(this.scene);
    let strScene = JSON.stringify(serializedScene);
    console.log(strScene);
  }
  /**
   * Add Camera 
   * type : 1 = FreeCamera
   * type : 2 = ArcRotateCamera
   */
  addCamera = (type=1) => {
    if(type=="1"){
      // ---------------ArcRotateCamera or Orbit Control----------
       this.camera = new BABYLON.ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 4,
        4,
        BABYLON.Vector3.Zero(),
        this.scene
      );
      this.camera.inertia = 0;
      this.camera.angularSensibilityX = 250;
      this.camera.angularSensibilityY = 250;

      // This attaches the camera to the canvas
      this.camera.attachControl(this.canvas, true);
      this.camera.setPosition(new BABYLON.Vector3(5, 5, 5));
    }
    else{
      this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -20), this.scene);
      this.camera.rotation.y=3.14;
      this.camera.position =new BABYLON.Vector3(-9,18,-1);
      this.camera.attachControl(this.canvas, true);    
      this.camera.speed=1.5;
      this.camera.applyGravity = true;
      this.camera.ellipsoid= new BABYLON.Vector3(8,18,8)
      // camera.ellipsoidOffset = new BABYLON.Vector3(15, 13, 15);
      this.camera.checkCollisions=true;
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
      this.scene
    );
    let groundMaterial = new BABYLON.StandardMaterial("grass0", this.scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture(
      "Typeroom/textures/glass.jpg",
      this.scene
    );
    ground.material = groundMaterial;
    ground.position.y=-1;
    ground.checkCollisions = true;
    //Add SkyBox
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Typeroom/textures/skybox", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    this.ground=ground;
    this.skybox=skybox;
  };

  /**
   * Add Models
   */
  addModels = () => {

  };
  addPanel = () =>{
    this.gizmoManager = new BABYLON.GizmoManager(this.scene);
    let old_mesh;
    this.canMesh=[];
    let index=0;
    let that=this;
    let activeClick;
    let click_old_mesh;
    this.wallMesh=[];
    this.meshSpecial=[];
    let clickMesh=(mesh,active=true)=>{
      console.log(mesh.name);
      mesh.actionManager = new BABYLON.ActionManager(that.scene);
      activeClick=false;
      let activepanel= mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
          activeClick=!activeClick;
          if(click_old_mesh!==mesh||!click_old_mesh) {
            activeClick=true;
          }
         (activeClick) ? that.camera.lockedTarget= mesh :  that.camera.lockedTarget= null
          ActiveNormalPanel(mesh,activeClick)
          click_old_mesh=mesh;
      }))
    }
    let bumpMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
    bumpMaterial.bumpTexture = new BABYLON.Texture("bump.png", this.scene);
    bumpMaterial.invertNormalMapX = true;
    bumpMaterial.invertNormalMapY = true;
    this.importMesh.map((mesh)=>{

        mesh.checkCollisions=true;
        if(mesh.name==="roof"){
          mesh.material=bumpMaterial;
        }
        if(mesh.name==="closet"){
          that.Closet=mesh;
        }
        if(mesh.name.search("wall")===0){
          this.wallMesh.push(mesh)
        }
        if(mesh.name==="fireAlarm" || mesh.name==="roofLight"|| mesh.name==="camera" || mesh.name==="waterCannon"){
          this.meshSpecial.push(mesh);
        }
        if(mesh.name.search("wall")===-1 && mesh.name!=="roof" && mesh.name!=="nen" && mesh.name!=="glassWindow" && mesh.parent!==null){
          if(mesh.name==="__root__"){
            mesh.id="room";
            mesh.name="room";
            this.meshRoom=mesh;
          }
          if(mesh.parent.id==="__root__"){
            clickMesh(mesh)
            this.canMesh[index]=mesh;
            index++;
          }
        }
    })
    this.UIRoot = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    this.GeneralPanelButton = createContainerButton(0.25,0.06,"General Panel");
    this.GeneralPanelButton.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.GeneralPanelButton.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.UIRoot.addControl(this.GeneralPanelButton);
    let click_general_active=false;
    this.GeneralPanelButton.getChildByName('but1').onPointerUpObservable.add(function(evt) { 
      click_general_active=!click_general_active;
       ActiveGeneralPanel(click_general_active);
        
    });
    let CreateNormalPanel = (mesh)=>{
      that.scene.activeCamera.attachControl(that.canvas, false );           
      //Left Inner Pane
      that.NormalPanel = createInnerPane('normal_pane',.3,.98);
      that.NormalPanel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;  
      that.NormalPanel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP
      // ScrollViewer for cars that are generated
      that.sv = createScrollView(1,0.96,25);
      //adding scrollView to inner NormalPanel
      that.NormalPanel.addControl(that.sv);
      that.InformationPanel= createStackContainer(1,1,3);
      that.sv.addControl(that.InformationPanel);
      
       //Name
      let NameMesh = createInput(mesh.name,0.8,.05);
      NameMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      NameMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      NameMesh.onBlurObservable.add(function (target,key){
       mesh.name= NameMesh.text;
      });
      //Exit Mesh
      let ExitMesh= createButton(0.16,.06,"X");
      ExitMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      ExitMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      ExitMesh.onPointerUpObservable.add(function() { 
         returnNormal();
      });
     // NameMesh.left = -3;
      NameMesh.top = 2;
      ExitMesh.top = 2;
      that.NormalPanel.addControl(NameMesh);
      that.NormalPanel.addControl(ExitMesh); 
      //Delete Button
      let Deletecontainer = createContainerButton(.99,"80px","Delete");
      Deletecontainer.getChildByName('but1').onPointerUpObservable.add(function() { 
         deleteMesh(mesh,2);
      });
      that.InformationPanel.addControl(Deletecontainer);
      //Move Button
     let Movecontainer = createContainerButton(.99,"80px","Move");
     Movecontainer.getChildByName('but1').onPointerUpObservable.add(function() {
          that.cposition=[];
          that.cposition.push(mesh.position.x);
          that.cposition.push(mesh.position.y);
          that.cposition.push(mesh.position.z);
          move(mesh);
      });
      that.InformationPanel.addControl(Movecontainer);
      let CameraRecordContontainer = createContainerButton(.99,"80px","Record");
      CameraRecordContontainer.getChildByName('but1').onPointerUpObservable.add(function() {
        addRecord(mesh);
      });
      let OpenSceneContontainer = createContainerButton(.99,"80px","Open Scene");
      OpenSceneContontainer.getChildByName('but1').onPointerUpObservable.add(function() {
        openScene(mesh);
      });
      if(mesh.id.search("camera")===0){
        that.InformationPanel.addControl(CameraRecordContontainer);
        that.InformationPanel.addControl(OpenSceneContontainer);
      }
   //  createContainerButton(container,0,-150);
     that.UIRoot.addControl(that.NormalPanel); 
    }
    function createContainerButton(mywidth,myheight,nameButton){
      //container will define which button is adding the way point
      //and buttons represent each car in scene
      let container= createInnerPane(nameButton+"_contain",mywidth,myheight);
      let button = createButton("200px","40px",nameButton);
      button.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      button.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_CENTER;
      
      container.addControl(button);
      return container
    };
    function createInnerPane(name,mywidth, myheight ) {
      let rect1 = new BABYLONGUI.Rectangle;
      rect1.width = mywidth;
      rect1.height = myheight;
      rect1.color = "#ccf5ff";
      rect1.background = "#99ebff";
      rect1.name=name;
      return rect1;
    }
    function createButton ( mywidth, myheight ,caption,name="but1") {
      let button1 = BABYLONGUI.Button.CreateSimpleButton(name, caption);
      button1.width = mywidth;
      button1.height = myheight;
      button1.thickness = 0;
      button1.color = "white";
      button1.fontSize = 30;
      button1.background = "#33d6ff";
      return button1;
    }
    function createInput(text,mywidth, myheight){
      let input = new BABYLONGUI.InputText();
      input.width = mywidth;
      input.maxWidth = 0.2;   
      input.text=text;
      input.height = myheight;
      input.color = "white";
      input.background = "#33d6ff";
      return input;
    }
    function createText (mywidth, myheight ,caption) {
      let text1 = new BABYLONGUI.TextBlock();
      text1.text = caption;
      text1.color = "white";
      text1.width = mywidth;
      text1.height = myheight;
      return text1;
    }
    function createScrollView( mywidth, myheight,topOffset ) {
      // ScrollViewer for cars that are generated
      let sv = new BABYLONGUI.ScrollViewer();
      sv.width = mywidth;//1;
      sv.height = myheight;//0.9;
      sv.top = topOffset;//60,
      sv.color= "black";
      return sv;
  }
    function createStackContainer( mywidth, myheight,topOffset ) {
        let InformationPanel = new BABYLONGUI.StackPanel();
        InformationPanel.adaptWidthToChildren = true;
        InformationPanel.top = topOffset;//3,
        InformationPanel.color = "pink";
        InformationPanel.background = "red";
        return InformationPanel;
    //    InformationPanel.zIndex = zGUIIndex = zGUIIndex+1;
    }
    let old_active_mesh;
    that.meshCurrentPosition=null;
    let ActiveNormalPanel=(mesh,active)=>{
        if(active){
            mesh.id=mesh.name;
            if(that.SavePanel)that.UIRoot.removeControl(that.SavePanel);
            if(old_active_mesh!==mesh && that.NormalPanel){
              that.UIRoot.removeControl(that.NormalPanel);
                if(that.AddPanel)that.UIRoot.removeControl(that.AddPanel)
            }
           CreateNormalPanel(mesh);
            if(that.NormalPanel)that.UIRoot.removeControl(that.GeneralPanelButton)
            if(that.GeneralPanel && that.NormalPanel){
              that.UIRoot.removeControl(that.GeneralPanelButton)
              that.UIRoot.removeControl(that.GeneralPanel)
            }          
        }
        else {
            if(old_active_mesh===mesh) that.UIRoot.addControl(that.GeneralPanelButton)    
            if(that.NormalPanel){
              that.meshCurrentPosition=mesh.position;
              if(that.SavePanel) {
                that.UIRoot.removeControl(that.GeneralPanelButton);
              }
                else returnNormal();
            }
        }
        old_active_mesh=mesh;
    }
    let returnNormal=()=>{
      if(that.AddPanel)that.UIRoot.removeControl(that.AddPanel);
      if(that.NormalPanel)that.UIRoot.removeControl(that.NormalPanel);
      if(that.GeneralPanel)that.UIRoot.removeControl(that.GeneralPanel);
      if(that.GeneralPanelButton)that.UIRoot.addControl(that.GeneralPanelButton);
      that.camera.lockedTarget=null;
      that.canMesh.map(mesh=>{mesh.isPickable=true});
    }
    let deleteMesh=(mesh,type=1)=>{
      mesh.dispose();
      that.camera.lockedTarget= null
      if(type==2)ActiveNormalPanel(mesh,false);
    }
    let activeCancelandSave=(mesh,active)=>{
      if(active){
          if(!that.SavePanel)
              that.UIRoot.removeControl(that.GeneralPanelButton);
              let SavePanel=createInnerPane('save_panel',.16,.16);
              let saveButton = createButton("120px","40px","save","saveButton");
              let cancelButton = createButton("120px","40px","cancel","cancelButton");
              saveButton.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
              saveButton.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
              cancelButton.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
              cancelButton.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
              cancelButton.top="40px";
              saveButton.onPointerUpObservable.add(function() { 
                let coilision=true;
                that.meshSpecial.map(diffMesh=>{
                  if(mesh.intersectsMesh(diffMesh,true)) {
                    coilision=false;
                    alert("Khong Save duoc")
                  }
                })
                if(coilision) move(mesh,false);
              });
              cancelButton.onPointerUpObservable.add(function(e) {
                
                  mesh.position.x=that.cposition[0];
                  mesh.position.y=that.cposition[1];
                  mesh.position.z=that.cposition[2];
                
                 move(mesh,false);           
              });
              SavePanel.addControl(saveButton);
              SavePanel.addControl(cancelButton);
              SavePanel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
              SavePanel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
              that.UIRoot.addControl(SavePanel);
              return SavePanel;
      }
      else {
         if(that.SavePanel)that.UIRoot.removeControl(that.SavePanel)
      }
    }
    let coilision=(mesh,meshMaterial,PushOut=false)=>{
      let diffmesh=that.canMesh;
      this.wallMesh.map(mesh=>diffmesh.push(mesh));
      let mesh_clone=that.scene.getMeshByName(mesh.name + '_clone');  
      let inter=false;                                       
      diffmesh.map(diff =>{
          if(mesh!==diff && mesh_clone!==diff){
              if(mesh.intersectsMesh(diff,true)) {
                  inter=true;
                  if(PushOut){
                      mesh.position=mesh_clone.position
                  }
                  else meshMaterial.diffuseColor=new BABYLON.Color3(1,0,0)
              }
              if(inter===false){
                  if(PushOut){
                      if(mesh.position.z <=-76 || mesh.position.z >= 72 ||mesh.position.x <=-81 || mesh.position.x >= 83)mesh.position=mesh_clone.position
                      else{
                      mesh.position.x=Math.round(mesh.position.x)
                      mesh.position.z=Math.round(mesh.position.z)
                      }
                  }
                  meshMaterial.diffuseColor=new BABYLON.Color3(0,0,1);
              } 
          }
      })
      mesh.material = meshMaterial;
    }
    let LocationMesh;
    let move_mesh_name;
    let move=(mesh,active=true,cancel=false)=>{
        if(active){
            that.gizmoManager = new BABYLON.GizmoManager(that.scene);
            that.duy=that.meshCurrentPosition;
            that.camera.lockedTarget= null
            move_mesh_name=mesh.name;
            let originMaterial=mesh.material;
            that.UIRoot.removeControl(that.GeneralPanelButton)
            if(that.AddPanel)that.UIRoot.removeControl(that.AddPanel);
            if(that.NormalPanel)ActiveNormalPanel(mesh,false);
            that.SavePanel = activeCancelandSave(mesh,true);
            if(cancel)
              that.SavePanel.getChildByName('cancelButton').isVisible=false;
              
            
            that.scene.meshes.map(value =>{
                value.isPickable=false
            }); //Off event all picker
            that.gizmoManager.positionGizmoEnabled = true;
           
            that.gizmoManager.attachToMesh(mesh);
          
            that.gizmoManager.snapDistance = .001;
            //Show x, y ,z
            LocationMesh = createInput("X :"+mesh.position.x+" Z :"+mesh.position.z,0.3,.05);
            LocationMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            LocationMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
            that.UIRoot.addControl(LocationMesh) 

            let meshMaterial = new BABYLON.StandardMaterial("myMaterial", that.scene);
                meshMaterial.alpha=0.7;
            
            if(mesh.name!=="closet"){
              that.gizmoManager.gizmos.positionGizmo.zGizmo.dispose()
              that.gizmoManager.gizmos.positionGizmo.yGizmo.dragBehavior.onDragObservable.add((e)=>{
               
                if(mesh.name===move_mesh_name){              
                  coilision(mesh,meshMaterial)
                }
              })
            }
            else {
              that.gizmoManager.gizmos.positionGizmo.yGizmo.dispose()
              that.gizmoManager.gizmos.positionGizmo.zGizmo.dragBehavior.onDragObservable.add((e)=>{
                if(mesh.name===move_mesh_name){
                  coilision(mesh,meshMaterial)
                }
              })
            }
            that.gizmoManager.gizmos.positionGizmo.onDragStartObservable.add(()=>{
              mesh.clone(mesh.name + '_clone');
            })          
            that.gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragObservable.add(()=>{
              if(mesh.name===move_mesh_name){          
                coilision(mesh,meshMaterial)
              }
            })
            that.gizmoManager.gizmos.positionGizmo.onDragEndObservable.add(()=>{ 
                that.duy=that.meshCurrentPosition  
                let mesh_clone=that.scene.getMeshByName(mesh.name + '_clone');
                coilision(mesh,meshMaterial,true);
                LocationMesh.text="X :"+mesh.position.x+" Z :"+mesh.position.z;
                if(mesh_clone.material)mesh.material=originMaterial;
                if(cancel)mesh.material=that.currentmat; 
                if(mesh_clone.isEnabled())deleteMesh(mesh_clone);              
            })
        }
        else{
            that.camera.lockedTarget= mesh
            if(LocationMesh)that.UIRoot.removeControl(LocationMesh);
            if(that.SavePanel)that.UIRoot.removeControl(that.SavePanel);
            that.SavePanel=null
            ActiveNormalPanel(mesh,true);
            activeCancelandSave(mesh,false);
            that.canMesh.map(mesh =>(mesh.isPickable=true));
            that.gizmoManager.positionGizmoEnabled = false;
            that.gizmoManager=null;
        }
    }
    let ActiveGeneralPanel=(active=true)=>{
      if(!that.GeneralPanel) that.GeneralPanel= CreateGeneralPanel();
       if(active) {
        that.scene.meshes.map(value =>{
          value.isPickable=false
        });
        that.UIRoot.addControl(that.GeneralPanel)} 
        else {
        returnNormal();
       }
    }
    function CreateGeneralPanel(){
      that.camera.attachControl(that.canvas, false);           
      //Left Inner Pane
      let GeneralPanel = createInnerPane('gerenal_pane',.3,.10);
      GeneralPanel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      GeneralPanel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      //Add Button
      let Addcontainer = createContainerButton(0.50,0.4,"Add");
      Addcontainer.getChildByName('but1').onPointerUpObservable.add(function() {
        createAddPanel(true);
        that.UIRoot.removeControl(GeneralPanel);
        insertButton(createContainerButton(0.7,0.10,"Camera"),"camera")
        insertButton(createContainerButton(0.7,0.10,"Fire alram"),"fireAlarm")
        insertButton(createContainerButton(0.7,0.10,"Roof Light"),"roofLight")
        insertButton(createContainerButton(0.7,0.10,"Water Cannon"),"waterCannon")
      });
      Addcontainer.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      Addcontainer.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      GeneralPanel.addControl(Addcontainer);
     return GeneralPanel;
    }
    let countContainerAddPanel=1;
    let maxContainerAddPanel=5;
    let insertButton=(buttonContainer,name)=>{
        buttonContainer.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonContainer.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        buttonContainer.getChildByName('but1').onPointerUpObservable.add(function() {
            addMesh(name);
        });
        let top=String(80*countContainerAddPanel);
        buttonContainer.top=top+"px";
        countContainerAddPanel=countContainerAddPanel+1;   
        that.AddPanel.addControl(buttonContainer);
        if(countContainerAddPanel===maxContainerAddPanel) countContainerAddPanel=1;
    }
    let createAddPanel=(active)=>{
        if(active){
        that.AddPanel = createInnerPane('add_pane',.3,.8);
        that.AddPanel.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        that.AddPanel.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        that.UIRoot.addControl(that.AddPanel);
        let ExitMesh= createButton(0.16,.06,"X");
        ExitMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        ExitMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        ExitMesh.onPointerUpObservable.add(function() { 
            returnNormal();
        });
        that.AddPanel.addControl(ExitMesh);
        }
        else{
            returnNormal();
        }        
    }
    let increment=1;
    let addMesh=async(type)=>{
        this.meshSpecial.map(Special=>{
          if(type===Special.name){
            let mesh_clone_add=Special.clone(Special.name+"_"+increment)
            mesh_clone_add.position.x=0;
            mesh_clone_add.position.z=0;
            that.camera.setTarget(mesh_clone_add.position);
            clickMesh(mesh_clone_add);
            that.currentmat=mesh_clone_add.material;
            that.meshSpecial.map(diffMesh=>{
              if(mesh_clone_add.intersectsMesh(diffMesh,true)) {
                let meshMaterial = new BABYLON.StandardMaterial("myMaterial", that.scene);
                 meshMaterial.alpha=0.7;
                 meshMaterial.diffuseColor=new BABYLON.Color3(1,0,0)
                 mesh_clone_add.material = meshMaterial;  
              }
            })
            move(mesh_clone_add,true,true);
            that.canMesh.push(mesh_clone_add)
          }
        })   
        // await this.assetsManager.load();
        // this.assetsManager.useDefaultLoadingScreen = false;
        // meshTask.onSuccess = (task) => {
        //   task.loadedMeshes.map(loadMesh=>{
        //     if(loadMesh.parent!==null){
        //       console.log(loadMesh.parent.name)
        //       if(loadMesh.parent.name==="__root__"){
        //         // console.log(loadMesh);
        //           let root=loadMesh.parent;
        //           loadMesh.id= loadMesh.name+"_"+increment;
        //           loadMesh.name= loadMesh.name+"_"+increment;
        //           increment++;
                  
        //           loadMesh.parent=this.meshRoom;
        //           loadMesh.rotation.z=3.14;
        //           loadMesh.position.y=50;
                  
        //           console.log(loadMesh.rotation);
        //           that.camera.position.y=35;
        //           that.camera.setTarget(loadMesh.position);
        //           move(loadMesh);
                  
        //           that.canMesh.push(loadMesh)
        //           clickMesh(loadMesh);
        //           root.dispose();
        //       };
        //     }
        //   })
    
        // }
    }
    let addRecord=(mesh,active=true)=>{
        if(active){
          let followCamera=  new BABYLON.FreeCamera(
            "FollowCamera",
            BABYLON.Vector3.Zero(),
            that.scene
          );
          
          //Position
          followCamera.position.x= -Math.round(mesh.position.x)
          followCamera.position.y= Math.round(mesh.position.y-7)
          followCamera.position.z= Math.round(mesh.position.z)
          //Rotation

          followCamera.rotation.x= 0.65
          followCamera.rotation.y= -4
          followCamera.rotation.z= 0

        //  console.log(followCamera.position + "vs" + followCamera.rotation);
         // console.log(followCamera.position + "vs" + followCamera.rotation);
          that.scene.activeCamera= followCamera;
          that.scene.activeCamera.attachControl(that.canvas, false ); 
          that.UIRoot.removeControl(that.GeneralPanelButton)
          if(that.AddPanel)that.UIRoot.removeControl(that.AddPanel);
          if(that.NormalPanel)ActiveNormalPanel(mesh,false);
          let ExitMesh= createButton(0.22,.06,"X");
          ExitMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
          ExitMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
          ExitMesh.onPointerUpObservable.add(function() { 
            that.scene.activeCamera= that.camera;
            that.UIRoot.removeControl(ExitMesh);
            that.UIRoot.removeControl(TestMesh);
            that.scene.stopAnimation(that.scene.getMeshByName('box'));
            that.scene.getMeshByName('box').dispose();
            returnNormal();
          });
          let TestMesh= createButton(0.22,.06,"Test Mesh");
          TestMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
          TestMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
          TestMesh.top="40px"
          let num_active=1
          TestMesh.onPointerUpObservable.add(function() { 
           //Material
           if(num_active===1){
              let mat = new BABYLON.StandardMaterial("mat1", that.scene);
              mat.alpha = 1.0;
              mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
            // Shape to follow
              let box = BABYLON.MeshBuilder.CreateBox("box",{width: 6,height : 6}, that.scene);
              box.position = new BABYLON.Vector3.Zero();
              box.material = mat;
              followCamera.lockedTarget = box;
              
              let animationBox = new BABYLON.Animation("myAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation._ANIMATIONLOOPMODE_RELATIVE);
              let keys = [];
              //At the animation key 0, the value of scaling is "1"
              keys.push({
                  frame: 0,
                  value: mesh.position.x+40
              });

              //At the animation key 20, the value of scaling is "0.2"
              keys.push({
                  frame: 10,
                  value: mesh.position.x-40
              });

              //At the animation key 100, the value of scaling is "1"
              keys.push({
                  frame: 20,
                  value: mesh.position.x+40
              });
              animationBox.setKeys(keys);
              box.animations.push(animationBox);
              that.scene.beginAnimation(box, 0, 20, true);
           }
           num_active+=1;
          });
          that.UIRoot.addControl(ExitMesh);
          that.UIRoot.addControl(TestMesh);
        }
    }
    let openScene=(mesh,active=true)=>{
      //Create this.scene
      if(that.canvasCam.hidden)that.canvasCam.hidden=false;
      that.engine1 = new BABYLON.Engine(that.canvasCam, true);

      //Create this.scene
      that.subScene = new BABYLON.Scene(that.engine1);

      let followCamera=  new BABYLON.FreeCamera(
        "FollowCamera",
        BABYLON.Vector3.Zero(),
        that.subScene
      );
      //Position
      followCamera.position.x= -Math.round(mesh.position.x)
      followCamera.position.y= Math.round(mesh.position.y-7)
      followCamera.position.z= Math.round(mesh.position.z)
      //Rotation

      followCamera.rotation.x= 0.65
      followCamera.rotation.y= -4
      followCamera.rotation.z= 0
      
      
      that.subScene.activeCamera= followCamera;
      
      //Light
      let light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 10, 0),
        that.subScene
      );

      that.assetsManager1 = new BABYLON.AssetsManager(that.subScene);
      let meshTask1 = that.assetsManager1.addMeshTask("", "", "Typeroom/", "PhongNgu6.glb");
      that.assetsManager1.load();
      that.assetsManager1.useDefaultLoadingScreen = false;
      let i;
      meshTask1.onSuccess = (task) => {
        console.log("Thanh Cong");
        let light = new BABYLON.HemisphericLight(
          "light1",
          new BABYLON.Vector3(0, 10, 0),
          that.subScene
        );
      }
      meshTask1.onError = function (task, message, exception) {
        console.log(message, exception);
      }
      
      that.UIRoot.removeControl(that.GeneralPanelButton)
      if(that.AddPanel)that.UIRoot.removeControl(that.AddPanel);
      if(that.NormalPanel)ActiveNormalPanel(mesh,false);
      let ExitMesh= createButton(0.22,.06,"X");
      ExitMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      ExitMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      ExitMesh.onPointerUpObservable.add(function() { 
        that.scene.activeCamera= that.camera;
        that.UIRoot.removeControl(ExitMesh);
        that.UIRoot.removeControl(TestMesh);
        that.canvasCam.hidden = true;
        returnNormal();
      });
      that.UIRoot.addControl(ExitMesh);
      let TestMesh= createButton(0.22,.06,"Test Mesh");
      TestMesh.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      TestMesh.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      TestMesh.top="40px"
      let num_active=1
      TestMesh.onPointerUpObservable.add(function() { 
       //Material
       if(num_active===1){
          let mat = new BABYLON.StandardMaterial("mat1", that.subScene);
          mat.alpha = 1.0;
          mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
        // Shape to follow
          let box = BABYLON.MeshBuilder.CreateBox("box",{width: 6,height : 6}, that.subScene);
          box.position = new BABYLON.Vector3.Zero();
          box.material = mat;
          followCamera.lockedTarget = box;
          
          let animationBox = new BABYLON.Animation("myAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation._ANIMATIONLOOPMODE_RELATIVE);
          let keys = [];
          //At the animation key 0, the value of scaling is "1"
          keys.push({
              frame: 0,
              value: mesh.position.x+40
          });

          //At the animation key 20, the value of scaling is "0.2"
          keys.push({
              frame: 10,
              value: mesh.position.x-40
          });

          //At the animation key 100, the value of scaling is "1"
          keys.push({
              frame: 20,
              value: mesh.position.x+40
          });
          animationBox.setKeys(keys);
          box.animations.push(animationBox);
          that.subScene.beginAnimation(box, 0, 20, true);
       }
       num_active+=1;
      });
      that.UIRoot.addControl(TestMesh);
      this.engine1.runRenderLoop(() => {
        this.subScene.render();
      });
    }
  }
  addGlass = () =>{
    // console.log("Duy ne");
    // let material = new BABYLON.StandardMaterial("glass", this.scene);
    // material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // material.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", this.scene);
    // material.reflectionTexture.level = 1;
    // material.specularPower = 150;
    // material.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    // material.alpha = 0.1;
    // return material;
  };
 
  doDownload=(filename, scene)=> {
       
  } 
  render() {
    return (
      <>
      <canvas
        style={{ width: window.innerWidth*0.70, height: window.innerHeight*0.9,marginTop: -18+"px" }}
        ref={canvasDuy => {
          this.canvas = canvasDuy;
          
        }}
        className="duy"
      />
        <canvas
        style={{ width: window.innerWidth*0.135, height: window.innerHeight*0.35,marginTop: -18+"px",float:"right" }}
        ref={canvasCam => {
          this.canvasCam = canvasCam;
        }}
        className="cam"
        />
      <input type="submit" id="btn-submit" value="Submit" onClick={this.save}></input>
      </>
    );
  }
}
export default BabylonScene;