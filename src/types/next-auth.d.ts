import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    spotifyId: string;
    spotifyProfile: {
      id: string;
      display_name: string;
      email: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
      followers: {
        total: number;
      };
      country: string;
      product: string;
    };
  }

  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    spotifyId: string;
    spotifyProfile: any;
  }
}
