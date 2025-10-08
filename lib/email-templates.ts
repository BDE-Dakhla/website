import { APP_BASE_URL } from './env'

interface WelcomeEmailParams {
  email: string
  unsubscribeUrl: string
}

export function generateWelcomeEmail({
  email,
  unsubscribeUrl,
}: WelcomeEmailParams) {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue à la newsletter BDE Apollo 9.0</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🚀 Bienvenue !</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Bonjour,
              </h2>
              
              <p style="margin: 0 0 16px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Merci de vous être inscrit à la newsletter <strong>Apollo 9.0</strong>, le Bureau des Étudiants de l'ENCG Dakhla ! 🎉
              </p>
              
              <p style="margin: 0 0 16px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Vous recevrez désormais toutes les <strong>actualités</strong>, <strong>événements</strong> et <strong>opportunités</strong> directement dans votre boîte mail :
              </p>
              
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #4a5568; font-size: 16px; line-height: 1.8;">
                <li>📅 Événements et activités du BDE</li>
                <li>🎓 Opportunités académiques et parascolaires</li>
                <li>🤝 Partenariats et collaborations</li>
                <li>💡 Projets et initiatives étudiantes</li>
              </ul>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f7fafc; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="margin: 0; color: #2d3748; font-size: 15px; line-height: 1.6;">
                  <strong>💌 Votre adresse :</strong> ${email}
                </p>
              </div>
              
              <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Restez connecté pour ne rien manquer de la vie étudiante à l'ENCG Dakhla !
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_BASE_URL()}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Visiter notre site
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 12px; color: #718096; font-size: 14px; line-height: 1.5; text-align: center;">
                <strong>Apollo 9.0 — Bureau Des Étudiants de l'ENCG Dakhla</strong><br>
                Centre de mission de l'ENCG Dakhla
              </p>
              
              <p style="margin: 0; color: #a0aec0; font-size: 13px; text-align: center;">
                Vous recevez cet email car vous vous êtes inscrit à notre newsletter.<br>
                <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: underline;">Se désabonner</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
Bienvenue à la newsletter Apollo 9.0 !

Merci de vous être inscrit à la newsletter Apollo 9.0, le Bureau des Étudiants de l'ENCG Dakhla !

Vous recevrez désormais toutes les actualités, événements et opportunités directement dans votre boîte mail :

- Événements et activités du BDE
- Opportunités académiques et parascolaires
- Partenariats et collaborations
- Projets et initiatives étudiantes

Votre adresse : ${email}

Restez connecté pour ne rien manquer de la vie étudiante à l'ENCG Dakhla !

Visitez notre site : ${APP_BASE_URL()}

---
Apollo 9.0 — Bureau Des Étudiants de l'ENCG Dakhla
Centre de mission de l'ENCG Dakhla

Vous recevez cet email car vous vous êtes inscrit à notre newsletter.
Se désabonner : ${unsubscribeUrl}
  `.trim()

  return { html, text }
}
