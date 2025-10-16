# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **<walid.korchi@edu.uiz.ac.ma>**

### What to Include

Please include the following information:

- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit/URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment
- Any potential mitigations you've identified

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity and complexity

### Security Best Practices

This project follows these security practices:

**Authentication & Authorization:**

- NextAuth with OAuth providers
- Role-based access control (RBAC)
- Permission-based feature access
- Session management with secure cookies

**Data Protection:**

- Environment variables for sensitive data
- HMAC secrets for data integrity
- Secure password hashing with bcrypt
- SQL injection prevention via Kysely ORM

**Infrastructure:**

- Docker containerization
- Secrets management via `.env` files
- S3 presigned URLs for secure file access
- SMTP authentication for email services

### Known Security Considerations

**Development Environment:**

- Never commit `.env` files
- Rotate secrets regularly
- Use MinIO/MailHog for local testing only
- Keep dependencies updated

**Production Deployment:**

- Use strong, randomly generated secrets
- Enable HTTPS/TLS for all connections
- Configure proper CORS policies
- Implement rate limiting on API routes
- Regular security audits of dependencies

## Disclosure Policy

When a security vulnerability is confirmed:

1. A fix will be developed and tested privately
2. A security advisory will be published
3. The fix will be released in a new version
4. Credit will be given to the reporter (if desired)

## Security Updates

Subscribe to repository releases or watch the repository to receive notifications about security updates.

## Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [NextAuth Security](https://authjs.dev/guides/basics/security)
