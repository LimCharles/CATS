import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-row bg-white shadow-md justify-between items-center px-20 z-10">
        <div className="flex flex-row py-7 items-center gap-4">
          <Image alt="" src="/logo.png" width={40} height={40} />
          <p className="font-bold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-clue to-creen">
            WayKo
          </p>
        </div>
        <Link href="/register">
          <button
            type="button"
            className="font-poppins font-medium flex flex-row gap-2 justify-center items-center bg-gradient-to-r from-clue to-creen rounded-md text-white py-2 w-48 h-12 text-lg"
          >
            Get Started
          </button>
        </Link>
      </div>
      <div
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "200% 400%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex flex-col items-center justify-center py-8 gap-8 z-0"
      >
        <p className="font-semibold text-4xl leading-relaxed text-center">
          Automate route delegation <br /> and optimization instantly
        </p>
        <p className="text-clue font-base text-4xl text-center">
          Reduce Backload
        </p>
        <p className="text-lightclack text-lg text-center">
          Trusted by distribution firms across the nation,
          <br /> efficiently handling{" "}
          <span className="font-bold">hundreds of daily deliveries</span>.
        </p>
        <div className="flex flex-row gap-8">
          <Link href="/register">
            <button
              type="button"
              className="font-poppins font-medium flex flex-row gap-2 justify-center items-center bg-gradient-to-r from-clue to-creen rounded-md text-white py-3 w-44 text-lg"
            >
              Get Started
            </button>
          </Link>
          <button
            onClick={() => {}}
            className="font-poppins font-medium flex flex-row gap-2 justify-center items-center text-clue rounded-md border-[1px] border-creen py-3 w-44 text-lg"
          >
            How it works
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center py-8 bg-lightclue gap-4 flex-wrap">
        <div className="border-[1.5px] border-clue rounded-lg px-8 py-4 flex flex-col bg-white gap-2 w-80">
          <div className="flex flex-row gap-5 items-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.8 0H2.2C1.1 0 0 0.99 0 2.2V5.511C0 6.303 0.473 6.985 1.1 7.37V19.8C1.1 21.01 2.31 22 3.3 22H18.7C19.69 22 20.9 21.01 20.9 19.8V7.37C21.527 6.985 22 6.303 22 5.511V2.2C22 0.99 20.9 0 19.8 0ZM14.3 13.2H7.7V11H14.3V13.2ZM19.8 5.5H2.2V2.2L19.8 2.178V5.5Z"
                fill="url(#paint0_linear_155_6)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_155_6"
                  x1="0"
                  y1="11"
                  x2="25.5"
                  y2="11"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C3777" />
                  <stop offset="1" stopColor="#00693D" />
                </linearGradient>
              </defs>
            </svg>
            <p className="font-semibold text-transparent text-lg bg-clip-text bg-gradient-to-r from-clue to-creen">
              Reduce Backload
            </p>
          </div>
          <p>
            Our systems ensures
            <br /> assigned deliveries are <br />
            accomplished within the day.
          </p>
        </div>
        <div className="border-[1.5px] border-clue rounded-lg px-8 py-4 flex flex-col bg-white gap-2 w-80">
          <div className="flex flex-row gap-5 items-center">
            <svg
              width="21"
              height="24"
              viewBox="0 0 21 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.6667 2.8H13.79C13.3 1.466 12.0167 0.5 10.5 0.5C8.98333 0.5 7.7 1.466 7.21 2.8H2.33333C1.05 2.8 0 3.835 0 5.1V21.2C0 22.465 1.05 23.5 2.33333 23.5H18.6667C19.95 23.5 21 22.465 21 21.2V5.1C21 3.835 19.95 2.8 18.6667 2.8ZM10.5 2.8C11.1417 2.8 11.6667 3.3175 11.6667 3.95C11.6667 4.5825 11.1417 5.1 10.5 5.1C9.85833 5.1 9.33333 4.5825 9.33333 3.95C9.33333 3.3175 9.85833 2.8 10.5 2.8ZM12.8333 18.9H4.66667V16.6H12.8333V18.9ZM16.3333 14.3H4.66667V12H16.3333V14.3ZM16.3333 9.7H4.66667V7.4H16.3333V9.7Z"
                fill="url(#paint0_linear_170_16)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_170_16"
                  x1="-2.34693e-07"
                  y1="12"
                  x2="27"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C3777" />
                  <stop offset="1" stopColor="#00693D" />
                </linearGradient>
              </defs>
            </svg>

            <p className="font-semibold text-transparent text-lg bg-clip-text bg-gradient-to-r from-clue to-creen">
              Avoid Penalties
            </p>
          </div>
          <p>
            Eliminate annual fees <br />
            incurred from missing due <br /> dates.
          </p>
        </div>
        <div className="border-[1.5px] border-clue rounded-lg px-8 py-4 flex flex-col bg-white gap-2 w-80">
          <div className="flex flex-row gap-5 items-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.881 12.0771C18.9269 11.7333 18.9498 11.3781 18.9498 11C18.9498 10.6333 18.9269 10.2667 18.8696 9.92292L21.1956 8.1125C21.4019 7.95208 21.4592 7.64271 21.3331 7.41354L19.1331 3.60937C18.9956 3.35729 18.7092 3.27708 18.4571 3.35729L15.7185 4.45729C15.1456 4.02187 14.5383 3.65521 13.8623 3.38021L13.4498 0.469791C13.404 0.194791 13.1748 0 12.8998 0H8.49979C8.22479 0 8.00708 0.194791 7.96125 0.469791L7.54875 3.38021C6.87271 3.65521 6.25396 4.03333 5.6925 4.45729L2.95396 3.35729C2.70187 3.26562 2.41542 3.35729 2.27792 3.60937L0.0893754 7.41354C-0.0481246 7.65417 -0.0022914 7.95208 0.226875 8.1125L2.55292 9.92292C2.49563 10.2667 2.44979 10.6448 2.44979 11C2.44979 11.3552 2.47271 11.7333 2.53 12.0771L0.203959 13.8875C-0.00229138 14.0479 -0.0595829 14.3573 0.0664587 14.5865L2.26646 18.3906C2.40396 18.6427 2.69042 18.7229 2.9425 18.6427L5.68104 17.5427C6.25396 17.9781 6.86125 18.3448 7.53729 18.6198L7.94979 21.5302C8.00708 21.8052 8.22479 22 8.49979 22H12.8998C13.1748 22 13.404 21.8052 13.4383 21.5302L13.8508 18.6198C14.5269 18.3448 15.1456 17.9781 15.7071 17.5427L18.4456 18.6427C18.6977 18.7344 18.9842 18.6427 19.1217 18.3906L21.3217 14.5865C21.4592 14.3344 21.4019 14.0479 21.1842 13.8875L18.881 12.0771ZM10.6998 15.125C8.43104 15.125 6.57479 13.2687 6.57479 11C6.57479 8.73125 8.43104 6.875 10.6998 6.875C12.9685 6.875 14.8248 8.73125 14.8248 11C14.8248 13.2687 12.9685 15.125 10.6998 15.125Z"
                fill="url(#paint0_linear_170_12)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_170_12"
                  x1="3.08914e-07"
                  y1="11"
                  x2="25"
                  y2="11"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C3777" />
                  <stop offset="1" stopColor="#00693D" />
                </linearGradient>
              </defs>
            </svg>
            <p className="font-semibold text-transparent text-lg bg-clip-text bg-gradient-to-r from-clue to-creen">
              Consistent Reliability
            </p>
          </div>
          <p>
            We remove the faults that <br />
            human error can cause in
            <br /> optimizing routes.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center my-12">
        <p className="font-bold text-lg my-8">
          How our route optimization works
        </p>
        <div className="flex flex-row items-center justify-center gap-8 flex-wrap">
          <div className="border-creen border-[1.5px] py-4 px-6 rounded-lg flex flex-col h-80 w-96">
            <div className="flex flex-row gap-4">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32.7"
                  height="32.6964"
                  rx="16.3482"
                  fill="#0C3777"
                />
                <path
                  d="M13.755 13.2832V10.8982H17.91V21.8482H15.24V13.2832H13.755Z"
                  fill="white"
                />
              </svg>
              <p className="font-medium text-lg">
                Select all customers you have to attend to and available drivers
                for the day
              </p>
            </div>
            <Image alt="" src="/customerlist.png" width={450} height={450} />
          </div>
          <div className="border-creen border-[1.5px] py-4 px-6 rounded-lg flex flex-col h-80 w-96">
            <div className="flex flex-row gap-4">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32.7"
                  height="32.6964"
                  rx="16.3482"
                  fill="#0C3777"
                />
                <path
                  d="M12.435 19.7932C12.775 19.5232 12.93 19.3982 12.9 19.4182C13.88 18.6082 14.65 17.9432 15.21 17.4232C15.78 16.9032 16.26 16.3582 16.65 15.7882C17.04 15.2182 17.235 14.6632 17.235 14.1232C17.235 13.7132 17.14 13.3932 16.95 13.1632C16.76 12.9332 16.475 12.8182 16.095 12.8182C15.715 12.8182 15.415 12.9632 15.195 13.2532C14.985 13.5332 14.88 13.9332 14.88 14.4532H12.405C12.425 13.6032 12.605 12.8932 12.945 12.3232C13.295 11.7532 13.75 11.3332 14.31 11.0632C14.88 10.7932 15.51 10.6582 16.2 10.6582C17.39 10.6582 18.285 10.9632 18.885 11.5732C19.495 12.1832 19.8 12.9782 19.8 13.9582C19.8 15.0282 19.435 16.0232 18.705 16.9432C17.975 17.8532 17.045 18.7432 15.915 19.6132H19.965V21.6982H12.435V19.7932Z"
                  fill="white"
                />
              </svg>
              <p className="font-medium text-lg">
                WayKo determines feasible routes for all <br />
                trucks instantly
              </p>
            </div>
            <div className="flex flex-row items-center justify-center h-full">
              <Image alt="" src="/driverlist.png" width={400} height={400} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-12 pb-24">
        <p className="font-bold text-xl">
          From your hundreds of orders, we process all feasible deliveries and
          arrange them
        </p>
        <div className="grid grid-cols-3 grid-rows-5 my-8 [&>*]:px-1 [&>*]:py-2 [&>*]:sm:px-4 [&>*]:sm:py-6">
          <div className="col-span-1"></div>
          <div className="col-span-1 flex flex-row items-center justify-center gap-2 bg-lightclue">
            <Image alt="" src="/logo.png" width={35} height={35} />
            <p className="font-bold text-2xl text-clue hidden sm:block">
              WayKo
            </p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center">
            <p className="text-lg font-medium text-center">Current Solutions</p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-start border-b-[1px] border-b-clack">
            <p className="text-lg font-medium">Optimization Speed</p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack bg-lightclue">
            <p className="text-lg font-bold text-creen">{"<"}10 Seconds</p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack">
            <p className="text-lg font-medium">{">"}2 Hours</p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-start border-b-[1px] border-b-clack">
            <p className="text-lg font-medium">
              Removes <br />
              unnecessary costs
            </p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack bg-lightclue">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.2675 9.00163L12.8333 19.4358L7.14917 13.7675L4.91667 16L12.8333 23.9166L25.5 11.25L23.2675 9.00163ZM16 0.166626C7.26 0.166626 0.166672 7.25996 0.166672 16C0.166672 24.74 7.26 31.8333 16 31.8333C24.74 31.8333 31.8333 24.74 31.8333 16C31.8333 7.25996 24.74 0.166626 16 0.166626ZM16 28.6666C9.00167 28.6666 3.33334 22.9983 3.33334 16C3.33334 9.00163 9.00167 3.33329 16 3.33329C22.9983 3.33329 28.6667 9.00163 28.6667 16C28.6667 22.9983 22.9983 28.6666 16 28.6666Z"
                fill="#00693D"
              />
            </svg>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_64_112)">
                <path
                  d="M19 3.16663C10.26 3.16663 3.16666 10.26 3.16666 19C3.16666 27.74 10.26 34.8333 19 34.8333C27.74 34.8333 34.8333 27.74 34.8333 19C34.8333 10.26 27.74 3.16663 19 3.16663ZM19 31.6666C12.0017 31.6666 6.33332 25.9983 6.33332 19C6.33332 12.0016 12.0017 6.33329 19 6.33329C25.9983 6.33329 31.6667 12.0016 31.6667 19C31.6667 25.9983 25.9983 31.6666 19 31.6666Z"
                  fill="black"
                />
                <path
                  d="M12 13.41L13.41 12L19 17.59L24.59 12L26 13.41L20.41 19L26 24.59L24.59 26L19 20.41L13.41 26L12 24.59L17.59 19L12 13.41Z"
                  fill="black"
                  stroke="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_64_112">
                  <rect width="38" height="38" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-start border-b-[1px] border-b-clack">
            <p className="text-lg font-medium">
              Precise route assignment and <br />
              optimization
            </p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack bg-lightclue">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.2675 9.00163L12.8333 19.4358L7.14917 13.7675L4.91667 16L12.8333 23.9166L25.5 11.25L23.2675 9.00163ZM16 0.166626C7.26 0.166626 0.166672 7.25996 0.166672 16C0.166672 24.74 7.26 31.8333 16 31.8333C24.74 31.8333 31.8333 24.74 31.8333 16C31.8333 7.25996 24.74 0.166626 16 0.166626ZM16 28.6666C9.00167 28.6666 3.33334 22.9983 3.33334 16C3.33334 9.00163 9.00167 3.33329 16 3.33329C22.9983 3.33329 28.6667 9.00163 28.6667 16C28.6667 22.9983 22.9983 28.6666 16 28.6666Z"
                fill="#00693D"
              />
            </svg>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_64_112)">
                <path
                  d="M19 3.16663C10.26 3.16663 3.16666 10.26 3.16666 19C3.16666 27.74 10.26 34.8333 19 34.8333C27.74 34.8333 34.8333 27.74 34.8333 19C34.8333 10.26 27.74 3.16663 19 3.16663ZM19 31.6666C12.0017 31.6666 6.33332 25.9983 6.33332 19C6.33332 12.0016 12.0017 6.33329 19 6.33329C25.9983 6.33329 31.6667 12.0016 31.6667 19C31.6667 25.9983 25.9983 31.6666 19 31.6666Z"
                  fill="black"
                />
                <path
                  d="M12 13.41L13.41 12L19 17.59L24.59 12L26 13.41L20.41 19L26 24.59L24.59 26L19 20.41L13.41 26L12 24.59L17.59 19L12 13.41Z"
                  fill="black"
                  stroke="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_64_112">
                  <rect width="38" height="38" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-start border-b-[1px] border-b-clack">
            <p className="text-lg font-medium">No Human Error</p>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack bg-lightclue">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.2675 9.00163L12.8333 19.4358L7.14917 13.7675L4.91667 16L12.8333 23.9166L25.5 11.25L23.2675 9.00163ZM16 0.166626C7.26 0.166626 0.166672 7.25996 0.166672 16C0.166672 24.74 7.26 31.8333 16 31.8333C24.74 31.8333 31.8333 24.74 31.8333 16C31.8333 7.25996 24.74 0.166626 16 0.166626ZM16 28.6666C9.00167 28.6666 3.33334 22.9983 3.33334 16C3.33334 9.00163 9.00167 3.33329 16 3.33329C22.9983 3.33329 28.6667 9.00163 28.6667 16C28.6667 22.9983 22.9983 28.6666 16 28.6666Z"
                fill="#00693D"
              />
            </svg>
          </div>
          <div className="col-span-1 flex flex-row items-center justify-center border-b-[1px] border-b-clack">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_64_112)">
                <path
                  d="M19 3.16663C10.26 3.16663 3.16666 10.26 3.16666 19C3.16666 27.74 10.26 34.8333 19 34.8333C27.74 34.8333 34.8333 27.74 34.8333 19C34.8333 10.26 27.74 3.16663 19 3.16663ZM19 31.6666C12.0017 31.6666 6.33332 25.9983 6.33332 19C6.33332 12.0016 12.0017 6.33329 19 6.33329C25.9983 6.33329 31.6667 12.0016 31.6667 19C31.6667 25.9983 25.9983 31.6666 19 31.6666Z"
                  fill="black"
                />
                <path
                  d="M12 13.41L13.41 12L19 17.59L24.59 12L26 13.41L20.41 19L26 24.59L24.59 26L19 20.41L13.41 26L12 24.59L17.59 19L12 13.41Z"
                  fill="black"
                  stroke="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_64_112">
                  <rect width="38" height="38" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-clue flex flex-col lg:px-48 md:px-32 px-8 py-10 gap-5">
        <div className="flex flex-row gap-2">
          <Image alt="" src="/logoWhite.png" width={40} height={40} />
          <p className="font-bold text-2xl text-white">WayKo</p>
        </div>
        <p className="text-white font-base text-lg">
          Trusted by distribution firms across the nation, <br />
          efficiently handling hundreds of daily deliveries.
        </p>{" "}
        <Link href="/register">
          <button
            type="button"
            className="font-poppins font-medium flex flex-row gap-2 justify-center items-center bg-white rounded-md text-white py-3 w-48 h-12 text-lg"
          >
            <p className="font-medium text-transparent text-lg bg-clip-text bg-gradient-to-r from-clue to-creen">
              Get Started
            </p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
