/* Babylon JS is available as **npm** package.  
You can easily build a simple `React` Component around a `canvas` and Babylon JS
I have created a minimal example with React+ Babylon:
 */
import React, { Component } from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';
import 'babylonjs-serializers';
import * as BABYLONGUI from 'babylonjs-gui'


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
    let meshTask = this.assetsManager.addMeshTask(type, "", "Typeroom/", "PhongNgu2.glb");
    this.assetsManager.load();
    this.assetsManager.useDefaultLoadingScreen = false;
    let i;
    let models=[];
    meshTask.onSuccess = (task) => {
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
    this.addModels();

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
    let camera;
    if(type=="1"){
      // ---------------ArcRotateCamera or Orbit Control----------
       camera = new BABYLON.ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 4,
        4,
        BABYLON.Vector3.Zero(),
        this.scene
      );
      camera.inertia = 0;
      camera.angularSensibilityX = 250;
      camera.angularSensibilityY = 250;

      // This attaches the camera to the canvas
      camera.attachControl(this.canvas, true);
      camera.setPosition(new BABYLON.Vector3(5, 5, 5));
    }
    else{
     camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -20), this.scene);
     camera.rotation.y=3.14;
      camera.position =new BABYLON.Vector3(-9,18,-1);
      camera.attachControl(this.canvas, true);    
      camera.speed=1.5;
      camera.applyGravity = true;
       camera.ellipsoid= new BABYLON.Vector3(8,18,8)
      // camera.ellipsoidOffset = new BABYLON.Vector3(15, 13, 15);
      camera.checkCollisions=true;
    }
    this.camera=camera;
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
    let clickMesh=(mesh,active=true)=>{
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
    this.importMesh.map((mesh)=>{
        mesh.checkCollisions=true;
        if(mesh.name==="wall") this.meshWall=mesh;
        if(mesh.name!=="wall" && mesh.name!=="roof" && mesh.name!=="nen" && mesh.name!=="glassWindow" && mesh.parent!==null){
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
          move(mesh);
      });
   //  createContainerButton(container,0,-150);
     that.InformationPanel.addControl(Movecontainer);
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
    function createButton ( mywidth, myheight ,caption) {
      let button1 = BABYLONGUI.Button.CreateSimpleButton("but1", caption);
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
    let ActiveNormalPanel=(mesh,active)=>{
        if(active){
            //console.log(that.NormalPanel)
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
              if(that.SavePanel) that.UIRoot.removeControl(that.GeneralPanelButton);
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
              let saveButton = createButton("120px","40px","save");
              let cancelButton = createButton("120px","40px","cancel");
              saveButton.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
              saveButton.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
              cancelButton.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
              cancelButton.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
              cancelButton.top="40px";
              saveButton.onPointerUpObservable.add(function() { 
                  move(mesh,false);
              });
              cancelButton.onPointerUpObservable.add(function(e) { 
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
      console.log(that.meshWall);
     diffmesh.push(that.meshWall);
      
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
                      mesh.position.x=Math.round(mesh.position.x)
                      mesh.position.z=Math.round(mesh.position.z)
                  }
                  meshMaterial.diffuseColor=new BABYLON.Color3(0,0,1);
              } 
          }
      })
      mesh.material = meshMaterial;
    }
    let LocationMesh;
    let move_mesh_name;
    let move=(mesh,active=true)=>{
        if(active){
            that.gizmoManager = new BABYLON.GizmoManager(that.scene);
            that.camera.lockedTarget= null
            move_mesh_name=mesh.name;
            that.UIRoot.removeControl(that.GeneralPanelButton)
            if(that.AddPanel)that.UIRoot.removeControl(that.AddPanel);
            if(that.NormalPanel)ActiveNormalPanel(mesh,false);
            that.SavePanel = activeCancelandSave(mesh,true);
            that.scene.meshes.map(value =>{
                value.isPickable=false
            }); //Off event all picker
            that.gizmoManager.positionGizmoEnabled = true;
            that.gizmoManager.attachToMesh(mesh);
            that.gizmoManager.gizmos.positionGizmo.updateGizmoPositionToMatchAttachedMesh=false;
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
                let mesh_clone=that.scene.getMeshByName(mesh.name + '_clone');
                coilision(mesh,meshMaterial,true);
                LocationMesh.text="X :"+mesh.position.x+" Z :"+mesh.position.z;
                if(mesh_clone.material)mesh.material=mesh_clone.material
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
        insertButton(createContainerButton(0.7,0.10,"Fire alram"),"fire_alarm")
        insertButton(createContainerButton(0.7,0.10,"Light"),"light")
      });
      Addcontainer.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      Addcontainer.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
      GeneralPanel.addControl(Addcontainer);
     return GeneralPanel;
    }
    let countContainerAddPanel=1;
    let maxContainerAddPanel=4;
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
        let meshTask;
        switch(type){
          case 'camera':meshTask = this.assetsManager.addMeshTask(type, "", "Typeroom/", "camera1.glb");break;
          case 'fire_alarm':meshTask = this.assetsManager.addMeshTask(type, "", "Typeroom/", "camera1.glb");break;
          case 'light':meshTask = this.assetsManager.addMeshTask(type, "", "Typeroom/", "camera1.glb");break;
          default : console.log("Khong ho tro");
        }
        await this.assetsManager.load();
        this.assetsManager.useDefaultLoadingScreen = false;
        meshTask.onSuccess = (task) => {
          task.loadedMeshes.map(loadMesh=>{
            if(loadMesh.parent!==null){
              console.log(loadMesh.parent.name)
              if(loadMesh.parent.name==="__root__"){
                // console.log(loadMesh);
                  let root=loadMesh.parent;
                  loadMesh.id= loadMesh.name+"_"+increment;
                  loadMesh.name= loadMesh.name+"_"+increment;
                  increment++;
                  loadMesh.parent=this.meshRoom;
                  that.camera.position.y=35;
                  that.camera.setTarget(loadMesh.position);
                  move(loadMesh);
                  
                  that.canMesh.push(loadMesh)
                  clickMesh(loadMesh);
                  root.dispose();
              };
            }
          })
         // that.scene.debugLayer.show();
          // meshes[0].position.y=0;
          // meshes[0].position.z=0;
          // meshes[0].name=meshes[0].name+"_"+increment;
          // meshes.map(mesh=>{
          //     that.camera.lockedTarget = mesh;
          //     clickMesh(mesh)
          //     this.canMesh.push(mesh);
          // })
        }
        meshTask.onError = await function (task, message, exception) {
          console.log(message, exception);
        }    
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
        ref={canvas => {
          this.canvas = canvas;
          
        }}
      />
      <input type="submit" id="btn-submit" value="Submit" onClick={this.save}></input>
      </>
    );
  }
}
export default BabylonScene;