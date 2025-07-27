# BookmarkPro 🔖

BookmarkPro는 웹과 브라우저 확장프로그램에서 북마크를 효율적으로 관리할 수 있는 모던 북마크 관리 솔루션입니다. Turborepo 모노레포 구조로 구성되어 코드를 공유하며 일관된 사용자 경험을 제공합니다.

## 🚀 주요 기능

- **📱 통합 북마크 관리**: 웹 애플리케이션과 브라우저 확장프로그램에서 동일한 북마크 데이터 공유
- **🔐 안전한 인증**: Supabase를 통한 사용자 인증 및 데이터 관리
- **🏷️ 스마트 분류**: 카테고리와 태그를 통한 체계적인 북마크 관리
- **🎨 모던 UI**: shadcn/ui 기반의 일관되고 세련된 사용자 인터페이스
- **⚡ 실시간 동기화**: 웹과 확장프로그램 간 실시간 데이터 동기화

## 📦 프로젝트 구조

```
bookmark-pro/
├── apps/
│   ├── web/          # 웹 애플리케이션 (Vite + React)
│   └── extension/   # 브라우저 확장프로그램 (Chrome Extension)
├── packages/
│   └── ui/                       # 공유 UI 컴포넌트 라이브러리
├── supabase/                     # 데이터베이스 마이그레이션 및 설정
└── 설정 파일들...
```

### 패키지 구성

- **`@bookmark-pro/web`**: React 기반 웹 애플리케이션
- **`@bookmark-pro/extension`**: Manifest V3 Chrome 확장프로그램
- **`@bookmark-pro/ui`**: 공유 UI 컴포넌트 (shadcn/ui 기반)

## 🛠️ 기술 스택

### 모노레포 및 빌드 도구

- **Turborepo**: 모노레포 관리 및 빌드 오케스트레이션
- **pnpm**: 패키지 매니저 (Volta로 버전 관리)
- **Volta**: Node.js 및 pnpm 버전 관리

### 프론트엔드

- **React 18**: 컴포넌트 기반 UI 라이브러리
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **Vite**: 빠른 개발 서버 및 번들러
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트

### 백엔드 및 데이터베이스

- **Supabase**: BaaS (Backend as a Service)
  - PostgreSQL 데이터베이스
  - 실시간 구독
  - 인증 및 권한 관리

### 브라우저 확장프로그램

- **Manifest V3**: 최신 Chrome 확장프로그램 표준
- **Chrome Storage API**: 로컬 데이터 저장
- **Chrome Tabs API**: 현재 탭 정보 액세스

## 🔧 개발 환경 설정

### 필수 요구사항

- Node.js 20.18.0 (Volta로 자동 관리)
- pnpm 9.15.0 (Volta로 자동 관리)

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone <repository-url>
   cd bookmark-pro
   ```

2. **Volta 설정** (선택사항)

   ```bash
   # Volta가 설치되어 있지 않다면
   curl https://get.volta.sh | bash

   # 프로젝트 디렉토리에서 자동으로 올바른 Node.js 버전 사용
   volta install node@20.18.0
   volta install pnpm@9.15.0
   ```

3. **의존성 설치**

   ```bash
   pnpm install
   ```

4. **Supabase 설정**
   - Supabase 프로젝트 생성
   - 환경 변수 설정 (`.env.local` 파일)

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **개발 서버 실행**

   ```bash
   # 모든 앱 동시 실행
   pnpm dev

   # 개별 앱 실행
   pnpm --filter @bookmark-pro/web dev
   pnpm --filter @bookmark-pro/extension dev
   ```

## 🏗️ 빌드 및 배포

### 전체 빌드

```bash
pnpm build
```

### 개별 앱 빌드

```bash
# 웹 애플리케이션 빌드
pnpm --filter @bookmark-pro/web build

# 확장프로그램 빌드
pnpm --filter @bookmark-pro/extension build
```

### Chrome 확장프로그램 설치

1. 확장프로그램 빌드

   ```bash
   pnpm --filter @bookmark-pro/extension build
   ```

2. Chrome 확장프로그램 관리 페이지에서 개발자 모드 활성화

3. `apps/bookmark-pro-extension/dist` 폴더를 "압축해제된 확장 프로그램 로드"로 추가

## 📚 사용법

### 웹 애플리케이션

1. 웹사이트에 접속하여 회원가입/로그인
2. 북마크 추가, 편집, 삭제
3. 카테고리와 태그를 활용한 북마크 분류
4. 검색 및 필터링 기능 활용

### 브라우저 확장프로그램

1. Chrome에 확장프로그램 설치
2. 웹 애플리케이션과 동일한 계정으로 로그인
3. 현재 페이지를 북마크에 빠르게 추가
4. 웹 애플리케이션과 실시간 동기화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 도움이 필요하다면

- 버그 리포트나 기능 요청은 [Issues](../../issues)에 등록해 주세요
- 질문이나 토론은 [Discussions](../../discussions)를 활용해 주세요

---

**BookmarkPro** - 더 스마트한 북마크 관리의 시작 🚀
