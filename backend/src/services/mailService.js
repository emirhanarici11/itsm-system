// Şimdilik mock servis — ileride Microsoft Graph API ile değişecek
const sentMails = [];

const mailService = {
  // Mail gönder
  sendReply: async (to, subject, body) => {
    const mail = {
      id: sentMails.length + 1,
      to,
      subject: `RE: ${subject}`,
      body,
      sentAt: new Date().toISOString()
    };
    sentMails.push(mail);
    console.log(`Mail gönderildi → ${to}`);
    return mail;
  },

  // Gönderilen mailleri getir
  getSentMails: () => {
    return sentMails;
  }
};

module.exports = mailService;