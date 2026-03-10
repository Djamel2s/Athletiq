import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'Athletiq <noreply@athletiq.fr>'
const APP_URL = process.env.APP_URL || 'http://localhost:3000'

// ============================================================
// Design System — memes couleurs que l'app et les images
// ============================================================
const C = {
  bg: '#0c0a09',
  cardBg: '#1c1917',
  cardBorder: '#292524',
  sand: '#d4c4b0',
  sandDark: '#b8a48f',
  sandLight: '#e8ddd0',
  text: '#fafaf9',
  textMuted: '#a8a29e',
  textDim: '#78716c',
  accent: '#d4c4b0',
  gradientStart: '#d4c4b0',
  gradientEnd: '#b8a48f',
}

// ============================================================
// Layout principal — fond sombre premium
// ============================================================
const emailLayout = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Athletiq</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${C.bg}; color: ${C.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${C.bg};">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 36px; height: 36px; background: linear-gradient(135deg, ${C.gradientStart}, ${C.gradientEnd}); border-radius: 10px;" align="center" valign="middle">
                    <span style="color: ${C.bg}; font-size: 18px; font-weight: 800; line-height: 36px;">A</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="font-size: 22px; font-weight: 700; color: ${C.text}; letter-spacing: -0.5px;">Athletiq</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color: ${C.cardBg}; border: 1px solid ${C.cardBorder}; border-radius: 20px; padding: 44px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="font-size: 12px; color: ${C.textDim}; margin: 0; line-height: 1.6;">
                Athletiq &mdash; Ton coach de musculation intelligent
              </p>
              <p style="font-size: 11px; color: ${C.textDim}; margin: 8px 0 0; opacity: 0.6;">
                Si tu n'as pas demand&eacute; cet email, ignore-le simplement.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// ============================================================
// Composants r&eacute;utilisables
// ============================================================
const heading = (text: string) =>
  `<h1 style="font-size: 24px; font-weight: 700; color: ${C.text}; margin: 0 0 8px; letter-spacing: -0.3px;">${text}</h1>`

const paragraph = (text: string) =>
  `<p style="font-size: 15px; color: ${C.textMuted}; line-height: 1.7; margin: 0 0 20px;">${text}</p>`

const button = (text: string, url: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 32px auto;">
    <tr>
      <td style="background: linear-gradient(135deg, ${C.gradientStart}, ${C.gradientEnd}); border-radius: 12px; padding: 14px 36px;">
        <a href="${url}" style="color: ${C.bg}; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">${text}</a>
      </td>
    </tr>
  </table>`

const divider = () =>
  `<hr style="border: none; border-top: 1px solid ${C.cardBorder}; margin: 28px 0;">`

const statBox = (value: string, label: string) =>
  `<td style="background-color: ${C.bg}; border-radius: 12px; padding: 20px 16px; text-align: center; width: 33%;">
    <div style="font-size: 28px; font-weight: 700; color: ${C.sand};">${value}</div>
    <div style="font-size: 12px; color: ${C.textDim}; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${label}</div>
  </td>`

const smallText = (text: string) =>
  `<p style="font-size: 12px; color: ${C.textDim}; margin: 0; line-height: 1.5;">${text}</p>`

// ============================================================
// EMAIL : Confirmation d'inscription
// ============================================================
export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`
  const html = emailLayout(`
    ${heading('Confirme ton email')}
    ${paragraph('Bienvenue sur Athletiq. Il ne te reste qu\'une &eacute;tape pour activer ton compte et commencer &agrave; suivre tes entra&icirc;nements.')}
    ${button('Confirmer mon email', verifyUrl)}
    ${divider()}
    ${smallText('Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :')}
    <p style="font-size: 12px; color: ${C.sandDark}; word-break: break-all; margin: 8px 0 0;">${verifyUrl}</p>
  `)

  return sendEmail(email, 'Confirme ton email — Athletiq', html)
}

// ============================================================
// EMAIL : R&eacute;initialisation du mot de passe
// ============================================================
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  const html = emailLayout(`
    ${heading('R&eacute;initialise ton mot de passe')}
    ${paragraph('Tu as demand&eacute; &agrave; r&eacute;initialiser ton mot de passe. Clique sur le bouton ci-dessous pour en choisir un nouveau. Ce lien expire dans 1 heure.')}
    ${button('Choisir un nouveau mot de passe', resetUrl)}
    ${divider()}
    ${smallText('Si tu n\'as pas fait cette demande, ignore simplement cet email. Ton mot de passe actuel reste inchang&eacute;.')}
  `)

  return sendEmail(email, 'Mot de passe — Athletiq', html)
}

