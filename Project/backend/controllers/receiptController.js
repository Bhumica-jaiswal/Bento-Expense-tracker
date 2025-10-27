const Receipt = require("../models/Receipt");
const IncomeExpense = require("../models/IncomeExpense");
const { GoogleGenAI } = require("@google/genai");

const fs = require("fs");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to convert a file to a format Gemini can understand
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
}

// @desc    Upload a receipt and extract data using Gemini
// @route   POST /api/receipts/upload
// @access  Private
const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  try {
    console.log('=== RECEIPT UPLOAD DEBUG ===');
    console.log('File received:', req.file);
    console.log('Gemini API Key set:', !!process.env.GEMINI_API_KEY);
    
    const prompt = `
      Analyze this receipt image. Extract the following details:
      - merchant: The name of the store or merchant.
      - amount: The final total amount paid, as a number.
      - date: The date of the transaction in YYYY-MM-DD format.
      - category: Suggest a likely category from this list: Groceries, Food, Shopping, Bills, Transportation, Entertainment.

      Return the result as a single, minified JSON object. For example:
      {"merchant":"Walmart","amount":42.97,"date":"2025-09-13","category":"Groceries"}
    `;

    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
    console.log('Image part created:', !!imagePart);

    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('Model initialized');
    
    const result = await model.generateContent([prompt, imagePart]);
    console.log('Gemini API response received');

    const raw = result.response?.text() ?? "";
    console.log('Raw Gemini response:', raw);

    const cleanedText = raw
      .replace(/^[\s`]*```json[\s`]*/i, "") // Remove opening ```json with spaces
      .replace(/[\s`]*```$/i, "") // Remove closing ```
      .trim();
    
    console.log('Cleaned text:', cleanedText);

    let extractedData;
    try {
      extractedData = JSON.parse(cleanedText);
      console.log('Parsed data:', extractedData);
    } catch (e) {
      console.warn("[Gemini] Invalid JSON, fallback to defaults.", e);
      console.warn("Raw text that failed to parse:", cleanedText);
      extractedData = {};
    }

    const newReceipt = new Receipt({
      user: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedData: {
        amount: extractedData.amount || 0,
        category: extractedData.category || "Miscellaneous",
        date: extractedData.date ? new Date(extractedData.date) : new Date(),
        merchant: extractedData.merchant || "Unknown Merchant",
      },
    });

    const savedReceipt = await newReceipt.save();

    // Automatically create a corresponding expense transaction
    if (savedReceipt) {
      const newTransaction = new IncomeExpense({
        user: req.user.id,
        name: savedReceipt.extractedData.merchant,
        category: savedReceipt.extractedData.category,
        cost: savedReceipt.extractedData.amount,
        addedOn: savedReceipt.extractedData.date,
        isIncome: false,
      });
      await newTransaction.save();
    }

    res.status(201).json(savedReceipt);
  } catch (error) {
    console.error("Error with Gemini API:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status
    });
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    
    res
      .status(500)
      .json({
        message: "Failed to process receipt with AI",
        error: error.message,
      });
  } finally {
    // Deleting the temporary file from the server
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file in finally block:", unlinkError);
      }
    }
  }
};

module.exports = {
  uploadReceipt,
};
