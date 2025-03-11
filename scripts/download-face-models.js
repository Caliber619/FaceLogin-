const fs = require("fs")
const path = require("path")
const https = require("https")

const MODELS_DIR = path.join(process.cwd(), "public", "models")
const BASE_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

const MODEL_FILES = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
]

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  console.log(`Creating directory: ${MODELS_DIR}`)
  fs.mkdirSync(MODELS_DIR, { recursive: true })
}

// Download each model file
MODEL_FILES.forEach((file) => {
  const url = `${BASE_URL}/${file}`
  const filePath = path.join(MODELS_DIR, file)

  console.log(`Downloading ${url} to ${filePath}`)

  const fileStream = fs.createWriteStream(filePath)

  https
    .get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download ${file}: ${response.statusCode} ${response.statusMessage}`)
        fs.unlinkSync(filePath) // Remove the file if download failed
        return
      }

      response.pipe(fileStream)

      fileStream.on("finish", () => {
        fileStream.close()
        console.log(`Downloaded ${file} successfully`)
      })
    })
    .on("error", (err) => {
      fs.unlinkSync(filePath) // Remove the file if download failed
      console.error(`Error downloading ${file}: ${err.message}`)
    })
})

console.log("Download process started. Please wait for all files to complete downloading.")