// ============================================================
// EMAIL : Rappel d'inactivit&eacute;
// ============================================================
export const sendInactivityReminder = async (email: string, firstName: string, daysSinceLastWorkout: number) => {
  const name = firstName || 'l\'athl&egrave;te'
  const html = emailLayout(`
    ${heading(`${daysSinceLastWorkout} jours sans entra&icirc;nement`)}
    ${paragraph(`${name}, ta progression t'attend. Chaque s&eacute;ance compte, m&ecirc;me les plus courtes. Reviens maintenir ta dynamique.`)}
    ${button('Reprendre maintenant', `${APP_URL}/workouts/start`)}
  `)

  return sendEmail(email, `${daysSinceLastWorkout}j sans entra\u00eenement — Athletiq`, html)
}

// ============================================================
// EMAIL : Bienvenue
// ============================================================
export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const name = firstName || 'champion'
  const html = emailLayout(`
    ${heading(`Bienvenue, ${name}.`)}
    ${paragraph('Ton compte Athletiq est actif. Tout est pr&ecirc;t pour suivre tes entra&icirc;nements, analyser ta progression et atteindre tes objectifs.')}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${C.cardBorder};">
          <span style="color: ${C.sand}; font-weight: 600; font-size: 14px;">01</span>
          <span style="color: ${C.textMuted}; font-size: 14px; padding-left: 12px;">Cr&eacute;e ton premier workout</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${C.cardBorder};">
          <span style="color: ${C.sand}; font-weight: 600; font-size: 14px;">02</span>
          <span style="color: ${C.textMuted}; font-size: 14px; padding-left: 12px;">Lance-le &agrave; la salle et log tes s&eacute;ries</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <span style="color: ${C.sand}; font-weight: 600; font-size: 14px;">03</span>
          <span style="color: ${C.textMuted}; font-size: 14px; padding-left: 12px;">Suis ta progression et tes records</span>
        </td>
      </tr>
    </table>

    ${button('Commencer', `${APP_URL}/dashboard`)}
  `)

  return sendEmail(email, `Bienvenue sur Athletiq, ${name}`, html)
}

// ============================================================
// EMAIL : R&eacute;cap hebdomadaire
// ============================================================
export const sendWeeklyRecapEmail = async (
  email: string,
  firstName: string,
  data: { workouts: number; duration: number; volume: number; streak: number }
) => {
  const name = firstName || 'champion'
  const durationMin = Math.round(data.duration / 60)
  const volumeDisplay = data.volume >= 1000 ? `${(data.volume / 1000).toFixed(1)}t` : `${data.volume}kg`

  const html = emailLayout(`
    ${heading('Ton bilan de la semaine')}
    ${paragraph(`${name}, voici le r&eacute;sum&eacute; de tes 7 derniers jours.`)}

    <!-- Stats Grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin: 8px 0 24px;">
      <tr>
        ${statBox(String(data.workouts), 'S&eacute;ances')}
        ${statBox(`${durationMin}m`, 'Dur&eacute;e')}
        ${statBox(volumeDisplay, 'Volume')}
      </tr>
    </table>

    ${data.streak > 0 ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
      <tr>
        <td style="background-color: ${C.bg}; border-radius: 12px; padding: 16px 20px; text-align: center;">
          <span style="color: ${C.sand}; font-weight: 700; font-size: 16px;">Streak : ${data.streak} semaine${data.streak > 1 ? 's' : ''}</span>
        </td>
      </tr>
    </table>
    ` : ''}

    ${button('Voir mes statistiques', `${APP_URL}/statistics`)}
  `)

  const subjectWorkouts = data.workouts === 0 ? 'Aucune s\u00e9ance' : `${data.workouts} s\u00e9ance${data.workouts > 1 ? 's' : ''}`
  return sendEmail(email, `${subjectWorkouts} cette semaine — Athletiq`, html)
}

// ============================================================
// Fonction d'envoi g&eacute;n&eacute;rique via Resend
// ============================================================
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html
    })

    if (error) {
      console.error(`Erreur envoi email a ${to}:`, error)
      return { success: false, error }
    }

    console.log(`Email envoye a ${to}: ${subject} (id: ${data?.id})`)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error(`Erreur envoi email a ${to}:`, error)
    return { success: false, error }
  }
}
