export class userSignUp {
    email: string;
    password: string;
    fullName:{
      firstName: string;
      lastName: string;
    };
    birthdate: string;
  
    constructor(
      email: string,
      password: string,
      fullName:{
        firstName: string;
        lastName: string;
      },
      birthdate: string
    ) {
      this.email = email;
      this.password = password;
      this.fullName = fullName
      this.birthdate = birthdate;
    }
}

export class userSignIn {
    email: string;
    password: string;
  
    constructor(
      email: string,
      password: string,
    ) {
      this.email = email;
      this.password = password;

    }
}