# NNOON Homepage

개인 CV와 블로그가 포함된 미니멀 포트폴리오 웹사이트입니다.

## 🚀 로컬 실행

```bash
cd /Users/bsmoon/Desktop/NNOON_Homepage
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

## 📁 프로젝트 구조

```
NNOON_Homepage/
├── index.html            # 메인 페이지 (인터랙티브 타이틀)
├── cv.html               # CV 페이지
├── blog.html             # 블로그 목록
├── post.html             # 포스트 상세
├── content/
│   ├── cv.md             # CV 내용 (여기서 수정)
│   └── posts/
│       ├── index.json    # 포스트 메타데이터
│       └── *.md          # 개별 포스트
├── css/
│   ├── main.css          # 전역 스타일/변수
│   ├── components.css    # UI 컴포넌트
│   └── pages.css         # 페이지별 스타일
├── js/
│   ├── main.js           # 공통 기능 (테마 토글 등)
│   ├── cv-parser.js      # CV 파서
│   ├── blog-parser.js    # 블로그 목록 파서
│   └── post-renderer.js  # 포스트 렌더러
└── assets/
    └── images/           # 프로필 사진 등
```

## 📝 콘텐츠 관리

### CV 수정
`content/cv.md` 파일을 수정하면 자동으로 반영됩니다.

```markdown
---
name: NNOON
title: Researcher & Developer
email: your.email@example.com
github: yourusername
linkedin: yourusername
---

## Education
- **2020 — Present** | OO대학교 석사과정 | 컴퓨터공학과

## Experience
- **2023 — Present** | OO 연구실 | Graduate Researcher

## Skills
Python, JavaScript, Solidity, ...
```

### 새 블로그 포스트 추가

1. **마크다운 파일 생성**: `content/posts/my-post.md`
```markdown
# 포스트 제목

본문 내용...

## 섹션 1
...

## 섹션 2
...
```

2. **index.json에 메타데이터 추가**:
```json
{
  "id": "my-post",
  "title": "포스트 제목",
  "date": "2024-01-20",
  "tag": "Paper",
  "excerpt": "한 줄 요약"
}
```

**태그 종류**: `Paper`, `Security`, `Dev` (자유롭게 추가 가능)

## 🎨 디자인 커스터마이징

### 색상 변경
`css/main.css`에서 CSS 변수 수정:
```css
:root {
  --accent-primary: #E07A7A;     /* 메인 강조색 */
  --accent-secondary: #C96B6B;   /* 보조 강조색 */
  --bg-primary: #0A0A0A;         /* 배경색 */
}
```

### 폰트 변경
`index.html`, `cv.html`, `blog.html`의 Google Fonts 링크 수정

## ☁️ 클라우드 배포

정적 사이트이므로 다음 서비스에 바로 배포 가능:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **Oracle Cloud Object Storage**

## 📋 기능 목록

- ✅ 미니멀 인터랙티브 홈페이지
- ✅ 마크다운 기반 CV
- ✅ 마크다운 기반 블로그
- ✅ 코드 하이라이팅 (highlight.js)
- ✅ LaTeX 수식 지원 (KaTeX)
- ✅ 다크/라이트 모드
- ✅ 반응형 디자인
- ✅ 태그 필터링

## 📄 라이선스

MIT License
