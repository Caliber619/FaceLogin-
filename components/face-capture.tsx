"use client"

import { useRef, useState, useEffect } from "react"
import * as faceapi from "face-api.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Camera, Check } from "lucide-react"

interface FaceCaptureProps {
  onCapture: (faceDescriptor: Float32Array) => void
  buttonText?: string
}

export function FaceCapture({ onCapture, buttonText = "Capture Face" }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [isCaptured, setIsCaptured] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const loadModels = async () => {
      setIsModelLoading(true)

      try {
        console.log("Starting to load face-api.js models...")

        // Load face-api models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ])

        console.log("Face-api.js models loaded successfully")
        setIsModelLoading(false)
      } catch (error) {
        console.error("Error loading face-api.js models:", error)
        alert("Failed to load face recognition models. Please make sure the model files are correctly installed.")
        setIsModelLoading(false)
      }
    }

    loadModels()

    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startVideo = async () => {
    setIsLoading(true)

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }

      setStream(newStream)
    } catch (err) {
      console.error("Error accessing camera:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isModelLoading) return

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (detections) {
      // Draw face detection on canvas
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      }

      faceapi.matchDimensions(canvasRef.current, displaySize)

      const resizedDetections = faceapi.resizeResults(detections, displaySize)

      canvasRef.current.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)

      // Pass face descriptor to parent component
      onCapture(detections.descriptor)
      setIsCaptured(true)

      // Stop the stream after capturing
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
    } else {
      alert("No face detected. Please position your face in the center of the camera.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden mb-4">
          {isModelLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading face recognition models...</span>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                onLoadedMetadata={() => setIsLoading(false)}
              />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

              {!stream && !isCaptured && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Button onClick={startVideo}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
              )}

              {isCaptured && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <div className="flex flex-col items-center">
                    <Check className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-lg font-medium">Face captured successfully!</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handleCapture}
          disabled={isLoading || isModelLoading || !stream || isCaptured}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isCaptured ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Face Captured
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

