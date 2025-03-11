"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react"

const MODEL_FILES = [
  "/models/tiny_face_detector_model-weights_manifest.json",
  "/models/tiny_face_detector_model-shard1",
  "/models/face_landmark_68_model-weights_manifest.json",
  "/models/face_landmark_68_model-shard1",
  "/models/face_recognition_model-weights_manifest.json",
  "/models/face_recognition_model-shard1",
  "/models/face_recognition_model-shard2",
]

export function FaceModelsChecker() {
  const [checkResults, setCheckResults] = useState<{ [key: string]: boolean }>({})
  const [isChecking, setIsChecking] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"unchecked" | "success" | "error">("unchecked")

  const checkModels = async () => {
    setIsChecking(true)
    const results: { [key: string]: boolean } = {}

    for (const file of MODEL_FILES) {
      try {
        const response = await fetch(file, { method: "HEAD" })
        results[file] = response.ok
      } catch (error) {
        results[file] = false
      }
    }

    setCheckResults(results)

    // Check if all models are available
    const allModelsAvailable = Object.values(results).every((result) => result === true)
    setOverallStatus(allModelsAvailable ? "success" : "error")

    setIsChecking(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Face Recognition Models Check</CardTitle>
        <CardDescription>Check if the required face-api.js model files are correctly installed</CardDescription>
      </CardHeader>
      <CardContent>
        {overallStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing Model Files</AlertTitle>
            <AlertDescription>
              Some required face recognition model files are missing. Please follow the instructions below to fix this
              issue.
            </AlertDescription>
          </Alert>
        )}

        {overallStatus === "success" && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>All Models Available</AlertTitle>
            <AlertDescription>All required face recognition model files are correctly installed.</AlertDescription>
          </Alert>
        )}

        {Object.keys(checkResults).length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Model Files Status:</h3>
            <ul className="space-y-1 text-sm">
              {MODEL_FILES.map((file) => (
                <li key={file} className="flex items-center">
                  {checkResults[file] ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <span className={checkResults[file] ? "text-green-600" : "text-red-600"}>{file}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {overallStatus === "error" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-medium mb-2">How to fix:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Download the face-api.js model files from{" "}
                <a
                  href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                Create a <code className="bg-gray-100 px-1 rounded">models</code> folder in your{" "}
                <code className="bg-gray-100 px-1 rounded">public</code> directory
              </li>
              <li>
                Copy all the model files into the <code className="bg-gray-100 px-1 rounded">public/models</code> folder
              </li>
              <li>Restart your application</li>
            </ol>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkModels} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Model Files"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

