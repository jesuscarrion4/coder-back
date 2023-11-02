import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/images");
  },
  filename: function (req, file, cb) {
    // Genera un nombre de archivo único utilizando UUID
    const uniqueFilename = uuidv4();
    // Obtén la extensión del archivo original
    const fileExtension = file.originalname.split(".").pop();
    // Combina el nombre único con la extensión
    const finalFilename = `${uniqueFilename}.${fileExtension}`;
    cb(null, finalFilename);
  },
});

// Agrega limitaciones de tamaño y tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

export const imageUploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024, // Limita el tamaño del archivo a 1MB
  },
});