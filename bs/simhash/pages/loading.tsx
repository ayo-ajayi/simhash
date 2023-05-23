import { useEffect, useState } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "next/router";
import { ThreeCircles, ThreeDots, CirclesWithBar } from "react-loader-spinner";

const App = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      router.push("/thanks")
    }, 2000);
  });
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex-h">
        <div className="bg-white rounded-lg p-10 shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            PhishVaccine
          </h1>
          {loading ? (
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
            ) : (
              " "
            )}
        
          <span>Please wait while we check the content...</span>
        </div>
      </div>
    </div>
  );
};

export default App;
