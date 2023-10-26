import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex flex-row px-8 py-3 bg-clue items-center gap-8">
      <Image alt="" src="/logo.png" width={100} height={200} />
      <Link
        href="/admin"
        className="px-3 py-4 hover:text-cellow text-xl trasition-all duration-150 text-white"
      >
        <p>HOME</p>
      </Link>
      <Link
        href="/admin/manage"
        className="px-3 py-4 hover:text-cellow text-xl trasition-all duration-150 text-white"
      >
        <p>MANAGE</p>
      </Link>
    </div>
  );
};

export default Navbar;
