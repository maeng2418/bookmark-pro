# BookmarkPro Browser Extension

Vite + React 기반의 브라우저 확장프로그램입니다.

## 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (popup 개발용)
pnpm dev

# 확장프로그램 빌드
pnpm build
```

## 확장프로그램 설치

1. `pnpm build` 실행
2. Chrome 브라우저에서 `chrome://extensions/` 이동
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist` 폴더 선택

## 기능

- 현재 페이지를 북마크로 저장
- 태그 및 메모 추가
- BookmarkPro 웹 앱과 연동 (예정)

## 구조

- `src/popup.tsx` - 팝업 UI 진입점
- `src/App.tsx` - 메인 앱 컴포넌트
- `src/components/` - React 컴포넌트들
- `src/background.ts` - 백그라운드 스크립트
- `src/content.ts` - 콘텐츠 스크립트
- `manifest.json` - 확장프로그램 설정

## 개발용 확장 프로그램 ID 고정 방법

개발 중 “압축해제된 확장 프로그램”을 로드할 때마다 ID가 달라지는 문제를 방지하려면 `manifest.json`에 공개키(`key`)를 넣어야 합니다. 이 저장소는 빌드 시 환경변수 `EXTENSION_PUBLIC_KEY` 값을 자동으로 `manifest.key`에 주입하도록 설정되어 있습니다.

### 1) 개인키(.pem) 생성 및 공개키(Base64) 추출

아래 명령은 최초 1회만 수행합니다. macOS 기준 예시입니다.

```bash
# 1) 일단 빌드해서 산출물 생성
cd /Users/maeng/Desktop/bookmark-pro/apps/extension
pnpm build

# 2) Chrome으로 패키징(개인키 .pem 생성)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --pack-extension=/Users/maeng/Desktop/bookmark-pro/apps/extension/dist

# 3) 생성된 .pem에서 공개키(Base64) 추출
openssl rsa -in /Users/maeng/Desktop/bookmark-pro/apps/extension/dist.pem \
  -pubout -outform DER | openssl base64 -A
```

출력된 Base64 문자열이 `manifest.key`에 들어갈 공개키입니다.

> 주의: `.pem`(개인키)은 절대 레포에 커밋하지 말고 안전하게 보관하세요.

### 2) 환경변수로 공개키 등록

루트(모노레포) 경로에 `.env` 파일을 만들고 다음을 추가합니다. 이 프로젝트는 Vite에서 루트 경로의 환경변수를 읽도록 설정되어 있습니다.

```bash
# /Users/maeng/Desktop/bookmark-pro/.env
EXTENSION_PUBLIC_KEY=<위에서 얻은 공개키(Base64)>
```

### 3) 빌드 및 검증

```bash
cd /Users/maeng/Desktop/bookmark-pro/apps/extension
pnpm build

# manifest에 key가 포함되었는지 확인
cat dist/manifest.json | grep '"key"' || true
```

`dist/manifest.json`에 `"key": "<Base64 공개키>"`가 들어 있으면 성공입니다.

### 4) Chrome에 로드하여 ID 고정 확인

1. `chrome://extensions` → 개발자 모드 켜기
2. "압축해제된 확장 프로그램을 로드합니다" → `apps/extension/dist` 선택
3. 표시된 확장 프로그램 ID를 기록
4. 이후 `pnpm build`를 다시 실행하고 동일한 폴더를 다시 로드/갱신해도 ID가 동일해야 합니다.

### 5) Supabase OAuth 설정(선택)

Google OAuth를 사용하는 경우, Supabase Auth의 Allowed Redirect URLs에 다음을 추가하세요.

```
chrome-extension://<개발용-확장-ID>/src/oauth-callback.html
```

### 참고

- 프로덕션(웹 스토어에 게시된) 확장 프로그램의 ID는 버전을 업데이트해도 바뀌지 않습니다.
- 개발용 ID는 `manifest.key`(공개키)로 고정됩니다. 개인키는 절대 노출하지 마세요.
