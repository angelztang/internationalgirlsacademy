"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  Line,
  Text,
  useTexture,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

interface Location {
  name: string;
  lat: number;
  lng: number;
  color: string;
}

// Global locations for connection points - focusing on US, Ghana, Liberia, and Guyana
const locations: Location[] = [
  // United States
  { name: "New York", lat: 40.7128, lng: -74.006, color: "#60A5FA" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, color: "#60A5FA" },
  { name: "Chicago", lat: 41.8781, lng: -87.6298, color: "#60A5FA" },
  { name: "Miami", lat: 25.7617, lng: -80.1918, color: "#60A5FA" },

  // Ghana
  { name: "Accra", lat: 5.6037, lng: -0.187, color: "#F59E0B" },
  { name: "Kumasi", lat: 6.6885, lng: -1.6244, color: "#F59E0B" },

  // Liberia
  { name: "Monrovia", lat: 6.3004, lng: -10.797, color: "#10B981" },

  // Guyana
  { name: "Georgetown", lat: 6.8013, lng: -58.1551, color: "#EF4444" },

  // Additional global connections
  { name: "London", lat: 51.5074, lng: -0.1278, color: "#8B5CF6" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: "#06B6D4" },
];

// Convert lat/lng to 3D coordinates
function latLngToVector3(lat: number, lng: number, radius: number = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Earth texture URLs (using NASA's Blue Marble)
const EARTH_TEXTURE_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPECULAR_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg";

// Cinematic Globe component with enhanced glow and vibrant colors
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  // Load Earth textures with fallback
  let earthTexture, normalMap, specularMap;

  try {
    [earthTexture, normalMap, specularMap] = useTexture([
      EARTH_TEXTURE_URL,
      EARTH_NORMAL_URL,
      EARTH_SPECULAR_URL,
    ]);
  } catch (error) {
    // Fallback to basic materials if textures fail to load
    console.log("Using fallback materials for Earth globe");
  }

  useFrame((state) => {
    if (meshRef.current && autoRotate && !isInteracting) {
      meshRef.current.rotation.y += 0.001;
    }

    // Animate the glow effect
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.0005;
    }
  });

  const handlePointerDown = useCallback(() => {
    setIsInteracting(true);
    setAutoRotate(false);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsInteracting(false);
    // Resume auto-rotation after a delay
    setTimeout(() => setAutoRotate(true), 3000);
  }, []);

  return (
    <group>
      {/* Outer glow layer */}
      <Sphere ref={glowRef} args={[1.08, 32, 32]}>
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Middle glow layer */}
      <Sphere args={[1.04, 32, 32]}>
        <meshBasicMaterial
          color="#34D399"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Earth Sphere */}
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {earthTexture ? (
          <meshPhongMaterial
            map={earthTexture}
            normalMap={normalMap}
            specularMap={specularMap}
            shininess={150}
            emissive="#1E40AF"
            emissiveIntensity={0.1}
            transparent={false}
          />
        ) : (
          <meshPhongMaterial
            color="#1E40AF"
            emissive="#0EA5E9"
            emissiveIntensity={0.2}
            shininess={150}
            transparent={false}
          />
        )}
      </Sphere>

      {/* Enhanced atmosphere glow */}
      <Sphere args={[1.01, 32, 32]}>
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// Arcing connection lines component with beautiful curves
function ConnectionLines() {
  const lines = useMemo(() => {
    const linePoints: THREE.Vector3[] = [];

    // Define key connections between US, Ghana, Liberia, and Guyana
    const keyConnections = [
      // US to Ghana
      { from: "New York", to: "Accra" },
      { from: "Los Angeles", to: "Kumasi" },
      { from: "Chicago", to: "Accra" },

      // US to Liberia
      { from: "New York", to: "Monrovia" },
      { from: "Miami", to: "Monrovia" },

      // US to Guyana
      { from: "New York", to: "Georgetown" },
      { from: "Miami", to: "Georgetown" },

      // Ghana to Liberia
      { from: "Accra", to: "Monrovia" },

      // Ghana to Guyana
      { from: "Accra", to: "Georgetown" },

      // Liberia to Guyana
      { from: "Monrovia", to: "Georgetown" },

      // Additional global connections
      { from: "New York", to: "London" },
      { from: "Los Angeles", to: "Tokyo" },
    ];

    keyConnections.forEach((connection) => {
      const fromLocation = locations.find(
        (loc) => loc.name === connection.from
      );
      const toLocation = locations.find((loc) => loc.name === connection.to);

      if (fromLocation && toLocation) {
        const start = latLngToVector3(fromLocation.lat, fromLocation.lng, 1.02);
        const end = latLngToVector3(toLocation.lat, toLocation.lng, 1.02);

        // Create curved arc instead of straight line
        const midPoint = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(1.3); // Arc height

        // Create smooth curve using multiple points
        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
        const curvePoints = curve.getPoints(20);

        linePoints.push(...curvePoints);
      }
    });

    return linePoints;
  }, []);

  return (
    <Line
      points={lines}
      color="#FFFFFF"
      lineWidth={3}
      transparent
      opacity={0.9}
    />
  );
}

