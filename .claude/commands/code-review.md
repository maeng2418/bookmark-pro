# Code Review Command

@fullstack-code-reviewer

최근 변경된 코드(git diff, 수정된 파일들)를 중심으로 숙련된 시니어 풀스택 개발자 관점에서 리뷰해주세요.

먼저 git status와 git diff를 확인하여 변경점을 파악한 후, 다음 기준으로 리뷰를 진행해주세요:

- 코드 품질, 보안, 성능, 베스트 프랙티스
- 변경사항이 기존 코드에 미치는 영향
- 잠재적 부작용이나 리그레션 가능성

사용법:

- `/code-review` - 스테이징된 변경사항 리뷰 (git diff --staged 기준)
- `/code-review --unstaged` - 스테이징되지 않은 변경사항 리뷰 (git diff 기준)
- `/code-review src/components/BookmarkForm.tsx` - 특정 파일의 변경점 리뷰
