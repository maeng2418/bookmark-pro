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