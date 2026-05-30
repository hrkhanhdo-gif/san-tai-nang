import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, cvLink, cvName } = body;

    const emailUser = process.env.EMAIL_USER || 'hr.khanhdo@gmail.com';
    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass) {
      console.warn("SMTP EMAIL_PASS is not configured. Email cannot be sent automatically.");
      return NextResponse.json(
        { error: 'EMAIL_PASS is not configured' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: emailUser,
        pass: emailPass, // App Password
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Săn Tài Năng'}" <${emailUser}>`,
      to,
      subject,
      text,
    };

    // If there is an uploaded CV base64
    if (cvLink && cvLink.startsWith('data:')) {
      const filename = cvName || 'CV_UngVien.pdf';
      mailOptions.attachments = [
        {
          filename,
          path: cvLink, // Data URI format: data:application/pdf;base64,...
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: ', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
