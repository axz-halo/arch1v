// Firestore 데이터베이스 스킴 정의
// 이 파일은 백엔드 개발자들이 참고할 수 있는 데이터베이스 구조 문서입니다.

export interface FirestoreSchemas {
  // 사용자 컬렉션
  users: {
    [userId: string]: {
      id: string;
      email: string;
      displayName: string;
      photoURL?: string;
      bio?: string;
      spotifyId?: string;
      spotifyConnected: boolean;
      spotify?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
        scope: string;
        connectedAt: Date;
      };
      createdAt: Date;
      updatedAt: Date;
      followers: number;
      following: number;
      waveCount: number;
      musicDNA?: {
        topGenres: string[];
        topArtists: string[];
        topTracks: string[];
        mood: string;
        energy: number;
        danceability: number;
        valence: number;
        lastUpdated: Date;
      };
      preferences: {
        privacy: 'public' | 'private' | 'friends';
        notifications: {
          newFollowers: boolean;
          newWaves: boolean;
          chartUpdates: boolean;
          stationUpdates: boolean;
        };
      };
    };
  };

  // 스테이션 컬렉션
  stations: {
    [stationId: string]: {
      id: string;
      name: string;
      description: string;
      coverImage: string;
      creatorId: string;
      creator: {
        id: string;
        displayName: string;
        photoURL?: string;
      };
      type: 'playlist' | 'radio' | 'curated';
      source: 'spotify' | 'youtube' | 'apple' | 'custom';
      sourceId?: string; // Spotify playlist ID, YouTube playlist ID 등
      tracks: {
        id: string;
        title: string;
        artist: string;
        album: string;
        albumArt: string;
        duration: number;
        addedAt: Date;
      }[];
      subscribers: string[]; // 사용자 ID 배열
      subscriberCount: number;
      isPublic: boolean;
      tags: string[];
      createdAt: Date;
      updatedAt: Date;
      lastPlayedAt?: Date;
      playCount: number;
    };
  };

  // 차트 컬렉션
  charts: {
    [chartId: string]: {
      id: string;
      title: string;
      description: string;
      theme: string;
      period: 'daily' | 'weekly' | 'monthly';
      status: 'active' | 'voting' | 'closed' | 'archived';
      startDate: Date;
      endDate: Date;
      votingEndDate: Date;
      tracks: {
        id: string;
        track: {
          id: string;
          title: string;
          artist: string;
          album: string;
          albumArt: string;
          duration: number;
        };
        votes: number;
        voters: string[]; // 사용자 ID 배열
        isWinner: boolean;
        addedAt: Date;
      }[];
      participants: string[]; // 참여한 사용자 ID 배열
      participantCount: number;
      totalVotes: number;
      createdAt: Date;
      updatedAt: Date;
      createdBy: string; // 관리자 ID
    };
  };

  // 웨이브 컬렉션
  waves: {
    [waveId: string]: {
      id: string;
      userId: string;
      user: {
        id: string;
        displayName: string;
        photoURL?: string;
      };
      track: {
        id: string;
        title: string;
        artist: string;
        album: string;
        albumArt: string;
        duration: number;
        spotifyId?: string;
      };
      message?: string;
      timestamp: Date;
      reactions: {
        id: string;
        userId: string;
        type: 'like' | 'love' | 'fire';
        createdAt: Date;
      }[];
      comments: {
        id: string;
        userId: string;
        user: {
          id: string;
          displayName: string;
          photoURL?: string;
        };
        content: string;
        createdAt: Date;
      }[];
      shares: {
        id: string;
        userId: string;
        createdAt: Date;
      }[];
      isPublic: boolean;
      tags: string[];
      location?: {
        city: string;
        country: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      };
    };
  };

  // 음악 DNA 컬렉션
  musicDNA: {
    [userId: string]: {
      id: string;
      userId: string;
      topGenres: {
        name: string;
        percentage: number;
      }[];
      topArtists: {
        id: string;
        name: string;
        image: string;
        percentage: number;
      }[];
      topTracks: {
        id: string;
        title: string;
        artist: string;
        album: string;
        albumArt: string;
        percentage: number;
      }[];
      audioFeatures: {
        energy: number;
        danceability: number;
        valence: number;
        tempo: number;
        acousticness: number;
        instrumentalness: number;
        liveness: number;
        speechiness: number;
      };
      mood: {
        primary: string;
        secondary: string;
        confidence: number;
      };
      listeningHistory: {
        totalTracks: number;
        totalMinutes: number;
        averageSessionLength: number;
        mostActiveHour: number;
        mostActiveDay: string;
      };
      lastUpdated: Date;
      period: 'short_term' | 'medium_term' | 'long_term';
    };
  };

  // 알림 컬렉션
  notifications: {
    [notificationId: string]: {
      id: string;
      userId: string;
      type: 'new_follower' | 'new_wave' | 'chart_update' | 'station_update' | 'reaction' | 'comment';
      title: string;
      message: string;
      data: {
        waveId?: string;
        stationId?: string;
        chartId?: string;
        userId?: string;
        [key: string]: any;
      };
      isRead: boolean;
      createdAt: Date;
    };
  };

  // 팔로우 관계 컬렉션
  follows: {
    [followId: string]: {
      id: string;
      followerId: string;
      followingId: string;
      createdAt: Date;
    };
  };

  // 스테이션 구독 컬렉션
  stationSubscriptions: {
    [subscriptionId: string]: {
      id: string;
      userId: string;
      stationId: string;
      createdAt: Date;
    };
  };

  // 차트 참여 컬렉션
  chartParticipations: {
    [participationId: string]: {
      id: string;
      userId: string;
      chartId: string;
      votes: {
        trackId: string;
        vote: 'like' | 'dislike';
        createdAt: Date;
      }[];
      createdAt: Date;
    };
  };
}

