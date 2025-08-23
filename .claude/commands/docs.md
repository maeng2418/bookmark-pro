# Documentation Update Command

@documentation-updater

개발 작업이 완료된 후 프로젝트 문서(CLAUDE.md, README.md)를 최신 상태로 업데이트해주세요.

먼저 git status와 git log를 확인하여 최근 변경사항을 파악한 후, 다음 문서들을 업데이트해주세요:

**CLAUDE.md 업데이트:**

- Essential Commands 섹션 (새로운 개발/빌드 명령어)
- Architecture Overview (구조 변경사항)
- Key Technical Decisions (새로운 기술적 결정사항)
- Common Gotchas (발견된 문제점과 해결방법)

**README.md 업데이트:**

- 설치 및 설정 방법
- 새로운 기능 설명
- 사용법 예시
- 개발 환경 요구사항

사용법:

- `/docs` - 최근 변경사항 기준으로 문서 전체 업데이트
- `/docs CLAUDE.md` - CLAUDE.md만 업데이트
- `/docs README.md` - README.md만 업데이트
- `/docs "vite-plugin-web-extension 리팩토링 완료"` - 특정 변경사항에 대한 문서 업데이트
