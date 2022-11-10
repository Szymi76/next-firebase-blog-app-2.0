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
import { Oval } from "react-loader-spinner";

const NUMBER_OF_LABELS = 5;
const MILIS_RANGE = 1800 * 1000 * 12; // 30min * 12

const Stats = () => {
  const [range, setRange] = useState(3600 * 24 * 3 * 1000); // 30min * 24
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [data, setData] = useState(null);

  const user = useAuthUser();

  // formatowanie czasu -- np. 20 minut temu
  TimeAgo.addLocale(pl);
  const timeAgo = new TimeAgo("pl");

  // pobieranie wszystkich blogów aktualnego użytkownika
  useEffect(() => {
    if (!user) return;
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("authorUID", "==", user.uid));
    getDocs(q).then(snapshot => {
      const arr = [];
      snapshot.forEach(doc => {
        arr.push(doc.data());
      });
      setBlogs(arr);
    });
  }, [user]);

  // tworzenie etykiet wraz z licznikiem
  useEffect(() => {
    // tablica z timestampami polubieniami
    const likes = blogs
      .map(blog => blog.likes)
      .reduce((result, item) => {
        return result.concat(item);
      }, []);

    // tablica z timestampami wejść
    const views = blogs
      .map(blog => blog.views)
      .reduce((result, item) => {
        return result.concat(item);
      }, []);

    // etykiety wraz z licznikiem dla polubień i wejść
    const likesLabelsWithCount = createLabelsWithCount(NUMBER_OF_LABELS, range, likes);
    const viewsLabelsWithCount = createLabelsWithCount(NUMBER_OF_LABELS, range, views);

    // objekt dla wykresu
    const data = {
      labels: likesLabelsWithCount.map(l => timeAgo.format(Date.now() - l.label)),
      datasets: [
        {
          label: "Polubienia",
          data: likesLabelsWithCount.map(l => l.count),
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
  }, [blogs, range]);

  useEffect(() => console.log(range), [range]);

  return (
    <SettingsWrapper>
      {data ? (
        <>
          <LineChart data={data} />
          <div className="w-full flex justify-end px-10">
            <select
              onChange={e => setRange(+e.target.value)}
              className="border px-3 py-1 outline-violet-600 cursor-pointer rounded"
              defaultValue={3600 * 24 * 3 * 1000}
            >
              <option value={3600 * 1 * 1000}>1 godzina</option>
              <option value={3600 * 24 * 1000}>24 godziny</option>
              <option value={3600 * 24 * 3 * 1000}>72 godziny</option>
              <option value={3600 * 24 * 7 * 1000}>7 dni</option>
              <option value={3600 * 24 * 30 * 1000}>30 dni</option>
              <option value={3600 * 24 * 183 * 1000}>6 miesięcy</option>
              <option value={3600 * 24 * 365 * 1000}>1 rok</option>
            </select>
          </div>
        </>
      ) : (
        <div className="w-full h-[50vh] grid place-content-center">
          <Oval color="#7f56d9" secondaryColor="#7f56d9" strokeWidth={3} height={75} />
        </div>
      )}
    </SettingsWrapper>
  );
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
