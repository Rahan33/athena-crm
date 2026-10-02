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
  
  companies.push({ companyName, email, password, role: 'CompanyAdmin', subUsers: [] });
  res.json({ message: 'Registration successful' });
});

router.post('/company-login', async (req, res) => {
  const { email, password, subUsername } = req.body;
  const company = companies.find(c => c.email === email);
  if (!company) return res.status(401).json({ error: 'Invalid email' });

  let valid = false;
  let loginRole = 'CompanyAdmin';
  let loginUsername = 'Admin';
  let permissions = ['all'];

  if (subUsername) {
    const subUser = company.subUsers.find((u: any) => u.username === subUsername && u.password === password);
    if (!subUser) return res.status(401).json({ error: 'Invalid sub-username or password' });
    valid = true;
    loginRole = 'CompanyMember';
    loginUsername = subUser.username;
    permissions = subUser.permissions;
  } else {
    if (company.password !== password) return res.status(401).json({ error: 'Invalid admin password' });
    valid = true;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000, loginRole, loginUsername, permissions };
  console.log('[OTP] For', email, '(', loginUsername, '):', otp);

  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: '"Antigravity CRM" <noreply@antigravity.com>',
        to: email,
        subject: `Your Login OTP (${loginUsername})`,
        text: 'Your OTP is: ' + otp,
      });
      return res.json({ message: 'OTP sent to company email', previewUrl: nodemailer.getTestMessageUrl(info) });
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
  res.json({ user: { email: company.email, companyName: company.companyName, role: record.loginRole, username: record.loginUsername, permissions: record.permissions } });
});

router.post('/add-subuser', (req, res) => {
  const { email, adminPassword, subUsername, subPassword, permissions } = req.body;
  const company = companies.find(c => c.email === email && c.password === adminPassword);
  if (!company) return res.status(401).json({ error: 'Unauthorized Admin' });

  if (company.subUsers.length >= 4) {
    return res.status(403).json({ error: 'Limit reached. Please purchase more licenses.' });
  }

  if (company.subUsers.find((u: any) => u.username === subUsername)) {
    return res.status(400).json({ error: 'Sub-username already exists' });
  }

  company.subUsers.push({ username: subUsername, password: subPassword, permissions });
  res.json({ message: 'Sub-user added', subUsers: company.subUsers });
});

router.post('/remove-subuser', (req, res) => {
  const { email, adminPassword, subUsername } = req.body;
  const company = companies.find(c => c.email === email && c.password === adminPassword);
  if (!company) return res.status(401).json({ error: 'Unauthorized Admin' });

  company.subUsers = company.subUsers.filter((u: any) => u.username !== subUsername);
  res.json({ message: 'Sub-user removed', subUsers: company.subUsers });
});

router.get('/company-details', (req, res) => {
  const { email, password } = req.query;
  const company = companies.find(c => c.email === email && c.password === password);
  if (!company) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ company });
});

export default router;
