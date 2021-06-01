import { v4 as uuid } from "uuid";

interface SignInRequestProps {
  email: string;
  password: string;
}

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestProps) {
  await delay();

  return {
    token: uuid(),
    user: {
      name: "Avner José",
      email: "avnerj.g.r@gmail.com",
      avatar: "https://github.com/avnerjose.png",
    },
  };
}

export async function recoverUserInfo() {
  await delay();

  return {
    user: {
      name: "Avner José",
      email: "avnerj.g.r@gmail.com",
      avatar: "https://github.com/avnerjose.png",
    },
  };
}
