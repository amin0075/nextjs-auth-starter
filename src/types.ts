export interface BetterAuthKitConfig {
  database: {
    connectionString: string;
  };
  auth: {
    secret: string;
    baseUrl: string;
    google?: {
      clientId: string;
      clientSecret: string;
    };
  };
  email?: {
    from: string;
    smtp?: {
      host: string;
      port: number;
      user: string;
      password: string;
    };
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
