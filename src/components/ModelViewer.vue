<template>
  <div ref="viewerContainer"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';

export default {
  name: 'ModelViewer',
  props: {
    filePath: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.animationId = null;
    this.rotationX = 0.0091 + (Math.random() * 0.025);
    this.rotationY = 0.008 + (Math.random() * 0.025);
    this.rotationZ = 0.0056 + (Math.random() * 0.025);

    this.initThreeJS();
  },
  methods: {
    getLoader(extension) {
      switch (extension.toLowerCase()) {
        case 'gltf':
        case 'glb':
          return new GLTFLoader();
        case 'obj':
          return new OBJLoader();
        case 'fbx':
          return new FBXLoader();
        case 'stl':
          return new STLLoader();
        case 'dae':
          return new ColladaLoader();
        case '3ds':
          return new TDSLoader();
        case 'ply':
          return new PLYLoader();
        case 'wrl':
          return new VRMLLoader();
        default:
          console.error(`Unsupported model file type: ${extension}`);
          return null;
      }
    },
    initThreeJS() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(500, 500);
      this.renderer.setClearColor(0x000000, 0); // Set transparent background
      this.$refs.viewerContainer.appendChild(this.renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);

      this.loadModel();
    },
    loadModel() {
      const extension = this.filePath.split('.').pop();
      const loader = this.getLoader(extension);

      if (!loader) return;

      loader.load(
        this.filePath,
        (loadedObject) => {
          this.model = loadedObject.scene ? loadedObject.scene : loadedObject;

          const boundingBox = new THREE.Box3().setFromObject(this.model);
          const modelCenter = boundingBox.getCenter(new THREE.Vector3());
          const modelSize = boundingBox.getSize(new THREE.Vector3());

          this.pivot = new THREE.Group();
          this.scene.add(this.pivot);

          const torsoHeight = modelSize.y / 2; // Assume torso is at the midpoint of height
          this.model.position.set(-modelCenter.x, -boundingBox.min.y - torsoHeight, -modelCenter.z);

          this.pivot.add(this.model);

          const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
          this.camera.position.set(0, 0, maxDimension * 1.5);
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));

          this.animate();
        },
        undefined,
        (error) => {
          console.error(`Error loading model:`, error);
        }
      );
    },
    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      
      this.pivot.rotation.x += this.rotationX;
      this.pivot.rotation.y += this.rotationY;
      this.pivot.rotation.z += this.rotationZ;

      this.renderer.render(this.scene, this.camera);
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.scene = null;
    this.camera = null;
    this.model = null;
    this.renderer = null;
  }
};
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
