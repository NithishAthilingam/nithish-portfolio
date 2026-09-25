# 🚀 Modern AWS Serverless Portfolio

A high-performance personal portfolio built with **React**, **Vite**, and **Tailwind CSS**, designed to be hosted serverlessly on **Amazon S3 + CloudFront + Route 53** for under **$0.50/month**.

---

## 📁 Project Structure

```text
├── portfolio/
│   ├── src/
│   │   ├── components/      # UI sections (Navbar, Hero, About, Skills, Projects, Experience, Contact, Footer)
│   │   ├── data/
│   │   │   └── portfolioData.js  # 👈 EDIT YOUR CONTENT HERE (Bio, projects, skills, links)
│   │   ├── App.jsx          # Main layout
│   │   ├── index.css        # Tailwind styles
│   │   └── main.jsx
│   ├── aws/
│   │   └── cloudformation.yaml  # 1-click AWS Infrastructure as Code template
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml       # Automated GitHub Actions CI/CD to S3 + CloudFront
```

---

## 🛠️ Local Development

1. Navigate to the project folder:
   ```bash
   cd portfolio
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. Test production build:
   ```bash
   npm run build
   ```
   Built static files are saved to `portfolio/dist`.

---

## ✏️ Customizing Your Content

Simply open [src/data/portfolioData.js](file:///c:/Users/Nithi/AG_Projects/portfolio/src/data/portfolioData.js) and update:
- **`personal`**: Name, title, tagline, bio, contact email, and resume URL.
- **`socials`**: Links to your GitHub, LinkedIn, Twitter/X, and Email.
- **`skills`**: Categorized technical skills.
- **`projects`**: Title, description, tags, screenshot URL, and live demo / source links.
- **`experience` & `education`**: Career history and academic credentials.

---

## ☁️ Deploying to AWS

Follow the detailed guide in [aws-portfolio-architecture.md](file:///C:/Users/Nithi/.gemini/antigravity/brain/d7d70ff9-9030-493f-bfc8-2aab91703ad2/aws-portfolio-architecture.md):
1. **Route 53**: Register domain (e.g. `yourname.com`).
2. **ACM**: Request a free SSL certificate in `us-east-1` for `yourname.com` & `*.yourname.com`.
3. **CloudFormation or Console**: Deploy the infrastructure using [aws/cloudformation.yaml](file:///c:/Users/Nithi/AG_Projects/portfolio/aws/cloudformation.yaml).
4. **Deploy Files**: Upload the contents of `dist/` to your S3 bucket.
5. **Route 53**: Point Apex (`A` record) and `www` to your CloudFront distribution domain name.
