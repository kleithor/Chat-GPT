import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github';

import AllowedUsers from '../../../users';

export type GithubOrganization = {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile: async (user) => {
        const githubUser = user as GithubProfile;
        if (
          !AllowedUsers.usernames.some(
            (username) => username === githubUser.login,
          ) &&
          !AllowedUsers.emails.some((email) => email === githubUser.email)
        ) {
          throw new Error('Du hast keinen Zugriff auf diese Anwendung');
        }

        return { ...user, image: githubUser.avatar_url };
      },
    }),
  ],
  theme: {
    logo: '/favicon.ico',
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'member';
      return token;
    },
  },
};

export default NextAuth(authOptions);
