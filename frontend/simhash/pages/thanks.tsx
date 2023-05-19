import Stat from '@/component/stat';
import React from 'react';
import Image from 'next/image'

function Thanks() {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="bg-white rounded-lg p-10 shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">PhishVaccine</h1>
          <div className="flex justify-center">
            <Image
              src="/1.png"
              width={600}   // increased width
              height={600}  // increased height
              alt="logo"
              className="mx-auto"
            />
          </div>
          <p>Thanks for using our service...Be safe</p>
        </div>
      </div>
    );
}

export default Thanks;
