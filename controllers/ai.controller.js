const model = require("../services/gemini.service");

const getSuggestions = async (req, res) => {
  try {
    const { text } = req.body;

    const result = await model.generateContent(
      `
          Suggest 3 next phrases.
          Input:
          ${text}
          Return JSON array only.
          `,
    );

    const response = result.response.text();

    res.json({
      success: true,
      suggestions: JSON.parse(response),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  getSuggestions,
};
