import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcryptjs';

function setPassport(passport, getUserByEmail, getUserById) {
  async function authUser(email, password, done) {
    const user = await getUserByEmail(email);
    if (user == null) return done(null, false, { message: 'Invalid email' });
    try {
      //compare password from user VS database
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect Password' });
      }
    } catch (error) {
      return done(error);
    }
  }

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', 
      },
      authUser
    )
  );
  //get user id and save to session
  passport.serializeUser((user, done) => {
    console.log(`serial ${user.email} ${user.password} ${user.user_id}`);
    return done(null, user.user_id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id)
    console.log('Deserialized user:', user);
    return done(null, user);
  });
}

export default setPassport;
