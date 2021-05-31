import React from "react";

export default function IndexPage(props) {
  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (!token) {
      props.history.push("/login");
    } else {
      props.history.push("/dashboard");
    }
    //eslint-disable-next-line
  }, []);

  return <div>Index</div>;
}
