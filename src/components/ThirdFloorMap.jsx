import React from 'react';

const ThirdFloorMap = () => {
  return (
    <div className="w-full relative overflow-hidden flex items-center justify-center rounded-[1.5rem] bg-[#1a1a1a] h-full min-h-[400px]">
      
      {/* 
        We use an image container that is taller than the wrapper to hide the bottom legend.
        Adjust the 'height' down slightly if the legend still peaks through!
      */}
      <div className="absolute top-0 left-0 w-full h-[115%]">
         <img 
            src="/3rd.png" // Save your 3rd floor plan image in the public folder as 3rd.png
            alt="3rd Floor Map" 
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
            onError={(e) => { 
              // Fallback to other known images if 3rd.png isn't found
              e.currentTarget.onerror = null; 
              e.currentTarget.src = '/other.png'; 
            }}
         />
      </div>

    </div>
  );
};

export default ThirdFloorMap;
