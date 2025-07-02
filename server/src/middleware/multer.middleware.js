import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getDestination = (req, file, cb) => {
  let destFolder = 'uploads'

  console.log(file)

  if(!file) return

  if (file.fieldname === 'avatar') {
    destFolder = 'public/avatars'
  }
  else if (file.fieldname === 'messageImage') {
    destFolder = 'public/messages'
  }

  const fullPath = path.join(__dirname, '../../', destFolder)
  cb(null, fullPath)
}

const getFileName = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  cb(null, `${uniqueSuffix}${ext}`)
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png']
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Wrong file extention'), false)
  }
}

const storage = multer.diskStorage({
  destination: getDestination,
  filename: getFileName
})

const uploadFile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
})

export const uploadAvatar = uploadFile.single('avatar')
export const uploadMessageImage = uploadFile.single('messageImage')
