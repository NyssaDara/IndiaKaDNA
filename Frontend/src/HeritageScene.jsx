import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import { useRef } from 'react'

const MARBLE = '#f3e6d8'
const GOLD = '#d9a441'
const MAROON = '#7a1f2b'

function Minaret({ x, z }) {
  return (
    <group position={[x, 0.3, z]}>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 1.9, 24]} />
        <meshStandardMaterial color={MARBLE} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.15, 24, 16]} />
        <meshStandardMaterial color={MARBLE} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.035, 0.35, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Dome({ position, radius, stretch = 1.25 }) {
  return (
    <mesh position={position} scale={[1, stretch, 1]}>
      <sphereGeometry args={[radius, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={MARBLE} roughness={0.35} side={2} />
    </mesh>
  )
}

function Monument() {
  const group = useRef()

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.3
  })

  return (
    <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.35}>
      <group ref={group} position={[0, -1.4, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[4.6, 0.3, 4.6]} />
          <meshStandardMaterial color={MAROON} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[2.6, 0.3, 2.6]} />
          <meshStandardMaterial color={MARBLE} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[1.8, 1.1, 1.8]} />
          <meshStandardMaterial color={MARBLE} roughness={0.35} />
        </mesh>

        {[0, 1, 2, 3].map(i => (
          <mesh key={i} position={[0, 1.05, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
            <boxGeometry args={[0.5, 0.75, 1.86]} />
            <meshStandardMaterial color="#4a111c" roughness={0.7} />
          </mesh>
        ))}

        <Dome position={[0, 1.7, 0]} radius={0.8} stretch={1.3} />
        <mesh position={[0, 2.95, 0]}>
          <coneGeometry args={[0.045, 0.45, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
        </mesh>

        {[[0.72, 0.72], [-0.72, 0.72], [0.72, -0.72], [-0.72, -0.72]].map(([x, z]) => (
          <Dome key={`${x}${z}`} position={[x, 1.7, z]} radius={0.24} stretch={1.2} />
        ))}

        {[[1.85, 1.85], [-1.85, 1.85], [1.85, -1.85], [-1.85, -1.85]].map(([x, z]) => (
          <Minaret key={`${x}${z}`} x={x} z={z} />
        ))}
      </group>
    </Float>
  )
}

export default function HeritageScene() {
  return (
    <div className="heritage-scene">
      <Canvas camera={{ position: [0, 1.2, 7.5], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 5]} intensity={3} color="#fff0dc" />
        <pointLight position={[-4, -1, 3]} intensity={4} color="#e34234" />
        <Monument />
        <Sparkles count={45} scale={8} size={3} speed={0.4} color={GOLD} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={0.9} maxPolarAngle={1.8} />
      </Canvas>
    </div>
  )
}
