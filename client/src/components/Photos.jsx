import React from "react";

const Photos = (props) => {
  return (
    <div className="crop">
      <img
        src={`data:image/png;base64,${props.img}`}
        alt={props.title}
        className=" rounded card-img-top "
      />
    </div>
  );
};

export default Photos;
