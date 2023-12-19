import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import useGame from './stores/useGame.js'
import { FORWARD, JUMP, LEFT, RIGHT, WALK } from 'constants.js'

// import { blockCount } from './Experience'

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls()

  const body = useRef()

  const { rapier, world } = useRapier()

  const rapierWorld = world.raw()

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(50, 50, 200))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const blocksCount = useGame((state) => state.blocksCount)
  const direction = useGame((state) => state.direction)
  // useGame((state) => console.log(state))

  // console.log(direction);
  const [canJump, setCanJump] = useState(false)
  // Function to jump
  const jump = () => {
    // console.log('Yes, jump!')
    // body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })

    const origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = rapierWorld.castRay(ray, 10, true)

    if (hit?.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }
  }

  // Function to reset
  const reset = () => {
    // console.log('reset')
    body.current.setTranslation({ x: 0, y: 1, z: 0 })
    body.current.setLinvel({ x: 0, y: 0, z: 0 })
    body.current.setAngvel({ x: 0, y: 0, z: 0 })
    // body.current.setRotation({ x: 0, y: 0, z: 0, w: 1 })
  }

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        // console.log('phase changes to', value)
        if (value === 'ready') reset()
      }
    )

    const unsubscribeForward = useGame.subscribe(
      (state) => state.direction,
      (value) => {
        if (value.includes(FORWARD)) start()
      }
    )

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump()
      }
    )
    // const unsubscribeAny = subscribeKeys(() => {
    //   // console.log('any key down')
    //   start()
    // })

    return () => {
      unsubscribeReset()
      unsubscribeJump()
      unsubscribeForward()
      // unsubscribeAny()
    }
  }, [subscribeKeys, jump, reset])

  useFrame((state, delta) => {
    // const myState = state.get()
    // console.log('🚀 ~ file: Player.js ~ line 51 ~ useFrame ~ myState', myState)
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.1 * delta
    const torqueStrength = 0.1 * delta

    // Detection
    if (direction.includes(RIGHT)) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }
    if (direction.includes(LEFT)) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    if (direction.includes(FORWARD)) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (direction.includes(WALK)) setCanJump(true) //Can jump only if walking
    else setCanJump(false) //Can't jump if not walking

    // Jump only if canJump is set to true
    if (direction.includes(JUMP) && canJump) {
      jump()
      setCanJump(false) //Can't jump again until walking again
    }

    //Controls
    // if (forward) {
    //   impulse.z -= impulseStrength
    //   torque.x -= torqueStrength
    // }

    // if (rightward) {
    //   impulse.x += impulseStrength
    //   torque.z -= torqueStrength
    // }

    // if (backward) {
    //   impulse.z += impulseStrength
    //   torque.x += torqueStrength
    // }

    // if (leftward) {
    //   impulse.x -= impulseStrength
    //   torque.z += torqueStrength
    // }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)

    const bodyPosition = body.current.translation()

    //Cross finish line
    // if (bodyPosition.z < -(blockCount * 4 + 2)) {
    //   console.log('You Win!!!!!!!')
    // }

    /**
     * Phases of the game
     */
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      // console.log('🎉🎉 You Win!!! 🎉🎉')
      end()
    }

    if (bodyPosition.y < -4) {
      // console.log('AAAAHHHH!!!')
      restart()
    }
    //Camera position
    const cameraPosition = new THREE.Vector3()
    const cameraTarget = new THREE.Vector3()

    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 4.25
    cameraPosition.y += 1.2

    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    //Smooth camera animation and adjust for different frame rate
    // smoothedCameraPosition.lerp(cameraPosition, 0.1)
    // smoothedCameraTarget.lerp(cameraTarget, 0.1)
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    // state.camera.position.copy(cameraPosition)
    // state.camera.lookAt(cameraTarget)
    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
  })

  return (
    <>
      <RigidBody
        ref={body}
        colliders="ball"
        restitution={0.2}
        friction={1}
        position={[0, 1, 0]}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  )
}
