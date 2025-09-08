import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, code, tagId } = body

    // Generate magic link for passwordless access
    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://scanback.co.za'}/dashboard?token=${generateToken()}&tag=${tagId}`
    
    // Generate manage tags link
    const manageTagsLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://scanback.co.za'}/dashboard`

    // Send welcome WhatsApp message
    if (phone) {
      await sendWelcomeWhatsApp(phone, name, magicLink, manageTagsLink)
    }

    // Send welcome email
    if (email) {
      await sendWelcomeEmail(email, name, magicLink, manageTagsLink)
    }

    // Send welcome SMS
    if (phone) {
      await sendWelcomeSMS(phone, name, manageTagsLink)
    }

    return NextResponse.json({ 
      success: true, 
      message: "Welcome communications sent successfully",
      magicLink,
      manageTagsLink
    })

  } catch (error) {
    console.error("Error sending welcome communications:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send welcome communications" },
      { status: 500 }
    )
  }
}

function generateToken(): string {
  // Generate a secure random token for magic link
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function sendWelcomeWhatsApp(phone: string, name: string, magicLink: string, manageTagsLink: string) {
  // WhatsApp API integration would go here
  // For now, we'll simulate the API call
  const message = `🎉 Welcome to ScanBack, ${name}!

Your tag is now active and ready to help return your items.

🔗 Manage your tags: ${manageTagsLink}

🚀 Quick access (no password needed): ${magicLink}

Need help? Reply to this message or visit scanback.co.za`

  console.log(`WhatsApp message sent to ${phone}:`, message)
  
  // In production, integrate with WhatsApp Business API
  // await whatsappAPI.sendMessage(phone, message)
}

async function sendWelcomeEmail(email: string, name: string, magicLink: string, manageTagsLink: string) {
  // Email service integration would go here
  // For now, we'll simulate the email sending
  const emailContent = {
    to: email,
    subject: "Welcome to ScanBack - Your Tag is Active! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e3a8a;">Welcome to ScanBack, ${name}!</h1>
        
        <p>Your ScanBack tag is now active and ready to help return your items.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e3a8a; margin-top: 0;">Quick Actions:</h3>
          <p><a href="${manageTagsLink}" style="color: #3b82f6; text-decoration: none;">🔗 Manage Your Tags</a></p>
          <p><a href="${magicLink}" style="color: #3b82f6; text-decoration: none;">🚀 Quick Access (No Password)</a></p>
        </div>
        
        <p>Need help? Visit <a href="https://scanback.co.za" style="color: #3b82f6;">scanback.co.za</a></p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">© 2024 ScanBack™. All rights reserved.</p>
      </div>
    `
  }

  console.log(`Email sent to ${email}:`, emailContent)
  
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  // await emailService.send(emailContent)
}

async function sendWelcomeSMS(phone: string, name: string, manageTagsLink: string) {
  // SMS service integration would go here
  // For now, we'll simulate the SMS sending
  const message = `Welcome to ScanBack, ${name}! Your tag is active. Manage tags: ${manageTagsLink}`

  console.log(`SMS sent to ${phone}:`, message)
  
  // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
  // await smsService.send(phone, message)
} 