// 인덱스 권장사항
export const FirestoreIndexes = {
  // 복합 인덱스 예시
  waves: [
    ['userId', 'timestamp'],
    ['isPublic', 'timestamp'],
    ['tags', 'timestamp'],
  ],
  stations: [
    ['creatorId', 'createdAt'],
    ['isPublic', 'subscriberCount'],
    ['type', 'createdAt'],
  ],
  charts: [
    ['status', 'endDate'],
    ['period', 'startDate'],
    ['createdBy', 'createdAt'],
  ],
  notifications: [
    ['userId', 'isRead'],
    ['userId', 'createdAt'],
  ],
  follows: [
    ['followerId', 'createdAt'],
    ['followingId', 'createdAt'],
  ],
};

// 보안 규칙 예시
export const FirestoreSecurityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 문서
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 스테이션 문서
    match /stations/{stationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.creatorId == request.auth.uid;
    }
    
    // 웨이브 문서
    match /waves/{waveId} {
      allow read: if request.auth != null && 
        (resource.data.isPublic || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // 차트 문서
    match /charts/{chartId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        resource.data.createdBy == request.auth.uid;
    }
  }
}
`;

// 데이터 마이그레이션 스크립트 예시
export const MigrationScripts = {
  // 사용자 프로필 업데이트
  updateUserProfile: `
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (!userData.preferences) {
        batch.update(doc.ref, {
          preferences: {
            privacy: 'public',
            notifications: {
              newFollowers: true,
              newWaves: true,
              chartUpdates: true,
              stationUpdates: true,
            }
          }
        });
      }
    });
    
    await batch.commit();
  `,
  
  // 스테이션 인덱스 생성
  createStationIndexes: `
    // Firestore Console에서 수동으로 인덱스 생성
    // Collection: stations
    // Fields: creatorId (Ascending), createdAt (Descending)
    // Fields: isPublic (Ascending), subscriberCount (Descending)
  `,
};
