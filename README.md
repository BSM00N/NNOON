# NNOON Homepage

개인 CV와 블로그가 포함된 미니멀 포트폴리오 웹사이트입니다.

🌐 **Live Site**: https://nnoon.xyz

---

## 📝 콘텐츠 업데이트 가이드

### CV 수정하기

1. `content/cv.md` 파일 편집
2. 저장 후 배포:
```bash
git add .
git commit -m "Update CV"
git push
```
3. 1-2분 후 사이트에 반영

**CV 파일 형식:**
```markdown
---
name: 이름
title: 직함
email: email@example.com
github: github-username
linkedin: linkedin-username
---

## Education
- **2020 — Present** | 학교명 | 전공

## Experience
- **2023 — Present** | 회사명 | 직책

## Skills
Python, JavaScript, Solidity, ...

## Publications
- **2024** | 논문 제목 | 학회명
```

---

### 새 블로그 포스트 추가하기

#### Step 1: 마크다운 파일 생성
`content/posts/` 폴더에 새 파일 생성:
```bash
# 예: content/posts/my-new-post.md
```

**포스트 파일 형식:**
```markdown
# 포스트 제목

첫 문단 (소개글)

## 섹션 1
내용...

## 섹션 2
내용...

### 코드 예시
```python
def hello():
    print("Hello World")
```

### 수식
$$
E = mc^2
$$
```

#### Step 2: index.json에 메타데이터 추가
`content/posts/index.json` 파일 편집:
```json
[
  {
    "id": "my-new-post",
    "title": "새 포스트 제목",
    "date": "2024-01-20",
    "tag": "Paper",
    "excerpt": "한 줄 요약"
  },
  ... (기존 포스트들)
]
```

**태그 종류**: `Paper`, `Security`, `Dev` (자유롭게 추가 가능)

#### Step 3: 배포
```bash
git add .
git commit -m "Add new post: 포스트제목"
git push
```

---

## 🚀 로컬 테스트

```bash
cd /Users/bsmoon/Desktop/NNOON_Homepage
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

---

## 📁 프로젝트 구조

```
NNOON_Homepage/
├── index.html          # 메인 페이지
├── cv.html             # CV 페이지
├── blog.html           # 블로그 목록
├── post.html           # 포스트 상세
├── CNAME               # 커스텀 도메인
├── .nojekyll           # Jekyll 비활성화
├── content/
│   ├── cv.md           # ⭐ CV 내용
│   └── posts/
│       ├── index.json  # ⭐ 포스트 메타데이터
│       └── *.md        # ⭐ 개별 포스트
├── css/                # 스타일
└── js/                 # 파서 스크립트
```

---

## ✅ 체크리스트

배포 전 확인:
- [ ] 로컬에서 테스트 완료
- [ ] 마크다운 문법 오류 없음
- [ ] index.json 형식 올바름 (JSON 문법)
- [ ] 이미지 경로 정확함

---

## 🔧 문제 해결

| 문제 | 해결 |
|------|------|
| 변경사항 미반영 | `Cmd+Shift+R` 강력 새로고침 |
| Failed to load CV | `.nojekyll` 파일 존재 확인 |
| 404 에러 | 파일명과 id 일치 확인 |
| 수식 안 보임 | `$$` 앞뒤 빈 줄 추가 |

---

## 📄 라이선스

MIT License
