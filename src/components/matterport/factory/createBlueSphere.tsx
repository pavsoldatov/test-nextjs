import { Color, MpSdk, Vector3 } from "../../../../public/bundle/sdk";
import * as THREE from "three";

interface BlueSphereInputs {
  position: Vector3;
  color: Color;
  scale: number;
  [key: string]: unknown;
}

interface BlueSphereComponentType extends MpSdk.Scene.IComponent {
  material?: THREE.Material;
  inputs: BlueSphereInputs;
}

export function createBlueSphereComponent(): MpSdk.Scene.IComponent {
  function BlueSphereComponent(this: BlueSphereComponentType) {
    this.inputs = {
      position: { x: 0, y: 0, z: 0 },
      color: { r: 0.2, g: 0.5, b: 1.0 },
      scale: 0.2,
    };
    this.outputs = {} as MpSdk.Scene.PredefinedOutputs;
    this.events = {};

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.Material | null = null;
    let mesh: THREE.Mesh | null = null;

    this.onInit = function () {
      console.log("BlueSphere component initializing");
      const THREE = this.context.three;

      try {
        geometry = new THREE.SphereGeometry(1, 32, 32);
        material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(
            this.inputs.color.r,
            this.inputs.color.g,
            this.inputs.color.b
          ),
        });

        mesh = new THREE.Mesh(geometry, material);

        const scale = this.inputs.scale;
        mesh.scale.set(scale, scale, scale);

        this.outputs.objectRoot = mesh;
        console.log("BlueSphere mesh created successfully");
      } catch (error) {
        console.error("Error creating sphere mesh:", error);
      }
    };

    this.onDestroy = function () {
      console.log("Destroying BlueSphere component");
      material?.dispose();
      material = null;

      geometry?.dispose();
      geometry = null;

      mesh = null;
    };
  }

  return new (BlueSphereComponent as unknown as {
    new (): MpSdk.Scene.IComponent;
  })();
}
