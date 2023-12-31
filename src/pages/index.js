import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "#components/Modal";

const SignIn = () => {
  const router = useRouter();

  //#region User Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((response) => {
        if (response.status == 200) {
          router.push("/home");
        } else {
          setLoading(false);
          setError("Invalid email or password");
          setEmail("");
          setPassword("");
        }
      })
      .catch((response) => {
        setLoading(false);
        setError("Invalid email or password");
        setEmail("");
        setPassword("");
      });
  };
  //#endregion

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      {/* Loading Modal */}
      <Modal hidden={!loading}>
        <div className="flex flex-col w-full gap-4 items-center h-40">
          <div className="flex flex-row gap-2 items-center">
            <Image alt="" src="/logo.png" width={30} height={30} />
            <p className="font-bold text-clue">CATS</p>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center grow">
            <p className="font-bold text-3xl">Loading</p>
            <div className="flex flex-row gap-2 justify-center">
              <svg
                className="animate-superbounce"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#0C3777" />
              </svg>
              <svg
                style={{
                  animationDelay: "0.3s",
                }}
                className="animate-superbounce"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#0C3777" />
              </svg>
              <svg
                style={{
                  animationDelay: "0.5s",
                }}
                className="animate-superbounce"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" fill="#0C3777" />
              </svg>
            </div>
          </div>
        </div>
      </Modal>

      <Image alt="" src="/logo.png" width={200} height={200} />
      <p className="font-bold text-4xl">Welcome to CATS</p>
      <p className="text-darkcrey text-lg">Cats of the Ateneo System</p>
      <form className="flex flex-col gap-1">
        <label className="font-semibold text-base w-96 text-left">Email</label>
        <input
          placeholder="charles.andrew.lim@obf.ateneo.edu"
          className="bg-chite leading-tight focus:outline-none focus:shadow-outline rounded-md px-4 py-3 border-[1px] border-crey text-base w-96"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setError("");
            setEmail(e.target.value);
          }}
        />
        <label className="font-semibold text-base w-96 text-left mt-4">
          Password
        </label>
        <input
          className="bg-chite leading-tight focus:outline-none focus:shadow-outline rounded-md px-4 py-3 border-[1px] border-crey text-base w-96"
          placeholder="********"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setError("");
            setPassword(e.target.value);
          }}
        />
        <button
          className="font-poppins font-semibold flex flex-row gap-2 justify-center items-center bg-clue  rounded-md text-white py-3 w-96 text-base mt-6"
          type="submit"
          onClick={(e) => {
            handleSignIn(e);
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
