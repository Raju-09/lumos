# AI-Powered Features - Quick Start Guide

## 🎯 What's New

Lumos now includes **three intelligent systems** that make it a hackathon-winning placement portal:

1. **Year-Based Access Control** - Smart feature gating for 1st-4th year students
2. **AI Resume Builder** - Role-aware, ATS-optimized resume generation
3. **ATS Score Checker** - Job-specific resume analysis with actionable feedback

---

## 🚀 Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 2. Test the Features

#### Resume Builder
1. Navigate to `/student/resume-builder`
2. Enter a target role (e.g., "Software Engineer")
3. Click "Generate Resume with AI"
4. AI will create a tailored, ATS-optimized resume
5. Edit, save, or download

#### ATS Checker
1. Navigate to `/student/ats-checker`
2. Select a job opening
3. Paste your resume content
4. Click "Analyze ATS Score"
5. Get detailed feedback with:
   - Overall score (0-100)
   - Skills, experience, education, keywords breakdown
   - Strengths
   - Missing keywords
   - Improvement suggestions

#### Year-Based Access
1. During signup, students select their academic year (1-4)
2. Features are automatically filtered:
   - **1st/2nd Year**: Internships, basic resume builder
   - **3rd/4th Year**: Full placements, advanced features

---

## 📊 How It Works

### Resume Generation
```
Student Data → Gemini AI → ATS-Optimized Resume
```
- AI considers: year, skills, projects, internships
- Tailors content for target role
- Uses ATS-friendly keywords
- Adjusts tone based on experience level

### ATS Scoring
```
Resume + Job Description → Gemini AI → Score + Feedback
```
- Compares resume against JD
- Scores: skills, experience, education, keywords
- Identifies missing keywords
- Provides actionable suggestions

### Access Control
```
Student Year → Access Matrix → Filtered Features
```
- Policy-based (not just UI hiding)
- Ethical and transparent
- Encourages skill-building for early years

---

## 🎨 UI Features

### Resume Builder
- Gradient purple/pink theme
- Real-time AI generation
- Editable output
- Save versions for different roles
- Download as text file

### ATS Checker
- Blue/cyan gradient theme
- Job selection from available drives
- Side-by-side input/results
- Visual score breakdown
- Color-coded feedback (green/yellow/red)

### Navigation
- New tabs in student portal:
  - Resume Builder
  - ATS Checker
- Seamless integration with existing features

---

## 🏆 Judge Demo Script

> **"Let me show you Lumos's AI-powered features:**
>
> **1. Year-Based Access** (15 sec)
> - Students select their year during signup
> - Early years focus on internships and skill-building
> - Final years get full placement access
> - Policy-based, not just UI hiding
>
> **2. AI Resume Builder** (45 sec)
> - [Navigate to Resume Builder]
> - Enter target role: "Software Engineer"
> - [Click Generate]
> - AI creates tailored resume in seconds
> - ATS-optimized keywords
> - Year-aware content
> - Can edit and save multiple versions
>
> **3. ATS Score Checker** (45 sec)
> - [Navigate to ATS Checker]
> - Select job opening
> - [Paste resume]
> - [Click Analyze]
> - Real-time AI analysis
> - Score breakdown: 72/100
> - Missing keywords highlighted
> - Actionable suggestions provided
>
> **All powered by Gemini AI. Real, explainable, ethical.**"

---

## 📁 Files Created

### Core Services
- `src/lib/gemini-ai.ts` - AI integration with production prompts
- `src/lib/access-control.ts` - Year-based feature gating

### Pages
- `src/app/student/resume-builder/page.tsx` - Resume generation UI
- `src/app/student/ats-checker/page.tsx` - ATS scoring UI

### Updated Files
- `src/lib/data-service.ts` - Added `academicYear` and `eligibleYears` fields
- `src/app/student/layout.tsx` - Added new navigation items
- `src/app/login/page.tsx` - Added year selection during signup

---

## 🎯 Key Selling Points

### Technical Excellence
✅ Real AI integration (not mock)
✅ Production-grade prompts
✅ Proper data modeling
✅ TypeScript type safety

### User Value
✅ Year-appropriate features
✅ Actionable feedback
✅ Career guidance
✅ Skill-building focus

### Judge Appeal
✅ Explainable AI
✅ Ethical design
✅ Mature architecture
✅ Real-world applicability

---

## 🐛 Troubleshooting

### "Failed to generate resume"
- Check Gemini API key in `.env.local`
- Ensure API key is valid
- Check browser console for errors

### "Failed to calculate ATS score"
- Same as above
- Ensure job description is not empty
- Check resume content is valid

### Year-based features not working
- Ensure `academicYear` is set during signup
- Check localStorage for `lumos_user` data
- Verify year is 1-4

---

## 🚀 Next Steps

1. ✅ Get Gemini API key
2. ✅ Test Resume Builder
3. ✅ Test ATS Checker
4. ✅ Test year-based access
5. Create sample drives with `eligibleYears` field
6. Test end-to-end flow
7. Prepare demo for judges

---

**You're ready to win! 🏆**
