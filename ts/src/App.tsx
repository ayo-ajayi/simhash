//import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CirclesWithBar, ThreeDots } from "react-loader-spinner";
import styled from "styled-components";
import "./index.css";
import Typewriter from "typewriter-effect";

interface Form {
  subject: string;
  text: string;
}
interface Data {
  time: any;
  similar_items: any;
}
function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userID, setUserID] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<Data>({
    time: null,
    similar_items: null,
  });
  const [formState, setFormState] = useState<Form>({
    subject: "",
    text: "",
  });
  const triesRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) {
      setLoading(true);
      axios
        .post("https://simhash-go.onrender.com/post", {
          subject: formState.subject,
          text: formState.text,
        })
        .then((res) => {
          setUserID(res.data.response.id);
        })
        .catch((e) => {
          console.log("error", e);
        });
    }
  };

  useEffect(() => {
    if (userID) {
      axios
        .get(`https://simhash-py.onrender.com/detect-similarity/${userID}`)
        .then((resp) => {
          setAnalysisData(resp.data.response);
        })
        .then(() => {
          if (triesRef.current) {
            triesRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the "tries" div
          }
          setLoading(false);
          setFormState({ subject: "", text: "" });
          setUserID("")
        })
        .catch((e) => console.log("error:", e));
    }
  }, [userID]);

  return (
    <>
      <div className="font-mono flex flex-wrap justify-center items-center md:flex-no-wrap">
        <div className="flex-item flex flex-col h-screen justify-center items-center space-y-7 rounded-lg p-10 shadow-lg b-yellow basis-3/6">
          <h2>Are you Phishing?</h2>
          <form
            autoComplete="on"
            onSubmit={handleSubmit}
            className="space-y-7 flex flex-col p-12 rounded-lg items-center"
          >
            <div className="flex relative items-center justify-end">
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                autoComplete="on"
                value={formState.subject}
                style={inputStyle}
                onChange={handleChange}
                className="border-2 rounded-md"
              />
            </div>

            <div className="flex relative items-center justify-end">
              <textarea
                placeholder="Text"
                autoComplete="on"
                name="text"
                value={formState.text}
                style={inputStyle}
                onChange={handleChange}
                className="h-40"
              ></textarea>
            </div>

            <button
              className="rounded bg-slate-400 hover:bg-slate-500 text-white shadow p-1 w-full flex justify-center items-center"
              style={{
                maxWidth: "500px",
                maxHeight: "620px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {loading ? (
                <ThreeDots
                  height="22"
                  width="50"
                  radius="9"
                  color="white"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              ) : (
                " Submit"
              )}
            </button>
          </form>
          <div className="text-xs text-slate-500 justify-center items-center p-2">
            <Typewriter
              options={{
                strings: ["Locality-Sensitive Hashing is a technique that allows for efficient approximation of nearest neighbor searches in high-dimensional data; similar items are hashed to the same 'bucket' with high probability."],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
          <Footer className="text-sm text-slate-300 p-50">{`© Tuguldur Akshan Ayomide ${year}`}</Footer>
        </div>

        <div
          ref={triesRef}
          className="flex-item flex flex-col h-screen justify-center items-center space-y-7 p-12 rounded-lg shadow-lg b-yellow basis-3/6"
        >
          <div className="flex flex-col justify-center items-center relative space-y-7 rounded-lg p-12">
            <CirclesWithBar
              height="100"
              width="100"
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              outerCircleColor=""
              innerCircleColor=""
              barColor=""
              ariaLabel="circles-with-bar-loading"
            />
            <div
              className="flex flex-col"
              style={{
                minWidth: "230px",
              }}
            >
              <h2 className="flex">Results of Analysis</h2>
              <div className="flex text-sm">Time: {analysisData.time}</div>
              <div className="flex text-sm">
                Similar Items: {analysisData.similar_items}
              </div>
            </div>
          </div>
          <Footer className="visible md:invisible text-sm text-slate-300 p-50">{`© Tuguldur Akshan Ayomide ${year}`}</Footer>
        </div>
      </div>
    </>
  );
}

export default App;
const year = new Date().getFullYear();
const inputStyle = {
  padding: "5px",
  fontFamily: "'Inter', sans-serif",
  width: "250px",
  maxWidth: "400px",
  border: "1px solid",
  borderRadius: "0.375rem",
};
const Footer = styled.div``;
