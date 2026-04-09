const express = require("express");
const multer = require("multer");
const db = require("../database");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfName = String(file.originalname || "")
      .toLowerCase()
      .endsWith(".pdf");

    if (isPdfMime || isPdfName) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF files are allowed"));
  },
});

router.post("/upload", (req, res) => {
  upload.single("file")(req, res, (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ error: uploadErr.message || "File upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const query = `
      INSERT INTO proof_documents (file_name, mime_type, file_data)
      VALUES (?, ?, ?)
    `;

    db.run(
      query,
      [
        req.file.originalname,
        req.file.mimetype || "application/pdf",
        req.file.buffer,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const downloadUrl = `${req.protocol}://${req.get("host")}/api/proof-documents/${this.lastID}/download`;

        res.json({
          id: this.lastID,
          fileName: req.file.originalname,
          downloadUrl,
        });
      },
    );
  });
});

router.get("/:id/download", (req, res) => {
  const query = `
    SELECT file_name, mime_type, file_data
    FROM proof_documents
    WHERE id = ?
  `;

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: "Document not found" });
    }

    const safeFileName = String(row.file_name || "proof-document.pdf").replace(/"/g, "");

    res.setHeader("Content-Type", row.mime_type || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
    res.send(row.file_data);
  });
});

module.exports = router;
