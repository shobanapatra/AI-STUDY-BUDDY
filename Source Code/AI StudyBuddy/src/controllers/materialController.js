const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const Material = require('../models/Material');
const {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
} = require('../utils/gemini');

// Extract text from an uploaded file
const extractTextFromFile = async (filePath, originalName) => {
  const extension = path.extname(originalName).toLowerCase();

  if (extension === '.pdf') {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);

    return pdfData.text;
  }

  if (extension === '.docx') {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return result.value;
  }

  if (extension === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  }

  throw new Error(
    'Unsupported file type. Please upload a PDF, DOCX, or TXT file.'
  );
};

// Upload a new study material
exports.uploadMaterial = async (req, res) => {
  try {
    const { title, originalText } = req.body;

    let extractedText = originalText || '';

    // If a file was uploaded, extract its text
    if (req.file) {
      extractedText = await extractTextFromFile(
        req.file.path,
        req.file.originalname
      );
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        message: 'No readable text was found in the uploaded file.',
      });
    }

    const material = new Material({
      title,
      originalText: extractedText,
      filePath: req.file ? req.file.path : null,
      user: req.user.id,
    });

    await material.save();

    res.status(201).json(material);
  } catch (error) {
    console.error('FILE UPLOAD ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all study materials for the logged-in user
exports.getUserMaterials = async (req, res) => {
  try {
    const materials = await Material.find({
      user: req.user.id,
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Generate AI Summary
exports.getSummary = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    const summary = await generateSummary(material.originalText);

    console.log('SUMMARY FROM GEMINI:', summary);

    material.summary = summary;

    await material.save();

    console.log('SUMMARY SAVED TO DATABASE');

    res.json({ summary });
  } catch (error) {
    console.error('SUMMARY GENERATION ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Generate AI Flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    const flashcards = await generateFlashcards(
      material.originalText
    );

    material.flashcards = flashcards;

    await material.save();

    res.json({ flashcards });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Generate AI Quiz
exports.getQuiz = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    const quiz = await generateQuiz(
      material.originalText
    );

    material.quiz = quiz;

    await material.save();

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Generate AI Study Plan
exports.getStudyPlan = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    const studyPlan = await generateStudyPlan(
      material.originalText
    );

    material.studyPlan = studyPlan;

    await material.save();

    res.json({ studyPlan });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a single study material
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!material) {
      return res.status(404).json({
        message: 'Material not found',
      });
    }

    res.json({ material });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};