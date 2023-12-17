import './style.css'
import './GamePart.css'
import { KeyboardControls, PerformanceMonitor } from '@react-three/drei'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './game-part/Experience.js'
import Interface from './game-part/Interface.js'
import { Perf } from 'r3f-perf'
import GamePart from 'GamePart'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <GamePart />
)
