import React from 'react';
import { useState } from 'react';
import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from "next/router";
import { ThreeCircles, ThreeDots } from "react-loader-spinner";

const App = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  const handleContentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!loading) {
      setLoading(true);
      axios
        .post("http://localhost:8000/post", {
          user: email,
          mailcontent: content,
        })
        .then((res) => {
          router.push("/loading");
        })
        .catch((e) => {
          console.log(e)
          setLoading(false);
        });
    }
  
    setEmail('');
    setContent('');
  };
  return (
    <div className="h-screen flex justify-center items-center">
    <div className="bg-white rounded-lg p-10 shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">PhishVaccine</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-800 text-lg mb-2" htmlFor="email">Your Email Address</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-lg mb-2" htmlFor="emailContent">Upload content:</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            id="emailContent"
            rows={5}
            value={content}
            onChange={handleContentChange}
            required
          ></textarea>
        </div>
        <div className="text-center">
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
              "Submit"
            )}
          </button>
        </div>

      </form>
    </div>
  </div>
  );
};

export default App;
