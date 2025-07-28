# BookmarkPro 🔖

BookmarkPro는 웹과 브라우저 확장프로그램에서 북마크를 효율적으로 관리할 수 있는 모던 북마크 관리 솔루션입니다. Turborepo 모노레포 구조로 구성되어 코드를 공유하며 일관된 사용자 경험을 제공합니다.

## 🚀 주요 기능

- **📱 통합 북마크 관리**: 웹 애플리케이션과 브라우저 확장프로그램에서 동일한 북마크 데이터 공유
- **🔍 고급 검색 및 필터링**: 제목, URL, 태그, 설명 기반 실시간 검색 및 카테고리 필터링
- **📊 실시간 북마크 목록**: 저장된 모든 북마크를 한 곳에서 쉽게 관리
- **🔐 안전한 인증**: Supabase를 통한 사용자 인증 및 데이터 관리
- **🏷️ 스마트 분류**: 카테고리와 태그를 통한 체계적인 북마크 관리
- **🎨 모던 UI**: shadcn/ui 기반의 일관되고 세련된 사용자 인터페이스
- **⚡ 실시간 동기화**: 웹과 확장프로그램 간 실시간 데이터 동기화

## 📦 프로젝트 구조

```
bookmark-pro/
├── apps/
│   ├── web/          # 웹 애플리케이션 (Next.js 15 App Router)
│   └── extension/   # 브라우저 확장프로그램 (Chrome Extension)
├── packages/
│   ├── ui/          # 공유 UI 컴포넌트 라이브러리
│   └── tsconfig/    # 공유 TypeScript 설정
├── integrations/    # 외부 서비스 통합
│   └── supabase/   # Supabase 클라이언트 및 타입
└── 설정 파일들...
```

### 패키지 구성

- **`@bookmark-pro/web`**: Next.js 15 기반 웹 애플리케이션 (App Router)
- **`@bookmark-pro/extension`**: Manifest V3 Chrome 확장프로그램
- **`@bookmark-pro/ui`**: 공유 UI 컴포넌트 (shadcn/ui + Radix UI 기반)
- **`@bookmark-pro/tsconfig`**: 공유 TypeScript 설정

## 🛠️ 기술 스택

### 모노레포 및 빌드 도구

- **Turborepo**: 모노레포 관리 및 빌드 오케스트레이션
- **pnpm**: 패키지 매니저 (Volta로 버전 관리)
- **Volta**: Node.js 및 pnpm 버전 관리

### 프론트엔드

- **Next.js 15**: React 기반 풀스택 프레임워크 (App Router)
- **React 18**: 컴포넌트 기반 UI 라이브러리
- **TypeScript**: 타입 안전성을 위한 정적 타입 검사
- **Vite**: UI 패키지 빌드 및 HMR 지원
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui + Radix UI**: 접근성 있는 재사용 가능한 UI 컴포넌트

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
   # 모든 앱 동시 실행 (권장)
   pnpm dev

   # 웹 앱 + UI 패키지 HMR
   pnpm run web:dev

   # 확장프로그램 + UI 패키지 HMR  
   pnpm run extension:dev

   # 개별 앱 실행
   pnpm --filter @bookmark-pro/web dev     # Next.js (포트 8080)
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

3. `apps/extension/dist` 폴더를 "압축해제된 확장 프로그램 로드"로 추가

## 📚 사용법

### 웹 애플리케이션

1. 웹사이트에 접속하여 회원가입/로그인
2. 북마크 추가, 편집, 삭제
3. 카테고리와 태그를 활용한 북마크 분류
4. 검색 및 필터링 기능 활용

### 브라우저 확장프로그램

1. **로그인**: Chrome에 확장프로그램 설치 후 웹 애플리케이션과 동일한 계정으로 로그인
2. **북마크 등록**: 현재 페이지를 북마크에 빠르게 추가 (카테고리, 태그, 설명 옵션)
3. **북마크 관리**: 저장된 북마크 목록 보기, 검색, 편집, 삭제
4. **실시간 검색**: 북마크 제목, URL, 태그로 빠른 검색
5. **카테고리 필터**: 등록된 카테고리별로 북마크 필터링
6. **웹 애플리케이션과 실시간 동기화**: 새로고침 없이 자동 데이터 동기화

### ✨ 확장프로그램 고급 기능

- **현재 페이지 감지**: 이미 북마크된 페이지를 자동으로 감지하여 중복 방지
- **원클릭 북마크**: 현재 페이지가 저장되지 않은 경우 한 번의 클릭으로 북마크 추가
- **북마크 상태 표시**: 현재 페이지의 북마크 저장 여부를 시각적으로 표시
- **빠른 편집/삭제**: 북마크 목록에서 직접 편집 및 삭제 기능
- **사용자 프로필**: Google OAuth 로그인 시 프로필 이미지 및 이니셜 표시

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
