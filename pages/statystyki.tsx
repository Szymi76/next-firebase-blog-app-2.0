import React, { useState, useEffect } from "react";
import SettingsWrapper from "../components/SettingsWrapper";
import LineChart from "../components/Chart";
import "chart.js/auto";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Blog } from "../ts/BlogTypes";
import { useAuthUser } from "../firebase/auth-hooks";

const labels = [1, 3, 6, 12, 24];
const data = {
  labels: labels,
  datasets: [
    {
      label: "Polubienia",
      data: [10, 15, 40, 5, 30, 35, 30],
      fill: false,
      borderColor: "#ef4444",
      tension: 0,
    },
    {
      label: "Wejścia",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "#3b82f6",
      tension: 0,
    },
  ],
};

const Stats = () => {
  const [last, setLast] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const user = useAuthUser();

  useEffect(() => {
    if (!user) return;
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("authorUID", "==", user.uid));
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => arr.push(doc.data()));
      setBlogs(arr);
    });
  }, []);

  useEffect(() => {
    const likes = blogs.map(blog => blog.likes.filter(l => typeof l != "string"));
    const arr = [];
    const filteredLikes = likes.filter(l => l.length != 0);
    filteredLikes.forEach(e => e.forEach(f => arr.push(f)));
    console.log(arr);
  }, [blogs]);

  return (
    <SettingsWrapper>
      <LineChart data={data} />
    </SettingsWrapper>
  );
};

export default Stats;

const createLabels = (blogs: Blog[]) => {};
