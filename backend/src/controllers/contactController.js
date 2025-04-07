const { sendContactEmail } = require('../services/emailService');

exports.submitContact = async (req, res) => {
  try {
    const contactData = req.body;
    await sendContactEmail(contactData);
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};