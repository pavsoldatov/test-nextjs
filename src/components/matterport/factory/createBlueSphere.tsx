import { Color, Scene, Vector3 } from "../../../../public/bundle/sdk";
import * as THREE from "three";

interface BlueSphereInputs {
  position: Vector3;
  color: Color;
  scale: number;
  [key: string]: unknown;
}

interface BlueSphereComponentType extends Scene.IComponent {
  material?: THREE.Material;
  inputs: BlueSphereInputs;
}

export function createBlueSphereComponent(): Scene.IComponent {
  function BlueSphereComponent(this: BlueSphereComponentType) {
    this.inputs = {
      position: { x: 0, y: 0, z: 0 },
      color: { r: 0.2, g: 0.5, b: 1.0 },
      scale: 0.2,
    };
    this.outputs = {} as Scene.PredefinedOutputs;
    this.events = {};

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.Material | null = null;
    let mesh: THREE.Mesh | null = null;

    this.onInit = function () {
      const THREE = this.context.three;

      try {
        geometry = new THREE.SphereGeometry(1, 32, 32);

        const baseColor = new THREE.Color(
          this.inputs.color.r,
          this.inputs.color.g,
          this.inputs.color.b
        );

        const emissiveColor = new THREE.Color(
          this.inputs.color.r * 0.8,
          this.inputs.color.g * 0.8,
          this.inputs.color.b * 0.8
        );

        material = new THREE.MeshLambertMaterial({
          color: baseColor,
          emissive: emissiveColor,
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.85,
        });

        mesh = new THREE.Mesh(geometry, material);

        const scale = this.inputs.scale;
        mesh.scale.set(scale, scale, scale);

        this.outputs.objectRoot = mesh;
      } catch (error) {
        console.error("Error creating sphere mesh:", error);
      }
    };

    this.onDestroy = function () {
      if (material) {
        material.dispose();
        material = null;
      }

      if (geometry) {
        geometry.dispose();
        geometry = null;
      }

      mesh = null;
    };
  }

  return new (BlueSphereComponent as unknown as {
    new (): Scene.IComponent;
  })();
}
