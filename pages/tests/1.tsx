import React, { useContext, useEffect } from "react";
import { ActionTypes, BlogContext } from "../../ts/blogReducer";
import Card from "../../components/BlogCard";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const abc = {
  authorUID: "1",
  displayName: "Adam",
  photoURL:
    "https://res.cloudinary.com/practicaldev/image/fetch/s--5kWkErFS--/c_imagga_scale,f_auto,fl_progressive,h_100,q_auto,w_100/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/366059/d2322733-1ef8-4f2b-b8e4-facef5397761.jpg",
  value: "Jakiś bardzo ciekawy komentarz",
  upvotes: ["uid_1", "uid_2", "uid_3", "uid_4", "uid_5"],
  downvotes: ["uid_1", "uid_2"],
  timestamp: 1666726388960,
};

const TestPage = () => {
  const { blog, dispatch } = useContext(BlogContext);

  // useEffect(() => {
  //   const docRef = collection(db, "blogs");
  //   getDocs(docRef).then(docs => {
  //     docs.forEach(async doc => {
  //       await updateDoc(doc.ref, {
  //         comments: [abc, abc, abc],
  //       });
  //     });
  //   });
  // }, []);

  return (
    <div className="p-10">
      <Card blog={blog} size="small" />
    </div>
  );
};

export default TestPage;
