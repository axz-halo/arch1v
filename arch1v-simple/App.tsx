import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth } = Dimensions.get('window');

// Mock data
const mockTracks = [
  { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', image: 'https://via.placeholder.com/150', duration: '5:55' },
  { id: '2', title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', image: 'https://via.placeholder.com/150', duration: '8:02' },
  { id: '3', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', image: 'https://via.placeholder.com/150', duration: '6:30' },
];

const mockWaves = [
  { id: '1', user: 'Alex', track: 'Bohemian Rhapsody', artist: 'Queen', platform: 'Spotify', time: '2 min ago', reactions: 12 },
  { id: '2', user: 'Sarah', track: 'Blinding Lights', artist: 'The Weeknd', platform: 'Apple Music', time: '5 min ago', reactions: 8 },
];

// Header Component
const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

// Now Playing Player Component
const NowPlayingPlayer = ({ track, isVisible, onClose }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.3);

  if (!isVisible || !track) return null;

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.nowPlayingContainer}>
        <View style={styles.nowPlayingHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.nowPlayingClose}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.nowPlayingHeaderText}>Now Playing</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Vinyl Record */}
        <View style={styles.vinylContainer}>
          <View style={styles.vinylRecord}>
            <Image source={{ uri: track.image }} style={styles.vinylImage} />
            <View style={styles.vinylCenter} />
          </View>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <Text style={styles.trackArtist}>{track.artist} • {track.album}</Text>
          <Text style={styles.trackQuality}>320kbps • Lossless</Text>
        </View>

        {/* Controls */}
        <View style={styles.playbackControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlButtonText}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlButtonText}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Cover Flow Component
const CoverFlow = ({ tracks, onTrackPress }: any) => {
  return (
    <View style={styles.coverFlowContainer}>
      <Text style={styles.sectionTitle}>Today's Top Hits</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coverFlowScroll}>
        {tracks.map((track: any) => (
          <TouchableOpacity 
            key={track.id} 
            style={styles.coverFlowItem}
            onPress={() => onTrackPress(track)}
          >
            <View style={styles.vinylCover}>
              <Image source={{ uri: track.image }} style={styles.coverImage} />
              <View style={styles.vinylHole} />
            </View>
            <Text style={styles.coverTitle} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.coverArtist} numberOfLines={1}>{track.artist}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Wave Feed Component
const WaveFeed = ({ waves, onTrackPress }: any) => {
  return (
    <View style={styles.waveFeedContainer}>
      <Text style={styles.sectionTitle}>Wave Feed</Text>
      {waves.map((wave: any) => (
        <TouchableOpacity 
          key={wave.id} 
          style={styles.waveItem}
          onPress={() => onTrackPress({ title: wave.track, artist: wave.artist, image: 'https://via.placeholder.com/150' })}
        >
          <View style={styles.waveHeader}>
            <View style={styles.waveUser}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>{wave.user}</Text>
              <Text style={styles.waveTime}>{wave.time}</Text>
            </View>
            <Text style={styles.wavePlatform}>{wave.platform}</Text>
          </View>
          <View style={styles.waveTrackInfo}>
            <Text style={styles.waveTrackTitle}>{wave.track}</Text>
            <Text style={styles.waveTrackArtist}>{wave.artist}</Text>
          </View>
          <View style={styles.waveActions}>
            <TouchableOpacity style={styles.waveReaction}>
              <Text>🔥 {wave.reactions}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.waveReaction}>
              <Text>❤️</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Wave');
  const [nowPlayingTrack, setNowPlayingTrack] = useState(null);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  const handleTrackPress = (track: any) => {
    setNowPlayingTrack(track);
    setShowNowPlaying(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Wave':
        return (
          <ScrollView style={styles.container}>
            <CoverFlow tracks={mockTracks} onTrackPress={handleTrackPress} />
            <WaveFeed waves={mockWaves} onTrackPress={handleTrackPress} />
          </ScrollView>
        );
      case 'Stations':
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.comingSoon}>🎵 Stations Coming Soon</Text>
          </View>
        );
      case 'Charts':
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.comingSoon}>📈 Charts Coming Soon</Text>
          </View>
        );
      case 'Profile':
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.comingSoon}>👤 Profile Coming Soon</Text>
          </View>
        );
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.app}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <Header title="Arch1v" />
      
      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['Wave', 'Stations', 'Charts', 'Profile'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.navTab, currentScreen === tab && styles.activeNavTab]}
            onPress={() => setCurrentScreen(tab)}
          >
            <Text style={[styles.navTabText, currentScreen === tab && styles.activeNavTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Now Playing Player */}
      <NowPlayingPlayer 
        track={nowPlayingTrack}
        isVisible={showNowPlaying}
        onClose={() => setShowNowPlaying(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavTab: {
    borderTopWidth: 2,
    borderTopColor: '#ff5500',
  },
  navTabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeNavTabText: {
    color: '#ff5500',
  },

  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 15,
    paddingHorizontal: 20,
  },

  // Cover Flow
  coverFlowContainer: {
    marginBottom: 30,
    paddingTop: 20,
  },
  coverFlowScroll: {
    paddingLeft: 20,
  },
  coverFlowItem: {
    marginRight: 15,
    alignItems: 'center',
    width: 120,
  },
  vinylCover: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
    marginBottom: 8,
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  vinylHole: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    marginTop: -10,
    marginLeft: -10,
  },
  coverTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
  },
  coverArtist: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },

  // Wave Feed
  waveFeedContainer: {
    paddingBottom: 20,
  },
  waveItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  waveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waveUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff5500',
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginRight: 8,
  },
  waveTime: {
    fontSize: 12,
    color: '#666',
  },
  wavePlatform: {
    fontSize: 12,
    color: '#ff5500',
    fontWeight: '500',
  },
  waveTrackInfo: {
    marginBottom: 10,
  },
  waveTrackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  waveTrackArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  waveActions: {
    flexDirection: 'row',
    gap: 15,
  },
  waveReaction: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  // Now Playing
  nowPlayingContainer: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 50,
  },
  nowPlayingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nowPlayingClose: {
    color: '#fff',
    fontSize: 18,
  },
  nowPlayingHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  vinylContainer: {
    alignItems: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  vinylRecord: {
    width: 250,
    height: 250,
    borderRadius: 125,
    position: 'relative',
  },
  vinylImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  vinylCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    marginTop: -20,
    marginLeft: -20,
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  trackArtist: {
    color: '#ccc',
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center',
  },
  trackQuality: {
    color: '#ff5500',
    fontSize: 12,
    marginTop: 5,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 30,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff5500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});
