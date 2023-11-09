import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex flex-row px-8 py-2 bg-clue items-center justify-between">
      <div className="flex flex-row gap-8">
        <Image alt="" src="/logo.png" width={50} height={50} />
        <Link
          href="/admin"
          className="px-3 py-4 hover:text-cellow text-base trasition-all duration-150 text-white"
        >
          <p>HOME</p>
        </Link>
        <Link
          href="/admin/manage"
          className="px-3 py-4 hover:text-cellow text-base trasition-all duration-150 text-white"
        >
          <p>MANAGE</p>
        </Link>
      </div>
      <a
        href="/admin/manage"
        className="px-3 py-4 hover:text-cellow text-base trasition-all duration-150 text-white"
      >
        <p>SIGN OUT </p>
      </a>
    </div>
  );
};

export default Navbar;
