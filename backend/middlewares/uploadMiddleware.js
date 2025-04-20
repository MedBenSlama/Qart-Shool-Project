import multer from "multer";
import path from "path";
import log from "../utils/logger.js";

const ALLOWED_FILE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    const error = new Error(
      "Invalid file type. Only JPEG and PNG images are allowed."
    );
    error.status = 400;
    log.warn({ mimetype: file.mimetype }, "Invalid file type uploaded");
    cb(error, false);
  }
};

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${folder}`),
    filename: (req, file, cb) => {
      const extension = ALLOWED_FILE_TYPES[file.mimetype];
      cb(null, Date.now() + extension);
    },
  });

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    log.error({ err }, "File upload error");
    return res.status(400).json({ error: "File upload error: " + err.message });
  } else if (err) {
    log.error({ err }, "Upload middleware error");
    return res.status(err.status || 500).json({ error: err.message });
  }
  next();
};

export const avatarUpload = multer({
  storage: makeStorage("avatars"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const qartUpload = multer({
  storage: makeStorage("qarts"),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export { handleMulterError };
