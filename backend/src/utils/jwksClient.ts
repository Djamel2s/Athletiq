import { createRemoteJWKSet, jwtVerify } from 'jose';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

export const getJwks = (issuer: string) => {
  if (jwks) return jwks;
  const url = issuer.replace(/\/$/, '') + '/.well-known/jwks.json';
  jwks = createRemoteJWKSet(new URL(url));
  return jwks;
};

export const verifyJwtWithJwks = async (token: string, issuer: string) => {
  const jwksClient = getJwks(issuer);
  const { payload } = await jwtVerify(token, jwksClient, {
    issuer,
  } as any);
  return payload as Record<string, any>;
};
