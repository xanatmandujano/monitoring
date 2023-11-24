import React, { useState, useEffect } from "react";
import axios from "axios";

const TestElement = () => {
  const [image, setImage] = useState();

  useEffect(() => {
    const getSfrImage = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: `http://192.168.1.138:8086/person/ad1928d0-a802-461d-ab97-7bb1a7643064/face`,
          headers: {
            "X-RPC-DIRECTORY": "main",
            "X-RPC-AUTHORIZATION": "g2kgroup4:Administrator123%",
          },
        }).then((res) => {
          console.log(res.data);
          setImage(res.data);
          console.log(image);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getSfrImage();
  }, []);

  return (
    <>
      <img src={image} />
    </>
  );
};

export default TestElement;
