import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Illustration } from "./Illustration";
import classes from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div
          className={
            classes.content +
            " h-screen flex flex-col items-center justify-center"
          }
        >
          <div className="">
            <div className={classes.title + " text-5xl"}>
              Nothing to see here
            </div>
            <div
              c="dimmed"
              size="lg"
              className={classes.description + " p-5 text-xl w-1/2"}
            >
              Page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you
              think this is an error contact support.
            </div>
          </div>
          <div className="flex flex-col" justify="center">
            <Link
              size="md "
              className=" p-2 bg-blue-300 hover:bg-blue-400 text-white shadow-lg rounded-lg"
              to="/landing"
            >
              Go back to home page
            </Link>
            <button
              className="p-2 bg-blue-300 hover:bg-blue-400 text-white shadow-lg rounded-lg mt-4"
              onClick={() => {
                navigate(-2);
              }}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
