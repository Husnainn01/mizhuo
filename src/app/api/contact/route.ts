import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed:', { name, email, subject, message });
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    // Log SMTP config (not password)
    console.log('SMTP config:', {
      host: 'cp.mizuhoglobaltradinglimited.jp',
      port: 465,
      user: process.env.SMTP_USER,
    });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'cp.mizuhoglobaltradinglimited.jp',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // set in .env.local
        pass: process.env.SMTP_PASS, // set in .env.local
      },
      authMethod: 'LOGIN',
      tls: { rejectUnauthorized: false },
    });

    // Verify transporter connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified.');
    } catch (verifyErr) {
      console.error('SMTP connection failed:', verifyErr);
      let errorMsg = 'Unknown error';
      if (verifyErr instanceof Error) errorMsg = verifyErr.message;
      else if (typeof verifyErr === 'object' && verifyErr && 'message' in verifyErr) errorMsg = (verifyErr as any).message;
      return NextResponse.json({ success: false, error: 'SMTP connection failed', details: errorMsg }, { status: 500 });
    }

    // Professional HTML email template
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0;">
        <table width="100%" bgcolor="#f4f8fb" cellpadding="0" cellspacing="0" style="padding: 0; margin: 0;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 14px; box-shadow: 0 6px 32px rgba(37,99,235,0.08); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%); padding: 0;">
                    <h2 style="color: #fff; font-size: 2rem; font-weight: 700; margin: 0; padding: 28px 40px; letter-spacing: 1px;">Mizhuo Limited — New Contact Inquiry</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px 16px 40px;">
                    <table width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td style="font-weight: bold; color: #2563eb; padding: 8px 0; width: 120px;">Name:</td>
                        <td style="color: #222;">${name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #2563eb; padding: 8px 0;">Email:</td>
                        <td><a href="mailto:${email}" style="color: #2563eb; text-decoration: underline;">${email}</a></td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #2563eb; padding: 8px 0;">Phone:</td>
                        <td style="color: #222;">${phone || '-'}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #2563eb; padding: 8px 0;">Subject:</td>
                        <td style="color: #222;">${subject}</td>
                      </tr>
                    </table>
                    <div style="margin-bottom: 32px;">
                      <div style="font-weight: bold; color: #2563eb; margin-bottom: 10px; font-size: 1.1rem;">Message</div>
                      <div style="background: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px 24px; color: #222; font-size: 1.08rem; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <div style="font-size: 13px; color: #64748b; border-top: 1px solid #e5e7eb; padding-top: 18px;">
                      <div style="margin-bottom: 6px;">This message was sent from the <b>Mizhuo Limited</b> website contact form.</div>
                      <div style="color: #94a3b8;">${new Date().toLocaleString()}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f1f5f9; padding: 18px 40px; border-radius: 0 0 14px 14px; color: #2563eb; font-size: 1rem; text-align: center;">
                    Mizhuo Limited &bull; Isshiki Oiricho, Konan, Aichi 483-8010, Japan &bull; +81-90-4099-5575
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    // Send the email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'inquiry@mizuhoglobaltradinglimited.jp',
      subject: `Contact Inquiry: ${subject}`,
      html,
      replyTo: email,
    };
    console.log('Sending email with options:', { ...mailOptions, html: '[HTML omitted]' });
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);

    return NextResponse.json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message.', details: error.message }, { status: 500 });
  }
} 