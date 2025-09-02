# Spotify API 설정 가이드

이 문서는 Spotify API를 사용하기 위한 앱 설정 방법을 설명합니다.

## 1. Spotify Developer Dashboard에서 앱 생성

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)에 접속
2. "CREATE AN APP" 버튼 클릭
3. 앱 정보 입력:
   - **App name**: `Arch1ve` (또는 원하는 이름)
   - **App description**: `음악 공유 및 커뮤니티 플랫폼`
   - **Website**: `https://your-domain.com` (프로덕션 URL)
   - **Redirect URIs**: 아래 섹션 참조
   - **API/SDKs**: `Web API` 선택

## 2. Redirect URI 설정

### 개발 환경
```
http://127.0.0.1:3000/auth/spotify/callback
```

### 프로덕션 환경
```
https://your-domain.com/auth/spotify/callback
```

**중요**: `localhost`는 허용되지 않으므로 반드시 `127.0.0.1`을 사용해야 합니다.

## 3. 환경 변수 설정

### .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=6936931bedbe49d8ae448889cf49520a
SPOTIFY_CLIENT_SECRET=bde690fe9a3a451999caf002fffd98d9

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**중요**: 
- Spotify Client ID와 Secret은 이미 제공된 값입니다
- Firebase 설정은 Google Cloud Console에서 확인하세요
- `.env.local` 파일은 Git에 커밋되지 않습니다

## 4. 보안 요구사항

### HTTPS 사용
- 프로덕션 환경에서는 반드시 HTTPS를 사용해야 합니다
- 개발 환경에서는 HTTP 허용 (`127.0.0.1`)

### State 파라미터
- CSRF 공격 방지를 위해 state 파라미터가 자동으로 추가됩니다
- 콜백에서 state 파라미터 검증이 수행됩니다

### Redirect URI 검증
- 정확한 URI 매칭이 필요합니다
- 포트 번호도 정확히 일치해야 합니다

## 5. API 스코프

현재 사용 중인 스코프:
```
user-read-private
user-read-email
user-read-currently-playing
user-read-playback-state
user-modify-playback-state
user-read-recently-played
user-top-read
playlist-read-private
playlist-read-collaborative
streaming
```

## 6. 테스트 방법

### 개발 환경 테스트
1. 앱 실행: `npm run dev`
2. 브라우저에서 `http://127.0.0.1:3000` 접속
3. "Spotify로 시작하기" 버튼 클릭
4. Spotify 로그인 및 권한 승인
5. 콜백 페이지에서 성공 메시지 확인

### 프로덕션 배포
1. 환경 변수 설정 확인
2. Redirect URI가 정확히 설정되었는지 확인
3. HTTPS 인증서 설정
4. 배포 후 테스트

## 7. 문제 해결

### 일반적인 오류

#### "Invalid redirect URI"
- Redirect URI가 정확히 일치하는지 확인
- 포트 번호 확인
- `localhost` 대신 `127.0.0.1` 사용

#### "Invalid client"
- Client ID와 Client Secret이 올바른지 확인
- 환경 변수 설정 확인

#### "Invalid authorization code"
- 코드가 만료되었을 수 있음
- 다시 로그인 시도

### 디버깅
- 브라우저 개발자 도구에서 네트워크 탭 확인
- 콘솔 로그 확인
- Spotify Developer Dashboard에서 앱 상태 확인

## 8. 추가 리소스

- [Spotify Web API 문서](https://developer.spotify.com/documentation/web-api/)
- [Redirect URI 가이드](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri)
- [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

## 9. 보안 모범 사례

1. **환경 변수 보호**: Client Secret을 클라이언트 사이드에 노출하지 않음
2. **HTTPS 사용**: 프로덕션에서 반드시 HTTPS 사용
3. **State 파라미터**: CSRF 공격 방지를 위한 state 검증
4. **토큰 보안**: 액세스 토큰을 안전하게 저장
5. **에러 처리**: 민감한 정보가 에러 메시지에 포함되지 않도록 주의

## 10. 업데이트 일정

- **2025년 4월 9일**: 새로운 Redirect URI 검증 규칙 적용
- **2025년 11월**: 모든 클라이언트가 새로운 검증 규칙으로 마이그레이션 완료 예정

이 가이드를 따라 설정하면 Spotify API를 안전하고 효율적으로 사용할 수 있습니다.
