# Arch1ve - 음악 큐레이션 플랫폼

실시간 음악 공유와 커뮤니티 트렌드를 통한 새로운 음악 발견 플랫폼입니다.

## 🎵 주요 기능

### 1. Wave 피드 (메인 탭)
- 실시간 음악 공유 및 발견
- 원형 앨범아트 (LP 레코드 메타포)
- 30초 미리듣기 기능
- 댓글 및 반응 시스템

### 2. 스테이션 (두 번째 탭)
- 유튜브 플레이리스트 채널 구독/관리
- Pinterest 스타일 그리드 레이아웃
- 장르별 필터링

### 3. 차트 (세 번째 탭)
- 주간 테마 기반 커뮤니티 투표
- 틴더 스타일 투표 인터페이스
- 우승자 발표 및 아카이브

### 4. 프로필 (네 번째 탭)
- 음악 DNA 시각화 (장르별 레이더 차트)
- 청취 시간 그래프
- 활동 히스토리

## 🎨 디자인 철학

- **미니멀리즘**: 디터 람스의 설계 원칙 적용
- **턴테이블 메타포**: LP 레코드처럼 원형으로 디자인된 음악 카드
- **뉴모피즘**: 부드러운 그림자와 깊이감으로 물리적 은유 구현
- **단일 포인트 컬러**: 오렌지 (#ff5500)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Firebase 프로젝트
- Spotify API 키
- YouTube API 키 (선택사항)

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd arch1ve
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp env.example .env.local
```
`.env.local` 파일을 편집하여 실제 API 키를 입력하세요.

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 🛠 기술 스택

- **프론트엔드**: Next.js 14, React 18, TypeScript
- **스타일링**: Tailwind CSS, 뉴모피즘 디자인
- **인증**: Firebase Authentication
- **데이터베이스**: Firestore
- **음악 API**: Spotify Web API, Apple Music API
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React

## 📱 반응형 디자인

- iPhone SE (375px) ~ 데스크톱 (1440px) 지원
- 모바일 우선 디자인
- PWA 지원

## 🔧 개발 가이드

### 프로젝트 구조
```
src/
├── app/                 # Next.js App Router
├── components/          # React 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── features/       # 기능별 컴포넌트
├── lib/                # 유틸리티 및 설정
├── types/              # TypeScript 타입 정의
└── hooks/              # 커스텀 훅
```

### 주요 컴포넌트
- `Button`: 뉴모피즘 스타일 버튼
- `Card`: 다양한 변형의 카드 컴포넌트
- `BottomNavigation`: 하단 네비게이션
- `MainLayout`: 메인 레이아웃

## 🎯 다음 단계

1. **인증 시스템 구현**
   - Firebase Authentication 설정
   - Google 로그인 연동
   - Spotify 계정 연결

2. **Wave 피드 구현**
   - 실시간 음악 공유 카드
   - 무한 스크롤
   - 상세 모달

3. **스테이션 기능**
   - 유튜브 API 연동
   - 플레이리스트 관리

4. **차트 시스템**
   - 투표 인터페이스
   - 결과 시각화

5. **프로필 및 통계**
   - 음악 DNA 차트
   - 청취 통계

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
