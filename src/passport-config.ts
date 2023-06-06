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
<<<<<<< HEAD
    console.log('Serialized user:', user);
=======
>>>>>>> 839ab5c (routine routes)
    return done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    const {user_id,username,email} = user
<<<<<<< HEAD
    console.log('Deserialized user:', user_id, username, email);
    return done(null, user_id, username, email);
=======
    console.log('Deserialized user:', user);
    return done(null, user);
>>>>>>> 839ab5c (routine routes)
  });
}

export default setPassport;
