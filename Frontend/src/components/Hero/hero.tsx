import React, { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./hero.css";

type ModelProps = {
  path: string;
};

const Model = ({ path }: ModelProps) => {
  const { scene } = useGLTF(path);
  scene.scale.set(15, 15, 15); // Scale up the model as needed
  return <primitive object={scene} />;
};

const RotatingGroup = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, size } = useThree();

  useEffect(() => {
    // Set the initial orientation of the model
    if (groupRef.current) {
      groupRef.current.rotation.x = 0; // No initial X rotation
      groupRef.current.rotation.y = Math.PI; // Initial Y rotation set to PI
      groupRef.current.position.y = -1; // Adjust vertical position for better visibility
    }
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Continuous rotation effect on X-axis
      groupRef.current.rotation.x += 0.003; // Constantly rotate around X-axis

      // Adjust Y rotation based on cursor position without changing angle dynamically
      groupRef.current.rotation.y = Math.PI + (mouse.x * Math.PI) / 10; // Adjust Y based on cursor
    }
  });

  return (
    <group ref={groupRef}>
      <Model path="/model/scene.gltf" />
    </group>
  );
};

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  camera.position.set(0, 2, 6); // Adjust camera position for the best view

  return <OrbitControls args={[camera, domElement]} enableZoom={true} />;
};

const Hero = () => {
  return (
    <div className="hero">
        <Canvas>
          <ambientLight intensity={2.0} />
          <spotLight position={[10, 10, 10]} angle={0} penumbra={2} />
          <Suspense fallback={null}>
            <RotatingGroup />
          </Suspense>
          <CameraControls />
        </Canvas>
      <div className="hero-content">
        <h1 className="hero-heading">Tech Chronicles</h1>
        <p className="hero-description">
          Embark on a journey through the world of technology with our in-depth
          reviews, expert insights, and the latest news. Stay ahead of the curve
          and explore the future of tech today.
        </p>
      </div>
    </div>
  );
};

export default Hero;
