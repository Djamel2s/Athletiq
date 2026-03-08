import nodemailer from 'nodemailer'

// Configuration du transporteur email
// En dev : utilise Ethereal (fake SMTP pour tester)
// En prod : configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS dans .env
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  // Fallback dev : log dans la console
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || '',
      pass: process.env.ETHEREAL_PASS || ''
    }
  })
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'Athletiq <noreply@athletiq.app>'
const APP_URL = process.env.APP_URL || 'http://localhost:3000'

// Template de base pour tous les emails
const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f0eb; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 48px; }
    .logo-text { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-top: 8px; }
    h1 { font-size: 22px; color: #1a1a1a; margin: 0 0 16px; }
    p { font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 16px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #d4c4b0, #b8a48f); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; }
    .btn:hover { opacity: 0.9; }
    .footer { text-align: center; margin-top: 32px; font-size: 13px; color: #999; }
    .code { font-size: 32px; font-weight: 700; color: #1a1a1a; letter-spacing: 4px; text-align: center; padding: 20px; background: #f5f0eb; border-radius: 12px; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-text">Athletiq</div>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Athletiq — Ton coach de musculation intelligent</p>
    </div>
  </div>
</body>
</html>
`

// Email de confirmation d'inscription
export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`
  const html = emailLayout(`
    <h1>Bienvenue sur Athletiq !</h1>
    <p>Merci de vous être inscrit. Confirmez votre adresse email pour activer votre compte et commencer votre essai gratuit.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="btn">Confirmer mon email</a>
    </p>
    <p style="font-size: 13px; color: #999;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${verifyUrl}</p>
  `)

  return sendEmail(email, 'Confirmez votre email — Athletiq', html)
}

// Email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  const html = emailLayout(`
    <h1>Réinitialisation du mot de passe</h1>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
    </p>
    <p style="font-size: 13px; color: #999;">Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
  `)

  return sendEmail(email, 'Réinitialisation du mot de passe — Athletiq', html)
}

// Email de rappel d'inactivité
export const sendInactivityReminder = async (email: string, firstName: string, daysSinceLastWorkout: number) => {
  const html = emailLayout(`
    <h1>On vous attend, ${firstName || 'champion'} !</h1>
    <p>Ça fait ${daysSinceLastWorkout} jours que vous n'avez pas fait d'entraînement. Votre progression vous attend !</p>
    <p>Même une courte séance compte. Revenez maintenir votre streak et atteindre vos objectifs.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/workouts/start" class="btn">Reprendre l'entraînement</a>
    </p>
  `)

  return sendEmail(email, `${firstName || 'Hey'}, on reprend ? — Athletiq`, html)
}

// Email de bienvenue après essai gratuit
export const sendTrialWelcomeEmail = async (email: string, firstName: string, trialDays: number) => {
  const html = emailLayout(`
    <h1>Votre essai gratuit de ${trialDays} jours commence !</h1>
    <p>Bonjour ${firstName || ''}, bienvenue sur Athletiq ! Pendant ${trialDays} jours, profitez de toutes les fonctionnalités :</p>
    <ul style="color: #555; line-height: 2;">
      <li>Suivi d'entraînements en temps réel</li>
      <li>Statistiques et graphiques avancés</li>
      <li>Suivi corporel avec photos</li>
      <li>Objectifs personnalisés</li>
    </ul>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/dashboard" class="btn">Commencer maintenant</a>
    </p>
  `)

  return sendEmail(email, `Bienvenue sur Athletiq, ${firstName || 'champion'} !`, html)
}

// Email de fin d'essai
export const sendTrialEndingEmail = async (email: string, firstName: string, daysLeft: number) => {
  const html = emailLayout(`
    <h1>Votre essai gratuit se termine ${daysLeft === 0 ? "aujourd'hui" : `dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`}</h1>
    <p>Bonjour ${firstName || ''}, votre période d'essai touche à sa fin. Pour continuer à utiliser Athletiq sans interruption, passez à un abonnement.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/subscription" class="btn">Choisir un abonnement</a>
    </p>
    <p style="font-size: 13px; color: #999;">Vos données sont conservées même après la fin de l'essai.</p>
  `)

  return sendEmail(email, `Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai — Athletiq`, html)
}

// Fonction d'envoi générique
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html
    })

    console.log(`📧 Email envoyé à ${to}: ${subject}`)

    // En dev avec Ethereal, affiche le lien de prévisualisation
    if (!process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        console.log(`   Preview: ${previewUrl}`)
      }
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`❌ Erreur envoi email à ${to}:`, error)
    return { success: false, error }
  }
}
