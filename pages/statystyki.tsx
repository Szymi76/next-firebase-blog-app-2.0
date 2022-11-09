import React, { useState, useEffect } from "react";
import SettingsWrapper from "../components/SettingsWrapper";
import LineChart from "../components/Chart";
import "chart.js/auto";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Blog } from "../ts/BlogTypes";
import { useAuthUser } from "../firebase/auth-hooks";

import TimeAgo from "javascript-time-ago";
import pl from "javascript-time-ago/locale/pl";

const NUMBER_OF_LABELS = 5;
const MILIS_RANGE = 1800 * 1000 * 12; // 30min * 12

const Stats = () => {
  const [last, setLast] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [data, setData] = useState(null);

  const user = useAuthUser();

  TimeAgo.addLocale(pl);
  const timeAgo = new TimeAgo("pl");

  useEffect(() => {
    if (!user) return;
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("authorUID", "==", user.uid));
    // const q = query(blogsRef);
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => {
        // await updateDoc(doc.ref, {
        //   likes: [
        //     { uid: "uid_1", timestamp: +new Date() - Math.floor(Math.random() * 86400) },
        //     { uid: "uid_2", timestamp: +new Date() - Math.floor(Math.random() * 86400) },
        //     { uid: "uid_3", timestamp: +new Date() - Math.floor(Math.random() * 86400) },
        //   ],
        // });
        arr.push(doc.data());
      });
      setBlogs(arr);
    });
  }, [user]);

  useEffect(() => {
    // tablica z { uid: "xyz", timestamp: 82648221}
    const likes = blogs
      .map(blog => blog.likes)
      .reduce((result, item) => {
        return result.concat(item);
      }, []);

    const views = blogs
      .map(blog => blog.views)
      .reduce((result, item) => {
        return result.concat(item);
      }, []);

    // sortByTime(likes, 9500000, 5);
    const labelsWithCount = createLabelsWithCount(NUMBER_OF_LABELS, MILIS_RANGE, likes);
    const viewsLabelsWithCount = createLabelsWithCount(
      NUMBER_OF_LABELS,
      MILIS_RANGE,
      views
    );
    console.table(labelsWithCount);

    const data = {
      labels: labelsWithCount.map(l => timeAgo.format(Date.now() - l.label)),
      datasets: [
        {
          label: "Polubienia",
          data: labelsWithCount.map(l => l.count),
          fill: false,
          borderColor: "#ef4444",
          tension: 0,
        },
        {
          label: "Wejścia",
          data: viewsLabelsWithCount.map(l => l.count),
          fill: false,
          borderColor: "#3b82f6",
          tension: 0,
        },
      ],
    };

    setData(data);
  }, [blogs]);

  return <SettingsWrapper>{data && <LineChart data={data} />}</SettingsWrapper>;
};

export default Stats;

// const createLabels = (blogs: Blog[]) => {};

function sortByTime(
  likes: { uid: string; timestamp: number }[],
  last: number,
  cols: number
) {
  const sortedLikes = likes
    .filter(l => +new Date() - l.timestamp < last)
    .sort((a, b) => a.timestamp - b.timestamp);

  const diff = last / cols;
  const likesSortedByDiff = [[]];

  sortedLikes.forEach((like, index) => {
    const lastInd = likesSortedByDiff.length - 1;
    const len = likesSortedByDiff.length;
    likesSortedByDiff[lastInd].push(like);
    if (+new Date() - like.timestamp > diff * len) likesSortedByDiff.push([]);
  });

  console.log(likesSortedByDiff);
  likesSortedByDiff.forEach((likeArr, i) => {
    console.log("|----|");
    likeArr.forEach(e => console.log((+new Date() - e.timestamp) / 1000 / 60));
  });
}

function createLabelsWithCount(
  numOfLabels: number,
  milisRange: number,
  data: { uid: string; timestamp: number }[]
) {
  const numbers = data
    .map(d => d.timestamp)
    .filter(n => +new Date() - n < milisRange)
    .sort();

  const labels = Array(numOfLabels)
    .fill(0)
    .map((e, i) => {
      return {
        label: Math.floor((milisRange / numOfLabels) * (i + 1)),
        count: 0,
      };
    });

  numbers.forEach(n => {
    const now = +new Date();
    const diff = now - n;
    for (var i = 0; i < labels.length; i++) {
      if (diff < labels[i].label) {
        labels[i].count++;
        break;
      }
    }
  });

  return labels;
}
