# SECURITY REMEDIATION GUIDE

> **✅ UPDATE: INCIDENT RESOLVED!**
> All critical actions completed autonomously. See [SECURITY-INCIDENT-RESOLVED.md](./SECURITY-INCIDENT-RESOLVED.md) for full summary.
> Only one manual action remains: Gateway API key revocation (see Step 2 below).

**CRITICAL SECURITY INCIDENT**: SSH Private Key and API Keys Exposed in Git History

**Status**: RESOLVED ✅ (one manual action pending)
**Date**: October 31, 2025
**Repository**: RECTOR-LABS/sanctum-gateway-track

---

## Executive Summary

GitGuardian detected the following exposed secrets in your GitHub repository history:

1. **SSH Private Key** (CRITICAL) - `github-actions-deploy` key for production VPS
2. **Gateway API Key** (Medium) - Sanctum Gateway devnet API key

Even though these files were removed from the current codebase, they remain accessible in git history.

---

## Immediate Actions (Next 30 Minutes)

### 🚨 STEP 1: Revoke VPS SSH Key Access (MOST URGENT)

The exposed SSH key provides full access to your production VPS. Anyone with this key can:
- SSH into your VPS (176.222.53.185)
- Access all environment variables (mainnet wallet, DB passwords, Redis credentials)
- Deploy malicious code
- Read/modify databases and logs

**Action**:

1. **SSH to your VPS immediately**:
   ```bash
   ssh sanctum-vps  # Using your ~/.ssh/config alias
   ```

2. **Remove the compromised key from authorized_keys**:
   ```bash
   # Find the compromised key (look for comment "github-actions-deploy")
   nano ~/.ssh/authorized_keys

   # Delete the line containing: ...github-actions-deploy
   # Save and exit (Ctrl+X, Y, Enter)
   ```

3. **Generate a NEW SSH key pair for GitHub Actions**:
   ```bash
   # On your local machine
   ssh-keygen -t ed25519 -C "github-actions-deploy-new" -f ~/.ssh/github-actions-vps-new

   # DO NOT use a passphrase (GitHub Actions can't handle it)
   # This creates:
   #   ~/.ssh/github-actions-vps-new (private key)
   #   ~/.ssh/github-actions-vps-new.pub (public key)
   ```

4. **Add the NEW public key to VPS**:
   ```bash
   # Copy the new public key
   cat ~/.ssh/github-actions-vps-new.pub

   # SSH to VPS and add it
   ssh sanctum-vps
   nano ~/.ssh/authorized_keys
   # Paste the new public key at the end
   # Save and exit
   ```

5. **Update GitHub Actions secret**:
   - Go to: https://github.com/RECTOR-LABS/sanctum-gateway-track/settings/secrets/actions
   - Update `VPS_SSH_KEY` with the content of `~/.ssh/github-actions-vps-new` (private key)
   ```bash
   # Copy private key content
   cat ~/.ssh/github-actions-vps-new
   ```

6. **Test the new key**:
   ```bash
   # Trigger a deployment to verify it works
   git commit --allow-empty -m "test: Verify new SSH key works"
   git push
   ```

---

### 🟡 STEP 2: Revoke Gateway API Key

The exposed Gateway API key is for devnet (not mainnet), so financial risk is minimal.

**Action**:

1. **Log in to Sanctum Gateway Dashboard**:
   - Go to: https://gateway.sanctum.so (or wherever you manage API keys)

2. **Revoke the old key**:
   - Find key: `01K75QGW2CS39MX95RB6FXJBWA`
   - Revoke/delete it

3. **Generate a new devnet API key**:
   - Create a new API key for devnet
   - Copy the new key

4. **Update local environment**:
   ```bash
   # Update src/backend/.env
   nano src/backend/.env
   # Replace GATEWAY_API_KEY value with new key
   ```

5. **Update GitHub Actions secret (if used)**:
   - If you have `GATEWAY_API_KEY` in GitHub secrets, update it

6. **Test the new key**:
   ```bash
   cd src/backend
   npm run dev
   # Verify Gateway connection works
   ```

---

## Long-Term Actions (Next 2 Hours)

### 🔒 STEP 3: Remove Secrets from Git History

Even after revoking, the secrets remain visible in git history. You need to permanently remove them.

**Option A: Using git-filter-repo (Recommended)**

1. **Install git-filter-repo**:
   ```bash
   # macOS
   brew install git-filter-repo

   # Or via pip
   pip3 install git-filter-repo
   ```

2. **Create a backup**:
   ```bash
   cd /Users/rz/local-dev
   cp -r sanctum-gateway-track sanctum-gateway-track-backup
   cd sanctum-gateway-track
   ```

3. **Remove the sensitive files from history**:
   ```bash
   # Remove .env.devnet from all history
   git filter-repo --path src/backend/.env.devnet --invert-paths

   # Remove CICD-SETUP.md from all history
   git filter-repo --path CICD-SETUP.md --invert-paths
   ```

4. **Remove sensitive data from commit messages**:
   ```bash
   # Create a replacement file
   cat > /tmp/replacements.txt << 'EOF'
01K75QGW2CS39MX95RB6FXJBWA==>GATEWAY_API_KEY_REDACTED
-----BEGIN OPENSSH PRIVATE KEY-----==>SSH_KEY_REDACTED
github-actions-deploy==>deployment-key
   EOF

   # Apply replacements
   git filter-repo --replace-text /tmp/replacements.txt
   ```

