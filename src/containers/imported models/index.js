import React from "react";
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class importedModels extends React.Component {
    componentDidMount() {
        this.initThree();
    }

    initThree = () => {
        /* 
        Base
        */
        // Canvas
        const canvas = document.querySelector("canvas.webgl");
        // Scene
        const scene = new THREE.Scene();
        /* 
        Models
        */
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("./draco/");

        const gltfModel = new GLTFLoader();
        gltfModel.setDRACOLoader(dracoLoader);

        let mixer = null;
        gltfModel.load(
            "./models/Fox/glTF/Fox.gltf", // 这个路径问题耗了挺久
            (gltf) => {
                // const children = [...gltf.scene.children];
                // for (const child of children)
                // {
                //     scene.add(child);
                // }

                gltf.scene.scale.set(0.025, 0.025, 0.025);
                scene.add(gltf.scene);

                mixer = new THREE.AnimationMixer(gltf.scene);
                const action = mixer.clipAction(gltf.animations[1]);
                action.play();
            }
        )
        // https://threejs.org/editor/ 可以拖模型进去看

        /* 
        Floor
        */
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: "#444444",
                metalness: 0,
                roughness: 0.5
            })
        )
        floor.receiveShadow = true;
        floor.rotation.x = - Math.PI * 0.5;
        scene.add(floor);

        /* 
        Light
        */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(1024, 1024);
        directionalLight.shadow.camera.far = 15;
        directionalLight.shadow.camera.left = -7;
        directionalLight.shadow.camera.top = 7;
        directionalLight.shadow.camera.right = 7;
        directionalLight.shadow.camera.bottom = -7;
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        /* 
        Sizes
        */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener("resize", () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        })

        /* 
        Camera
        */
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(2, 2, 2);
        scene.add(camera);

        /* 
        Controls
        */
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 0.75, 0);
        controls.enableDamping = true;

        /* 
        Renderer
        */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        const clock = new THREE.Clock();
        let previousTime = 0;
        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;

            if (mixer)
                mixer.update(deltaTime);

            renderer.render(scene, camera);
            controls.update();
            window.requestAnimationFrame(tick);
        }
        tick();
    }

    render() {
        return (
            <>
                <canvas className="webgl"></canvas>
            </>
        )
    }
}