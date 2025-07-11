import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prismaMaster } from "../config/prisma.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await prismaMaster.user.upsert({
                    where: { googleId: profile.id },
                    update: {},
                    create: {
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        role: "USER",
                    },
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;