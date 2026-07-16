학생들의 수업 참여도를 높이고 매일 새로운 학습 동기를 부여하기 위한 '랜덤 출제 앱' 프로젝트입니다.

## 1. 프로젝트 개요
- **목표**: 매일 실기 시험 문제 중 하나를 랜덤하게 뽑고, 당일 출제된 문제는 풀(Pool)에서 제외하여 30일간 중복 없이 학습.
- **철학**: "Persistence(꾸역꾸역)" - 꾸준한 자리 지키기의 중요성을 담은 디자인과 문구 적용.
- **기술 스택**:
    - **Frontend**: Next.js (App Router), Tailwind CSS
    - **Backend/DB**: Firebase Firestore
    - **Animation**: Framer Motion (슬롯머신 효과)
    - **Deployment**: Vercel

## 2. 주요 기능
1. **슬롯머신 출제 로직**: 뽑기 버튼 클릭 시 애니메이션과 함께 랜덤 문제 선정.
2. **상태 관리**: Firestore에서 `isUsed: false`인 문제만 필터링하여 출제, 출제 후 `true`로 갱신.
3. **콘텐츠 관리**: 
    - 이미지: `public/images/exams/exam01.png` ~ `exam30.png` 규칙 사용.
    - 명언 기능: 출제 시 하단에 선생님의 교육 철학 명언 랜덤 출력.
4. **관리자 기능**: 전체 문제 상태 초기화 (`isUsed: false`로 일괄 업데이트).
5. **성취도 시각화**: '꾸역꾸역 게이지'를 통해 전체 문제 대비 진행률 표시.

## 3. 데이터 구조 (Firestore: `problems` 컬렉션)
```json
{
  "id": 1,
  "title": "문제 01",
  "imagePath": "/images/exams/exam01.png",
  "isUsed": false
}

```

## 4. 클로드 코드(Claude Code) 구현 단계 (제안)

### Step 1: 프로젝트 설정

* Next.js 프로젝트 생성 및 Tailwind CSS 설정.
* Firebase 초기화 (`firebaseConfig.js` 작성).

### Step 2: UI 및 슬롯머신 애니메이션

* `Framer Motion`을 이용해 슬롯머신 효과가 적용된 메인 대시보드 UI 구성.
* `public/images/exams/` 경로의 이미지를 불러오는 컴포넌트 작성.

### Step 3: 백엔드 로직

* `getAvailableProblems` 함수: `isUsed == false` 쿼리.
* `selectProblem` 함수: 랜덤 선택 후 해당 문서의 `isUsed`를 `true`로 업데이트.
* `resetAllProblems` 함수: 관리자용 전체 초기화.

### Step 4: 게이미피케이션 및 명언 기능

* 문제 완료 시 게이지 증가 UI 추가.
* `quotes.js` 배열을 만들고 `useEffect`로 랜덤 문구 렌더링.

## 5. 학생들을 위한 재미 요소

* **기대감 조성**: 뽑기 버튼 클릭 시 빠른 이미지 전환 효과 (슬롯머신 연출).
* **꾸역꾸역 명언**: 문제를 뽑을 때마다 화면 하단에 무작위로 선생님의 철학이 담긴 짧은 메시지 노출.
* **시각적 성취**: "전체 30문제 중 현재 OO문제 완료!" 표시.
"""

with open("project_specification.md", "w", encoding="utf-8") as f:
f.write(content)

```

선생님, 클로드 코드(Claude Code)를 활용해 효율적으로 개발하실 수 있도록 프로젝트 명세서를 작성했습니다. 이 파일을 클로드 코드 프로젝트 루트 폴더에 넣어두고 작업을 시작하시면 훨씬 체계적으로 진행하실 수 있습니다.

[file-tag: code-generated-file-5625b330-1058-4b2f-9375-bbde6db08973]

### **클로드 코드 사용 팁**
이 파일을 클로드 코드 환경에 복사해 넣은 후, 다음과 같이 명령어를 시작해 보세요.

1.  **프로젝트 설정 단계:**
    > "project_specification.md 파일을 읽고, 이 프로젝트를 시작하기 위해 필요한 Next.js 기본 구조와 Firebase 설정 파일을 생성해줘."

2.  **슬롯머신 컴포넌트 개발 단계:**
    > "project_specification.md의 슬롯머신 로직을 참고해서 Framer Motion으로 `SlotMachine` 컴포넌트를 만들어줘. `public/images/exams/` 경로의 이미지들을 활용하고, 버튼을 누르면 랜덤한 이미지가 빠르게 지나가다 멈추는 애니메이션을 구현해줘."

3.  **데이터 및 로직 구현 단계:**
    > "Firestore와 연동해서 `isUsed` 필드를 기준으로 데이터를 가져오고 업데이트하는 비즈니스 로직을 구현해줘. 특히 `resetAllProblems` 기능은 보안을 위해 관리자 권한만 실행할 수 있도록 설계해줘."