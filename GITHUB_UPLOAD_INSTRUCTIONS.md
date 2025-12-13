# How to Upload Your Project to GitHub

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Sign in to your GitHub account
3. Give your repository a name (e.g., "afiya-zone-store")
4. Choose Public or Private
5. Do NOT initialize with a README
6. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, you'll get a URL like:
`https://github.com/YOUR_USERNAME/REPO_NAME.git`

Then run these commands in your terminal:

```bash
cd "d:\Afiya Zone Store"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Alternative: If You Want to Use an Existing Branch

If you want to push the "fresh-start" branch instead:

```bash
cd "d:\Afiya Zone Store"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin fresh-start
```

## Authentication

When pushing, you'll need to authenticate with GitHub. You can use:
1. Personal Access Token (recommended)
2. GitHub CLI authentication
3. SSH keys (if set up)

For personal access token:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with "repo" permissions
3. Use this token when prompted for password (username stays the same)

## Troubleshooting

If you get permission errors:
1. Make sure you have write access to the repository
2. Check that the repository URL is correct
3. Verify your authentication credentials