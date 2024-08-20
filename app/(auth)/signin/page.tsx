"use client";

import React, { useState, KeyboardEvent } from "react";
import "../signup//signup.scss";
import { Helmet } from "react-helmet";
import { BsEnvelopeArrowUpFill } from "react-icons/bs";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";
import { RiLockPasswordFill } from "react-icons/ri";
import { BiSolidSend } from "react-icons/bi";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [step, setStep] = useState(0);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep();
    }
  };

  return (
    <>
      <Helmet>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,700,900"
          rel="stylesheet"
          type="text/css"
        />
      </Helmet>
      <div className="back">
        <div className="registration-form border-white">
          <header>
            <h1>Sign In</h1>
            <p>Fill in all information</p>
          </header>
          <form>
            <div
              className={`input-section email-section ${
                step > 0 ? "fold-up" : ""
              }`}
            >
              <input
                type="email"
                placeholder="ENTER YOUR E-MAIL HERE"
                autoComplete="off"
                className="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
              />
              <div className="animated-button ">
                <span className={`icon-paper-plane text-2xl ${email ? "next" : ""}`}>
                  <BsEnvelopeArrowUpFill />
                </span>
                <span
                  className="next-button email cursor-pointer text-2xl"
                  onClick={() => email && handleNextStep()}
                >
                  <TbArrowBigUpLinesFilled />
                </span>
              </div>
            </div>
            <div
              className={`input-section repeat-password-section ${
                step === 1 ? "" : "folded"
              }`}
            >
              <input
                type="password"
                placeholder="REPEAT YOUR PASSWORD HERE"
                className="repeat-password"
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                onKeyPress={handleKeyPress}
              />
              <div className="animated-button">
                <span
                  className={`icon-repeat-lock text-2xl ${repeatPassword ? "next" : ""}`}
                >
                  <RiLockPasswordFill />
                </span>
                <span
                  className="next-button text-2xl cursor-pointer repeat-password"
                  onClick={() => repeatPassword && handleNextStep()}
                >
                 <BiSolidSend />
                </span>
              </div>
            </div>
            <div
              className="success"
              style={{ marginTop: step === 2 ? 0 : "-75px" }}
            >
              <p>Welcome back!</p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;