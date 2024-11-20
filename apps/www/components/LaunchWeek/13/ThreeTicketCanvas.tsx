'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { cn } from 'ui'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const ThreeTicketCanvas: React.FC<{
  username: string
  className?: string
  ticketType?: 'regular' | 'platinum' | 'secret'
  ticketPosition?: 'left' | 'right'
}> = ({
  username = 'Francesco Sansalvadore',
  className,
  ticketType = 'regular',
  ticketPosition = 'right',
}) => {
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme?.includes('dark')!

  const canvasRef = useRef<HTMLDivElement>(null)
  const ticketRef = useRef<THREE.Mesh | null>(null)
  const animationFrameRef = useRef<number>()
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const targetScale = useRef<number>(0)
  const isFlipped = useRef(false) // Tracks the flipped state
  const dragStartX = useRef<number | null>(null)
  const dragDelta = useRef(0)
  const isDragging = useRef(false)
  const flipDelta = 100 // Threshold for flipping
  const DISPLAY_NAME = username?.split(' ').reverse() || []
  const positionRight = ticketPosition === 'right'
  const isPlatinum = ticketType === 'platinum'
  const isSecret = ticketType === 'secret'
  const LINE_HEIGHT = 1.5
  const MIN_CANVAS_HEIGHT = 600
  const MOUSE_DOWN_SCALE_VARIATION = 0.05
  const TICKET_FONT_PADDING_LEFT = -6.4

  const CONFIG = {
    regular: {
      ticketColor: isDarkTheme ? 0xf3f3f3 : 0x121212,
      ticketForeground: isDarkTheme ? 0x171717 : 0xffffff,
    },
    platinum: {
      ticketColor: isDarkTheme ? 0x9ea1a1 : 0xf3f3f3,
      ticketForeground: 0x0f0f0f,
    },
    secret: {
      ticketColor: isDarkTheme ? 0xe7a938 : 0xf2c66d,
      ticketForeground: 0x0f0f0f,
    },
  }

  const isDesktop = (width: number) => width > 1024
  const getTicketScale = (width: number) => (isDesktop(width) ? 0.35 : 0.3)
  const getTicketXPosition = (width: number, isRight: boolean) =>
    isDesktop(width) ? (isRight ? 5 : -5) : 0

  const TEXT_Z_POSITION = 0

  const FOOTER_CONTENT = [
    {
      text: 'LAUNCH WEEK 13',
      position: { x: TICKET_FONT_PADDING_LEFT, y: -6.8, z: TEXT_Z_POSITION },
      size: 0.59,
    },
    {
      text: '2-6 DEC / 7AM PT',
      position: { x: TICKET_FONT_PADDING_LEFT, y: -7.7, z: TEXT_Z_POSITION },
      size: 0.55,
    },
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    let scale = getTicketScale(window.innerWidth)
    targetScale.current = scale
    const calculateDesktopWidth = () => window.innerWidth
    const initialCanvasWidth = calculateDesktopWidth()
    const initialCanvasHeight =
      window.innerHeight < MIN_CANVAS_HEIGHT ? MIN_CANVAS_HEIGHT - 65 : window.innerHeight - 65
    const ticketYIdleRotation = 0

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      25,
      initialCanvasWidth / initialCanvasHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(initialCanvasWidth, initialCanvasHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    canvasRef.current.appendChild(renderer.domElement)

    // Camera setup
    const cameraDistance = 30
    camera.position.z = cameraDistance

    // Rest of your existing setup code (loader, materials, etc.)
    const gltfLoader = new GLTFLoader()

    // Texture from Freepik: https://www.freepik.com/free-photo/golden-wall-background_1213228.htm
    const metalTexture = new THREE.TextureLoader().load(
      '/images/launchweek/13/ticket/metal-texture.jpg'
    )
    const goldTexture = new THREE.TextureLoader().load(
      '/images/launchweek/13/ticket/gold-texture.jpg'
    )

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: CONFIG[ticketType].ticketColor,
      map: isSecret ? goldTexture : isPlatinum ? metalTexture : undefined,
      bumpMap: isSecret ? goldTexture : isPlatinum ? metalTexture : undefined,
      metalnessMap: isSecret ? goldTexture : metalTexture,
      roughnessMap: isSecret ? goldTexture : metalTexture,
      metalness: isSecret ? 1 : isPlatinum ? 0.9 : isDarkTheme ? 0.2 : 0.9,
      roughness: isSecret ? 0.1 : isPlatinum ? 0.12 : isDarkTheme ? 0.2 : 0.5,
      bumpScale: isSecret ? 0.85 : isPlatinum ? 0.45 : undefined,
    })

    // Load Ticket model, fonts and textures
    let ticket3DImport: THREE.Mesh
    const ticketGroup = new THREE.Group()
    const ticketScale = getTicketScale(window.innerWidth)
    ticketGroup.scale.set(ticketScale, ticketScale, ticketScale)
    ticketGroup.position.x = getTicketXPosition(window.innerWidth, positionRight)

    gltfLoader.load('/images/launchweek/13/ticket/3D-ticket.glb', (gltf) => {
      ticket3DImport = gltf.scene.children[0] as THREE.Mesh
      ticket3DImport.rotation.x = Math.PI * 0.5
      ticket3DImport.traverse((child) => {
        if (child) {
          // @ts-ignore
          child.material = metalMaterial
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      ticketGroup.add(ticket3DImport)
      scene.add(ticketGroup)
      ticketRef.current = ticket3DImport
      camera.lookAt(ticket3DImport.position)
    })

    const textMaterial = new THREE.MeshStandardMaterial({
      color: CONFIG[ticketType].ticketForeground,
      metalness: 0.2,
      roughness: 0.35,
    })

    // Load font and add text geometry
    const fontLoader = new FontLoader()

    // Load Inter font
    fontLoader.load('/images/launchweek/13/ticket/Inter_Regular.json', (font) => {
      DISPLAY_NAME.map((text, index) => {
        const textGeometry = new TextGeometry(text, {
          font,
          size: 1.1,
          height: 0.2,
        })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textMesh.updateMatrix()
        textMesh.position.set(
          TICKET_FONT_PADDING_LEFT,
          -5 + LINE_HEIGHT * (index + 1),
          TEXT_Z_POSITION
        )
        textMesh.castShadow = true
        ticketGroup.add(textMesh)
      })
    })

    // Load mono font
    fontLoader.load('/images/launchweek/13/ticket/SourceCodePro_Regular.json', (font) => {
      FOOTER_CONTENT.map((line) => {
        const textGeometry = new TextGeometry(line.text, {
          font,
          size: line.size,
          height: 0.2,
        })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textMesh.updateMatrix()
        textMesh.position.set(line.position.x, line.position.y, line.position.z)
        textMesh.castShadow = true
        ticketGroup.add(textMesh)
      })
    })

    ticketGroup.updateMatrix()

    // Environment Map
    const envMapLoader = new THREE.TextureLoader()
    envMapLoader.load('/images/launchweek/13/ticket/env-map.jpg', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      metalMaterial.envMap = texture
      metalMaterial.envMapIntensity = isSecret ? (isDarkTheme ? 3.2 : 2.2) : isDarkTheme ? 3 : 0.5
      metalMaterial.blending = THREE.NormalBlending
    })

    // Lights
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      isSecret ? (isDarkTheme ? 3 : 2) : isPlatinum ? (isDarkTheme ? 10 : 8) : 2
    )
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff, isDarkTheme ? 20 : 4)
    spotLight.position.z = ticketGroup.position.z + 4
    spotLight.position.x = ticketGroup.position.x + 10
    spotLight.angle = (Math.PI / 2) * 0.5
    spotLight.castShadow = true
    spotLight.shadow.mapSize.set(1024, 1024)
    spotLight.shadow.camera.near = 5
    spotLight.shadow.camera.far = 15
    spotLight.lookAt(ticketGroup.position)
    scene.add(spotLight)

    const getTicketScreenPosition = () => {
      if (!ticketRef.current) return null

      const vector = new THREE.Vector3()
      ticketRef.current.getWorldPosition(vector)
      vector.project(camera)

      const x = (vector.x * 0.5 + 0.5) * initialCanvasWidth
      const y = -(vector.y * 0.5 - 0.5) * initialCanvasHeight

      return { x, y }
    }

    const animate = () => {
      // Smooth rotation
      ticketGroup.rotation.x += (targetRotation.current.x - ticketGroup.rotation.x) * 0.1
      ticketGroup.rotation.y +=
        ticketYIdleRotation + (targetRotation.current.y - ticketGroup.rotation.y) * 0.1
      if (ticketGroup.scale.x < targetScale.current) {
        scale += 0.001
      } else if (ticketGroup.scale.x > targetScale.current) {
        scale -= 0.001
      } else {
        scale = targetScale.current
      }
      ticketGroup.scale.set(scale, scale, scale)
      renderer.render(scene, camera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    const handleMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      handlePointerMove(touch.clientX, touch.clientY)
    }
    // Tilt and drag logic
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!canvasRef.current) return
      if (isDragging.current) {
        // Update drag delta
        if (dragStartX.current !== null) {
          dragDelta.current = clientX - dragStartX.current
          ticketGroup.rotation.y = targetRotation.current.y + dragDelta.current * 0.01
        }
      } else {
        // Get canvas bounds
        const canvasRect = canvasRef.current.getBoundingClientRect()

        // Calculate center of the canvas
        const centerX = canvasRect.left + canvasRect.width / 2
        const centerY = canvasRect.top + canvasRect.height / 2
        const ticketPosition = getTicketScreenPosition() || { x: centerX, y: centerY }

        // Calculate distance from cursor to center of ticket
        const deltaX = clientX - (canvasRect.left + ticketPosition.x)
        const deltaY = clientY - (canvasRect.top + ticketPosition.y)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // Maximum distance for sensitivity calculation (diagonal of the canvas)
        const maxDistance = Math.sqrt(
          Math.pow(canvasRect.width / 2, 2) + Math.pow(canvasRect.height / 2, 2)
        )

        // Calculate sensitivity based on distance (inverse relationship)
        const sensitivity = 0.002 * (1 - Math.min(distance / maxDistance, 1))

        // Update target rotation with distance-based sensitivity
        targetRotation.current.y = deltaX * sensitivity + (isFlipped.current ? Math.PI : 0)
        targetRotation.current.x = deltaY * sensitivity * 0.3
      }
    }

    const handleMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX)
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      handlePointerDown(touch.clientX)
    }
    const handlePointerDown = (clientX: number) => {
      isDragging.current = true
      dragStartX.current = clientX
      targetScale.current += MOUSE_DOWN_SCALE_VARIATION
    }

    const handleMouseUp = () => handlePointerUp()
    const handleTouchEnd = () => handlePointerUp()
    const handlePointerUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      targetScale.current -= MOUSE_DOWN_SCALE_VARIATION

      if (Math.abs(dragDelta.current) > flipDelta) {
        // Flip the ticket
        isFlipped.current = !isFlipped.current
        // targetRotation.current.y += isFlipped.current ? Math.PI : -Math.PI
      } else {
        // Reset rotation
        ticketGroup.rotation.y = targetRotation.current.y
      }

      // Reset drag state
      dragStartX.current = null
      dragDelta.current = 0
    }

    // Reset handler with smooth transition
    const resetRotation = () => {
      targetRotation.current = { x: 0, y: 0 }
      isFlipped.current = false
    }

    // Handle window resize
    const handleResize = () => {
      const newWidth = calculateDesktopWidth()
      ticketGroup.position.x = getTicketXPosition(window.innerWidth, positionRight)
      const tickeScale = getTicketScale(window.innerWidth)
      ticketGroup.scale.set(tickeScale, tickeScale, tickeScale)
      camera.aspect =
        newWidth /
        (window.innerHeight < MIN_CANVAS_HEIGHT ? MIN_CANVAS_HEIGHT - 65 : window.innerHeight - 65)
      camera.updateProjectionMatrix()
      renderer.setSize(
        newWidth,
        window.innerHeight < MIN_CANVAS_HEIGHT ? MIN_CANVAS_HEIGHT - 65 : window.innerHeight - 65
      )
    }

    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', resetRotation)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', resetRotation)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', resetRotation)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', resetRotation)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      canvasRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [username, isDarkTheme, ticketType, isFlipped.current])

  return (
    <div
      className={cn(
        'w-screen absolute inset-0 lg:h-full flex justify-end items-center overflow-hidden pointer-events-none',
        className
      )}
    >
      <div ref={canvasRef} className="w-full lg:h-full !cursor-none" />
    </div>
  )
}

export default ThreeTicketCanvas
