import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

function setPassport(passport, getUserByEmail, getUserById) {
  async function authUser(email, password, done) {
    const user = await getUserByEmail(email);

    try {
      if (user == null) {
        return done(null, false);
      }
      //compare password from user VS database
      if (await bcrypt.compare(password, user.password)) {
        console.log('authen success');
        return done(null, user);
      } else {
        return done(null, false);
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
    console.log('serialize');
    return done(null, user.user_id);
  });

  //call user by user id that is saved in session
  passport.deserializeUser(async (id, done) => {
    console.log('DEserialize');
    const user = await getUserById(id);
    return done(null, user);
  });
}

export default setPassport;
