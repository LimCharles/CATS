import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import DashboardBar from "../../public/DashboardBar.svg";
import Link from "next/link";
import axios from "axios";
import Modal from "#components/Modal";

const Register = () => {
  //#region Contact Form
  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const contactSchema = z.object({
    name: z.string().nonempty("Invalid Name. e.g. Bryan Go"),
    company: z.string().nonempty("Invalid Company. e.g. WayKo"),
    email: z.string().email("Invalid Email. e.g. bryan@wayko.com"),
    phoneNumber: z.string().nonempty("Invalid Phone Number. e.g. 09123456789"),
    message: z.string(),
  });

  const {
    clearErrors: clearContactFormErrors,
    register: registerContactForm,
    handleSubmit: handleContactFormSubmit,
    control: contactFormControl,
    reset: resetContactForm,
    formState: { errors: contactFormErrors },
    setValue: setContactFormValue,
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });
  //#endregion

  //#region Submit Contact
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitContact = async (data, e) => {
    setLoading(true);
    e.preventDefault();
    await axios
      .post("/api/contact/email", {
        data,
      })
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          resetContactForm();
          setError("");
          setSuccess(true);
        } else {
          setLoading(false);
          setError("Internal server error");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
        setLoading(false);
      });
  };

  //#endregion
  return (
    <div className="flex flex-row h-screen w-full overflow-x-hidden">
      {/* Loading Modal */}
      <Modal hidden={!loading}>
        <div className="flex flex-col w-full gap-4 items-center h-40">
          <div className="flex flex-row gap-2">
            <Image alt="" src="/logo.png" width={30} height={30} />
            <p className="font-bold text-transparent text-lg bg-clip-text bg-gradient-to-r from-clue to-creen">
              WayKo
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center grow">
            <p className="font-bold text-3xl">Emailing</p>
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

      {success ? (
        <div className="w-full grow flex flex-col justify-center px-28 gap-4">
          <div className="flex flex-row gap-2">
            <Image alt="" src="/logo.png" width={40} height={40} />
            <p className="font-bold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-clue to-creen">
              WayKo
            </p>
          </div>
          <p className="text-3xl font-semibold">
            Your details have been submitted
          </p>
          <p className="font-base text-lg">
            We&apos;ll be sending a message via email or text
          </p>

          <Link href="/">
            <div className="flex flex-row gap-4 items-center">
              <p className="text-darkcrey font-base text-lg">
                Go back to home page
              </p>
              <svg
                width="23"
                height="24"
                viewBox="0 0 23 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 0.800781L9.47313 2.82766L17.4944 10.8633H0V13.7383H17.4944L9.47313 21.7739L11.5 23.8008L23 12.3008L11.5 0.800781Z"
                  fill="#7E8B9E"
                />
              </svg>
            </div>
          </Link>
        </div>
      ) : (
        <div className="w-full grow flex flex-col justify-center px-28 gap-4">
          <div className="flex flex-row gap-2">
            <Image alt="" src="/logo.png" width={40} height={40} />
            <p className="font-bold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-clue to-creen">
              WayKo
            </p>
          </div>
          <p className="text-4xl font-bold">Get Started</p>
          <p className="font-base text-lg">
            Input your details below and we’ll connect you for a product demo
          </p>
          <form
            onSubmit={handleContactFormSubmit(submitContact)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-left text-xs text-clack font-light"
              >
                Name
              </label>
              <input
                className="placeholder-darkcrey text-sm rounded-md appearance-none border-[1px] border-darkcrey w-full max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                type="text"
                name="name"
                id="name"
                placeholder="Enter your full name"
                {...registerContactForm("name", {
                  required: true,
                })}
              />
              <p className="text-[11px] font-light text-red-600 text-left h-2">
                {contactFormErrors.name?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="company"
                className="text-left text-xs text-clack font-light"
              >
                Company
              </label>
              <input
                className="placeholder-darkcrey text-sm rounded-md appearance-none border-[1px] border-darkcrey w-full max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                type="text"
                name="company"
                id="company"
                placeholder="Enter your company"
                {...registerContactForm("company", {
                  required: true,
                })}
              />
              <p className="text-[11px] font-light text-red-600 text-left h-2">
                {contactFormErrors.company?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-left text-xs text-clack font-light"
              >
                Email
              </label>
              <input
                className="placeholder-darkcrey text-sm rounded-md appearance-none border-[1px] border-darkcrey w-full max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                {...registerContactForm("email", {
                  required: true,
                })}
              />
              <p className="text-[11px] font-light text-red-600 text-left h-2">
                {contactFormErrors.email?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phonenumber"
                className="text-left text-xs text-clack font-light"
              >
                Phone Number
              </label>
              <input
                className="placeholder-darkcrey text-sm rounded-md appearance-none border-[1px] border-darkcrey w-full max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light"
                type="text"
                id="phonenumber"
                name="phonenumber"
                placeholder="Enter your phone number"
                {...registerContactForm("phoneNumber", {
                  required: true,
                })}
              />
              <p className="text-[11px] font-light text-red-600 text-left h-2">
                {contactFormErrors.phoneNumber?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="message"
                className="text-left text-xs text-clack font-light"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="placeholder-darkcrey text-sm rounded-md appearance-none border-[1px] border-darkcrey w-full max-w-[650px] py-2 px-3 leading-tight focus:outline-none focus:shadow-outline font-light h-24 resize-none"
                type="text"
                autoComplete="off"
                placeholder="Type your message"
                {...registerContactForm("message", {
                  required: false,
                })}
              />
              <p className="text-[11px] font-light text-red-600 text-left h-2">
                {contactFormErrors.message?.message}
              </p>
              <button
                type="submit"
                className="font-poppins font-medium flex flex-row gap-2 justify-center items-center bg-gradient-to-r from-clue to-creen rounded-md text-white py-4 w-48 text-lg"
              >
                Submit
              </button>
            </div>
          </form>
          <Link href="/signin">
            <div className="flex flex-row gap-4 items-center">
              <p className="text-darkcrey font-base text-lg">
                Go back to login page
              </p>
              <svg
                width="23"
                height="24"
                viewBox="0 0 23 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 0.800781L9.47313 2.82766L17.4944 10.8633H0V13.7383H17.4944L9.47313 21.7739L11.5 23.8008L23 12.3008L11.5 0.800781Z"
                  fill="#7E8B9E"
                />
              </svg>
            </div>
          </Link>
        </div>
      )}
      <div className="w-1/2 relative overflow-hidden">
        <Image
          alt="dashboardBar"
          src={DashboardBar}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default Register;
