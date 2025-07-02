// const multer = require("multer");
// const path = require("path");
// const RegistrationCategory = require("../models/RegistrationCategory");
// const CategoryFieldsMap = require("../utils/categoryFieldsMap");

// const baseFields = [
//   { name: "pan_upload", maxCount: 1 },
//   { name: "aadhaar_upload", maxCount: 1 },
//   { name: "sign_upload", maxCount: 1 },
// ];

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(
//       null,
//       Date.now() + "-" + file.fieldname + path.extname(file.originalname)
//     ),
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
//   cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
// };

// // Pre-parse any files to read req.body
// const preParse = multer({ storage, fileFilter }).any();

// // Final dynamic middleware
// const dynamicFileUpload = async (req, res, next) => {
//   try {
//     const { regcategory_id } = req.body;
//     const category = await RegistrationCategory.findById(regcategory_id);
//     if (!category)
//       return res.status(400).json({ error: "Invalid regcategory_id" });

//     const dynamicFields = CategoryFieldsMap[category.name] || [];
//     const allFields = [...baseFields, ...dynamicFields];

//     const upload = multer({ storage, fileFilter }).fields(allFields);

//     upload(req, res, function (err) {
//       if (err) {
//         return res
//           .status(400)
//           .json({ error: "File upload error", details: err.message });
//       }
//       next();
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Dynamic file upload failed" });
//   }
// };

// module.exports = { preParse, dynamicFileUpload };
