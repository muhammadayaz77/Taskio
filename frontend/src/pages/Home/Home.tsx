import { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

function Home() {
  const [typingStatus, setTypingStatus] = useState("human1");
  return (
    <div className="home-page h-full grid grid-cols-12 relative max-w-screen-xl mx-auto">
      <div className="lg:col-span-6 col-span-12 pt-36 w-full">
        <img src="/orbital.png" alt="orbital" className="orbital bottom-5" />
        <div className="text-center mx-5">
          <h1 className="logo-head xl:text-9xl font-bold pb-6 md:text-7xl text-5xl">
            Blyzr AI
          </h1>
          <h2 className="md:text-xl text-lg font-semibold mb-3">
            Supercharge your creativity and productivity.
          </h2>
          <p className="mb-8 md:text-base text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta,
            ea.ladskf alksjd kasdj a orem lor laskdf laksjd lkasj slkd
          </p>
          <Link
            to="/dashboard"
            className="bg-[#217bfe] text-white py-3 px-5 rounded-full hover:bg-white hover:text-[#217bfe] transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="lg:col-span-6 col-span-12 flex justify-center lg:pt-36 md:pt-12 pt-6 w-full">
        <div className="imgContainer bg-[#140e2d] flex justify-center items-center rounded-[50px] h-[50%] md:w-[80%] w-full">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img
            src="/bot.png"
            alt="Bot Image"
            className="bot h-[100%] w-[100%] object-contain"
          />
          <div className="chat absolute bottom-[-30px] right-[-50px] flex items-center gap-5 rounded-[10px] object-cover bg-[#2c2937] p-3 z-10">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "human2.jpeg"
                  : "bot.png"
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Human : We produce food for Mice",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot : We produce food for Hamsters",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human2 : We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot : We produce food for Chinchillas",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="col-span-12 term w-full gap-2 mt-auto flex flex-col items-center">
        <img src="/logo.png" alt="" className="w-9 h-9" />
        <div className="text-gray-400 flex gap-2">
          <Link to="/">Terms of Service</Link>
          <span> | </span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