// Glowing connection lines with pulsing effect
function GlowingConnections() {
  const lines = useMemo(() => {
    const linePoints: THREE.Vector3[] = [];

    // Create glowing connections between key countries
    const glowingConnections = [
      { from: "New York", to: "Accra" },
      { from: "Los Angeles", to: "Monrovia" },
      { from: "Miami", to: "Georgetown" },
      { from: "Accra", to: "Monrovia" },
    ];

    glowingConnections.forEach((connection) => {
      const fromLocation = locations.find(
        (loc) => loc.name === connection.from
      );
      const toLocation = locations.find((loc) => loc.name === connection.to);

      if (fromLocation && toLocation) {
        const start = latLngToVector3(fromLocation.lat, fromLocation.lng, 1.03);
        const end = latLngToVector3(toLocation.lat, toLocation.lng, 1.03);

        // Create curved arc
        const midPoint = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(1.4);

        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
        const curvePoints = curve.getPoints(30);

        linePoints.push(...curvePoints);
      }
    });

    return linePoints;
  }, []);

  return (
    <Line
      points={lines}
      color="#60A5FA"
      lineWidth={5}
      transparent
      opacity={0.6}
    />
  );
}

// Enhanced location markers with pulsing glow effects
function LocationMarkers() {
  return (
    <>
      {locations.map((location, index) => {
        const position = latLngToVector3(location.lat, location.lng, 1.05);

        return (
          <group key={index} position={position}>
            {/* Outer glow ring */}
            <Sphere args={[0.08, 8, 8]}>
              <meshBasicMaterial
                color={location.color}
                transparent
                opacity={0.1}
              />
            </Sphere>

            {/* Middle glow */}
            <Sphere args={[0.05, 8, 8]}>
              <meshBasicMaterial
                color={location.color}
                transparent
                opacity={0.2}
              />
            </Sphere>

            {/* Inner glow */}
            <Sphere args={[0.03, 8, 8]}>
              <meshBasicMaterial
                color={location.color}
                transparent
                opacity={0.4}
              />
            </Sphere>

            {/* Main marker */}
            <Sphere args={[0.02, 8, 8]}>
              <meshStandardMaterial
                color={location.color}
                emissive={location.color}
                emissiveIntensity={0.5}
              />
            </Sphere>

            {/* Label with glow */}
            <Text
              position={[0, 0.15, 0]}
              fontSize={0.05}
              color={location.color}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#FFFFFF"
            >
              {location.name}
            </Text>
          </group>
        );
      })}
    </>
  );
}

// Star field background component
function StarField() {
  const stars = useMemo(() => {
    const starPositions = [];
    for (let i = 0; i < 200; i++) {
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    return starPositions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={stars.length / 3}
          array={new Float32Array(stars)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#FFFFFF" size={0.02} transparent opacity={0.8} />
    </points>
  );
}

// Main 3D Globe component
export default function Globe3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Cinematic lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[2, 2, 2]}
          intensity={1.5}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-2, -2, -2]} intensity={0.8} color="#60A5FA" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#34D399" />

        {/* Orbit controls for manual interaction */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          rotateSpeed={0.8}
          minDistance={1.5}
          maxDistance={4}
          autoRotate={false}
          autoRotateSpeed={0.3}
        />

        {/* Star field background */}
        <StarField />

        {/* Main globe and connections */}
        <Globe />
        <GlowingConnections />
        <ConnectionLines />
        <LocationMarkers />
      </Canvas>
    </div>
  );
}