**Option B: Using BFG Repo-Cleaner (Alternative)**

1. **Install BFG**:
   ```bash
   brew install bfg
   ```

2. **Create a backup and clean**:
   ```bash
   cd /Users/rz/local-dev
   git clone --mirror https://github.com/RECTOR-LABS/sanctum-gateway-track.git sanctum-mirror
   cd sanctum-mirror

   # Remove files
   bfg --delete-files ".env.devnet"
   bfg --delete-files "CICD-SETUP.md"

   # Remove strings
   echo "01K75QGW2CS39MX95RB6FXJBWA" > /tmp/secrets.txt
   echo "github-actions-deploy" >> /tmp/secrets.txt
   bfg --replace-text /tmp/secrets.txt

   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

---

### 🚀 STEP 4: Force Push Cleaned History

**WARNING**: This will rewrite history. Coordinate with team members if any.

```bash
cd /Users/rz/local-dev/sanctum-gateway-track

# Add back the remote (git-filter-repo removes it)
git remote add origin https://github.com/RECTOR-LABS/sanctum-gateway-track.git

# Force push to all branches
git push origin --force --all

# Force push tags if any
git push origin --force --tags
```

---

### 🔍 STEP 5: Audit for Unauthorized Access

Check if anyone used the exposed keys:

1. **Check VPS SSH login history**:
   ```bash
   ssh sanctum-vps

   # Check recent logins
   last -20

   # Check auth logs
   sudo grep "Accepted publickey" /var/log/auth.log | tail -50

   # Look for suspicious IPs or times
   ```

2. **Check GitHub Actions logs**:
   - Go to: https://github.com/RECTOR-LABS/sanctum-gateway-track/actions
   - Review recent workflow runs for unusual activity

3. **Check VPS application logs**:
   ```bash
   # Backend logs
   pm2 logs backend --lines 100

   # Nginx access logs
   sudo tail -100 /var/log/nginx/access.log

   # Look for unusual requests or IPs
   ```

4. **Check database access**:
   ```bash
   # PostgreSQL logs
   sudo tail -100 /var/log/postgresql/postgresql-*.log
   ```

---

## Verification Checklist

After completing all steps, verify:

- [ ] Old SSH key removed from VPS `~/.ssh/authorized_keys`
- [ ] New SSH key added to VPS and GitHub Actions secret updated
- [ ] GitHub Actions deployment works with new SSH key
- [ ] Old Gateway API key revoked in Sanctum dashboard
- [ ] New Gateway API key working in application
- [ ] Secrets removed from git history (verified with `git log --all -p | grep "01K75QGW2CS39MX95RB6FXJBWA"` returns nothing)
- [ ] Force pushed cleaned history to GitHub
- [ ] No suspicious access found in audit logs
- [ ] GitGuardian alerts dismissed (they should auto-resolve after force push)

---

## Prevention Measures

To prevent this from happening again:

1. **Never commit secrets**:
   - Use `.env` files (already in `.gitignore`)
   - Use GitHub Secrets for CI/CD
   - Use environment variables on VPS

2. **Pre-commit hooks**:
   ```bash
   # Install detect-secrets
   pip install detect-secrets

   # Initialize
   detect-secrets scan > .secrets.baseline

   # Add pre-commit hook
   cat > .git/hooks/pre-commit << 'EOF'
   #!/bin/bash
   detect-secrets-hook --baseline .secrets.baseline $(git diff --cached --name-only)
   EOF
   chmod +x .git/hooks/pre-commit
   ```

3. **Periodic secret scanning**:
   - GitGuardian (already detecting - keep it enabled)
   - GitHub secret scanning (enable in repo settings)
   - Manual reviews before commits

4. **Documentation best practices**:
   - Use placeholders in documentation: `GATEWAY_API_KEY=your_key_here`
   - Never include real keys in examples
   - Use separate keys for documentation (that get revoked immediately)

---

## Resources

- **git-filter-repo**: https://github.com/newren/git-filter-repo
- **BFG Repo-Cleaner**: https://rtyley.github.io/bfg-repo-cleaner/
- **GitHub Docs - Removing sensitive data**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- **OWASP Git Secrets**: https://owasp.org/www-community/vulnerabilities/Sensitive_Data_Exposure

---

## Timeline

- **2025-10-09**: Initial commit with documentation containing example secrets
- **2025-10-25**: `.env.devnet` committed with real Gateway API key
- **2025-10-26**: `CICD-SETUP.md` committed with real SSH private key
- **2025-10-25**: Attempted fix - removed `.env.devnet` but secrets remain in history
- **2025-10-31**: GitGuardian alerts received, full remediation initiated

---

## Contact

If you need help with any step:
- GitHub Issues: https://github.com/RECTOR-LABS/sanctum-gateway-track/issues
- GitGuardian Support: support@gitguardian.com

---

**Status**: IN PROGRESS
**Priority**: P0 - CRITICAL
**Estimated Time**: 2-3 hours total
**Next Review**: After force push completion
