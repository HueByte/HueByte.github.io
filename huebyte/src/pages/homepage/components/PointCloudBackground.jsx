import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const PointCloudBackground = () => {
	const containerRef = useRef(null);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const cameraRef = useRef(null);
	const pointsRef = useRef(null);
	const animationFrameRef = useRef(null);
	const [currentShape, setCurrentShape] = useState("Torus");

	useEffect(() => {
		if (!containerRef.current) return;

		// Scene setup
		const scene = new THREE.Scene();
		sceneRef.current = scene;

		// Camera setup
		const camera = new THREE.PerspectiveCamera(
			60,
			containerRef.current.clientWidth / containerRef.current.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 8;
		cameraRef.current = camera;

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: "high-performance",
		});
		renderer.setSize(
			containerRef.current.clientWidth,
			containerRef.current.clientHeight
		);
		renderer.setPixelRatio(window.devicePixelRatio);
		containerRef.current.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// Create particle system
		const particleCount = 2000;

		// Define shapes
		const createDNA = () => {
			const positions = new Float32Array(particleCount * 3);
			let seed = 11111;
			const seededRandom = () => {
				seed = (seed * 9301 + 49297) % 233280;
				return seed / 233280;
			};

			for (let i = 0; i < particleCount; i++) {
				const t = (i / particleCount) * Math.PI * 6;
				const radius = 1.5 + seededRandom() * 0.2;

				// Create double helix
				const strand = i % 2;
				const offset = strand * Math.PI;

				positions[i * 3] =
					radius * Math.cos(t + offset) + seededRandom() * 0.1 - 0.05;
				positions[i * 3 + 1] =
					(t / Math.PI) * 1.5 - 4.5 + seededRandom() * 0.1 - 0.05;
				positions[i * 3 + 2] =
					radius * Math.sin(t + offset) + seededRandom() * 0.1 - 0.05;
			}
			return positions;
		};

		const createTorus = () => {
			const positions = new Float32Array(particleCount * 3);
			let seed = 77777;
			const seededRandom = () => {
				seed = (seed * 9301 + 49297) % 233280;
				return seed / 233280;
			};

			for (let i = 0; i < particleCount; i++) {
				const theta = seededRandom() * Math.PI * 2;
				const phi = seededRandom() * Math.PI * 2;
				const majorRadius = 2;
				const minorRadius = 0.8;

				positions[i * 3] =
					(majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
				positions[i * 3 + 1] =
					(majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
				positions[i * 3 + 2] = minorRadius * Math.sin(phi);
			}
			return positions;
		};

		const createHelix = () => {
			const positions = new Float32Array(particleCount * 3);
			let seed = 54321;
			const seededRandom = () => {
				seed = (seed * 9301 + 49297) % 233280;
				return seed / 233280;
			};

			for (let i = 0; i < particleCount; i++) {
				const t = (i / particleCount) * Math.PI * 8;
				const radius = 1.5 + seededRandom() * 0.3;

				positions[i * 3] = radius * Math.cos(t);
				positions[i * 3 + 1] = t / 4 - 3;
				positions[i * 3 + 2] = radius * Math.sin(t);
			}
			return positions;
		};

		const createCube = () => {
			const positions = new Float32Array(particleCount * 3);
			// Create a simple random number generator with seed
			let seed = 12345;
			const seededRandom = () => {
				seed = (seed * 9301 + 49297) % 233280;
				return seed / 233280;
			};

			for (let i = 0; i < particleCount; i++) {
				const x = (seededRandom() - 0.5) * 4;
				const y = (seededRandom() - 0.5) * 4;
				const z = (seededRandom() - 0.5) * 4;

				const maxVal = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
				const scale = 2 / maxVal;

				positions[i * 3] = x * scale;
				positions[i * 3 + 1] = y * scale;
				positions[i * 3 + 2] = z * scale;
			}
			return positions;
		};

		const createWave = () => {
			const positions = new Float32Array(particleCount * 3);
			const gridSize = Math.ceil(Math.sqrt(particleCount));
			for (let i = 0; i < particleCount; i++) {
				const x = ((i % gridSize) / gridSize) * 6 - 3;
				const z = (Math.floor(i / gridSize) / gridSize) * 6 - 3;
				const y = Math.sin(x * 0.8) * Math.cos(z * 0.8) * 1.5;

				positions[i * 3] = x;
				positions[i * 3 + 1] = y;
				positions[i * 3 + 2] = z;
			}
			return positions;
		};

		const createKnot = () => {
			const positions = new Float32Array(particleCount * 3);
			let seed = 33333;
			const seededRandom = () => {
				seed = (seed * 9301 + 49297) % 233280;
				return seed / 233280;
			};

			for (let i = 0; i < particleCount; i++) {
				const t = (i / particleCount) * Math.PI * 2;
				const p = 2;
				const q = 3;

				const r = Math.cos(q * t) + 2;
				positions[i * 3] =
					r * Math.cos(p * t) * 1.2 + seededRandom() * 0.15 - 0.075;
				positions[i * 3 + 1] =
					r * Math.sin(p * t) * 1.2 + seededRandom() * 0.15 - 0.075;
				positions[i * 3 + 2] =
					-Math.sin(q * t) * 1.2 + seededRandom() * 0.15 - 0.075;
			}
			return positions;
		};

		const createSpiral = () => {
			const positions = new Float32Array(particleCount * 3);
			let seed = 99999;
			const seededRandom = () => {
				seed = (seed * 9301 + 49297) % 233280;
				return seed / 233280;
			};

			for (let i = 0; i < particleCount; i++) {
				const t = (i / particleCount) * Math.PI * 10;
				const radius = t * 0.3 + seededRandom() * 0.1;

				positions[i * 3] = radius * Math.cos(t) + seededRandom() * 0.1 - 0.05;
				positions[i * 3 + 1] = (i / particleCount) * 6 - 3;
				positions[i * 3 + 2] =
					radius * Math.sin(t) + seededRandom() * 0.1 - 0.05;
			}
			return positions;
		};

		const shapes = [
			createTorus(),
			createHelix(),
			createCube(),
			createWave(),
			createDNA(),
			createKnot(),
			createSpiral(),
		];

		const shapeNames = [
			"Torus",
			"Helix",
			"Cube",
			"Wave",
			"DNA",
			"Knot",
			"Spiral",
		];

		// Create colors
		const colors = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount; i++) {
			const t = i / particleCount;
			colors[i * 3] = 0.8 + Math.sin(t * Math.PI) * 0.2;
			colors[i * 3 + 1] = 0.2 + Math.cos(t * Math.PI) * 0.3;
			colors[i * 3 + 2] = 0.4 + Math.sin(t * Math.PI * 2) * 0.4;
		}

		// Create geometry
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 0.05,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			sizeAttenuation: true,
			blending: THREE.AdditiveBlending,
		});

		// Create points
		const points = new THREE.Points(geometry, material);
		scene.add(points);
		pointsRef.current = points;

		// Animation variables
		let time = 0;
		let shapeIndex = 0;
		let shapeTimer = 0;
		const SHAPE_DURATION = 14; // 14 seconds stable
		const TRANSITION_DURATION = 2; // 2 seconds transition
		const TOTAL_CYCLE = SHAPE_DURATION + TRANSITION_DURATION; // 16 seconds total

		// Click interaction setup
		const handleClick = () => {
			// Only trigger transition if not already transitioning
			if (shapeTimer < SHAPE_DURATION) {
				shapeTimer = SHAPE_DURATION;
			}
		};

		containerRef.current.addEventListener("click", handleClick);

		// Animation loop
		const animate = () => {
			animationFrameRef.current = requestAnimationFrame(animate);

			time += 0.016; // Approximate 60fps delta
			shapeTimer += 0.016;

			// Rotate the point cloud (only y-axis for clean rotation)
			points.rotation.y = time * 0.1;

			// Determine if we're in transition or stable phase
			let t = 0;
			if (shapeTimer > SHAPE_DURATION) {
				// We're in transition phase
				const transitionProgress =
					(shapeTimer - SHAPE_DURATION) / TRANSITION_DURATION;
				t = Math.min(transitionProgress, 1);

				// Use smooth easing
				t = (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2;
			}

			// Reset cycle when complete - but only after transition finishes
			if (shapeTimer >= TOTAL_CYCLE) {
				shapeTimer = 0;
				const nextIndex = (shapeIndex + 1) % shapes.length;
				shapeIndex = nextIndex;
				setCurrentShape(shapeNames[nextIndex]);
			}

			// Morph between shapes
			const currentShape = shapes[shapeIndex];
			const nextShape = shapes[(shapeIndex + 1) % shapes.length];
			const positions = geometry.attributes.position.array;

			for (let i = 0; i < positions.length / 3; i++) {
				const i3 = i * 3;

				// Calculate base position (morphed between shapes)
				let x = currentShape[i3] * (1 - t) + nextShape[i3] * t;
				let y = currentShape[i3 + 1] * (1 - t) + nextShape[i3 + 1] * t;
				let z = currentShape[i3 + 2] * (1 - t) + nextShape[i3 + 2] * t;

				// Add subtle floating animation
				y += Math.sin(time * 2 + i) * 0.01;

				positions[i3] = x;
				positions[i3 + 1] = y;
				positions[i3 + 2] = z;
			}

			geometry.attributes.position.needsUpdate = true;

			// Pulse colors
			const colorAttr = geometry.attributes.color;
			for (let i = 0; i < colors.length; i += 3) {
				const brightness = 0.8 + Math.sin(time * 0.5 + i * 0.01) * 0.2;
				colorAttr.array[i] = colors[i] * brightness;
				colorAttr.array[i + 1] = colors[i + 1] * brightness;
				colorAttr.array[i + 2] = colors[i + 2] * brightness;
			}
			colorAttr.needsUpdate = true;

			renderer.render(scene, camera);
		};

		animate();

		// Handle window resize
		const handleResize = () => {
			if (!containerRef.current) return;

			camera.aspect =
				containerRef.current.clientWidth / containerRef.current.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(
				containerRef.current.clientWidth,
				containerRef.current.clientHeight
			);
		};

		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			if (containerRef.current) {
				containerRef.current.removeEventListener("click", handleClick);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (containerRef.current && renderer.domElement) {
				containerRef.current.removeChild(renderer.domElement);
			}
			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, []);

	return (
		<>
			<div ref={containerRef} className="point-cloud-container" />
			<div className="shape-debug">Current Shape: {currentShape}</div>
		</>
	);
};

export default PointCloudBackground;
