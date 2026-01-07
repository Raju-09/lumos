# 🌟 Lumos - Campus Placement Management System

> AI-Powered Placement Portal for Students, Recruiters, and Placement Cells

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-orange)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple)](https://ai.google.dev/)

## ✨ Features

### 🎯 For Students
- **AI Resume Builder** - Generate ATS-optimized resumes tailored to specific roles
- **ATS Score Checker** - Get detailed feedback on resume match with job descriptions
- **Smart Eligibility** - Year-based access control (1st-4th year students)
- **Live Job Board** - Real-time job openings from multiple sources
- **Application Tracking** - Track all your applications in one place
- **AI Chatbot** - Get instant help with placement queries

### 🏢 For Recruiters
- **Drive Management** - Create and manage campus placement drives
- **Candidate Screening** - View and filter applications
- **Analytics Dashboard** - Track drive performance

### 🎓 For Placement Cell
- **Institutional Dashboard** - Complete overview of placement activities
- **Bulk Operations** - Manage multiple students and drives efficiently
- **Automations** - Automated eligibility checks and notifications
- **Analytics** - Comprehensive placement statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raju-09/lumos.git
   cd lumos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Environment Setup Guide](ENV_SETUP.md)
- [AI Features Guide](AI_FEATURES_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Firebase Setup](FIREBASE_AUTH_SETUP.md)

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Google Gemini 2.0 Flash
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📁 Project Structure

```
lumos/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── student/      # Student portal pages
│   │   ├── admin/        # Placement cell pages
│   │   ├── recruiter/    # Recruiter pages
│   │   └── login/        # Authentication
│   ├── components/       # React components
│   ├── lib/              # Utilities and services
│   ├── context/          # React context providers
│   └── types/            # TypeScript types
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🎨 Features in Detail

### AI-Powered Resume Builder
- Role-aware resume generation
- ATS-optimized formatting
- Year-appropriate content
- Multiple versions support

### ATS Score Checker
- Hybrid scoring (Structure + Keywords + Experience + Education)
- Detailed breakdown with actionable feedback
- Missing keywords identification
- Improvement suggestions

### Smart Eligibility Engine
- CGPA-based filtering
- Branch restrictions
- Backlog management
- Year-based feature access

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary.

## 👨‍💻 Author

**Raju-09**
- GitHub: [@Raju-09](https://github.com/Raju-09)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Google Gemini for AI capabilities
- All open-source contributors

---

**Made with ❤️ for better campus placements**
