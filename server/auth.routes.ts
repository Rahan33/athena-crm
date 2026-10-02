import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

const companies: any[] = [];
const otpStore: any = {};
let transporter: any;

nodemailer.createTestAccount().then((account) => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });
}).catch(console.error);

router.post('/company-register', (req, res) => {
  const { companyName, email, password } = req.body;
  if (!companyName || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (companies.find(c => c.email === email)) return res.status(400).json({ error: 'Already registered' });
  
  companies.push({ companyName, email, password, role: 'Client' });
  res.json({ message: 'Registration successful' });
});

router.post('/company-login', async (req, res) => {
  const { email, password } = req.body;
  const company = companies.find(c => c.email === email && c.password === password);
  if (!company) return res.status(401).json({ error: 'Invalid email or password' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
  console.log('[OTP] For', email, ':', otp);

  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: '"Antigravity CRM" <noreply@antigravity.com>',
        to: email,
        subject: 'Your Login OTP',
        text: 'Your OTP is: ' + otp,
      });
      return res.json({ message: 'OTP sent', previewUrl: nodemailer.getTestMessageUrl(info) });
    }
  } catch (err) {}
  res.json({ message: 'OTP generated', fallbackOtp: otp });
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record || Date.now() > record.expires || record.otp !== otp) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  delete otpStore[email];
  const company = companies.find(c => c.email === email);
  res.json({ user: { email: company.email, companyName: company.companyName, role: company.role } });
});

export default router;
