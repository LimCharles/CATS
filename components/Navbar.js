import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = ({ session }) => {
  return (
    <div className="flex flex-row px-8 py-2 bg-clue items-center justify-between">
      <div className="flex flex-row gap-8">
        <Link href="/home">
          <Image alt="" src="/logo.png" width={50} height={50} />
        </Link>
        <Link
          href="/home"
          className="px-3 py-4 hover:text-cellow text-base trasition-all duration-150 text-white"
        >
          <p>HOME</p>
        </Link>
        {session?.user?.role == "Admin" && (
          <Link
            href="/home/manage"
            className="px-3 py-4 hover:text-cellow text-base trasition-all duration-150 text-white"
          >
            <p>MANAGE</p>
          </Link>
        )}
      </div>
      <button
        onClick={() => {
          signOut();
        }}
        className="px-3 py-4 hover:text-cellow text-base trasition-all duration-150 text-white"
      >
        <p>SIGN OUT </p>
      </button>
    </div>
  );
};

export default Navbar;
