import { FaceModelsChecker } from "@/components/face-models-checker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Setup</h1>

      <div className="grid gap-6">
        <FaceModelsChecker />

        <Card>
          <CardHeader>
            <CardTitle>Face Recognition Setup Instructions</CardTitle>
            <CardDescription>Follow these steps to set up face recognition in your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Download the face-api.js model files</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You need to download the following model files from the face-api.js GitHub repository:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>tiny_face_detector_model-weights_manifest.json</li>
                <li>tiny_face_detector_model-shard1</li>
                <li>face_landmark_68_model-weights_manifest.json</li>
                <li>face_landmark_68_model-shard1</li>
                <li>face_recognition_model-weights_manifest.json</li>
                <li>face_recognition_model-shard1</li>
                <li>face_recognition_model-shard2</li>
              </ul>
              <p className="text-sm mt-2">
                <a
                  href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download from GitHub
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">2. Create the models directory</h3>
              <p className="text-sm text-muted-foreground">
                Create a <code className="bg-gray-100 px-1 rounded">models</code> folder in your{" "}
                <code className="bg-gray-100 px-1 rounded">public</code> directory.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">3. Copy the model files</h3>
              <p className="text-sm text-muted-foreground">
                Copy all the downloaded model files into the{" "}
                <code className="bg-gray-100 px-1 rounded">public/models</code> folder.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">4. Restart your application</h3>
              <p className="text-sm text-muted-foreground">
                Restart your application and use the checker above to verify that all model files are correctly
                installed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

