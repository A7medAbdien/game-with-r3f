import './style.css'
import './GamePart.css'
import { KeyboardControls, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Experience from './game-part/Experience.js'
import Interface from './game-part/Interface.js'
import { Perf } from 'r3f-perf'

export default function GamePart() {
    return (
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
                { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
                { name: 'jump', keys: ['Space'] },
            ]}
        >
            <Canvas
                shadows
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [2.5, 4, 6],
                }}
            >
                {/* <Perf position="top-left" /> */}

                <PerformanceMonitor />
                <Experience />
            </Canvas>
            <Interface />
        </KeyboardControls>
    )
};
