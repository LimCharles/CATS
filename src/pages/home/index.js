import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "#components/Navbar";
import axios from "axios";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  if (session?.user?.role != "Admin") {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  let catsData = [];
  let validationRules = "";

  await axios
    .get(`${process.env.BASE_URL}/api/cats/get`, {
      withCredentials: true,
      headers: {
        Cookie: context.req.headers.cookie,
      },
    })
    .then((res) => {
      catsData = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  function formatDate(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  function convertDatesInObject(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];

        // Check if the value is a string and contains dashes, suggesting a date format
        if (
          typeof value === "string" &&
          value.includes("-") &&
          !isNaN(Date.parse(value))
        ) {
          obj[key] = formatDate(value);
        } else if (Array.isArray(value)) {
          obj[key] = value.map((item) => {
            if (
              typeof item === "string" &&
              item.includes("-") &&
              !isNaN(Date.parse(item))
            ) {
              return formatDate(item);
            } else if (typeof item === "object") {
              return convertDatesInObject(item);
            } else {
              return item;
            }
          });
        } else if (typeof value === "object") {
          convertDatesInObject(value);
        }
      }
    }
    return obj;
  }

  catsData = catsData.map((cat) => convertDatesInObject(cat));

  await axios
    .get(`${process.env.BASE_URL}/api/cats/getValidation`, {
      withCredentials: true,
      headers: {
        Cookie: context.req.headers.cookie,
      },
    })
    .then((res) => {
      validationRules = res.data;
    })
    .catch((e) => {
      console.log(e);
    });

  let areas;
  await axios
    .get(`${process.env.BASE_URL}/api/areas/get`)
    .then((res) => {
      areas = res.data;
      areas = areas.map((area) => {
        return { value: area._id, label: area.name };
      });
    })
    .catch((e) => {
      console.log(e);
    });

  console.log(catsData);
  console.log(areas);
  return { props: { catsData, validationRules, session, areas } };
}

const Home = ({ catsData, validationRules, session, areas }) => {
  const locationLabels = areas.reduce((acc, loc) => {
    acc[loc.value] = loc.label;
    return acc;
  }, {});

  const locationCounts = catsData.reduce((acc, cat) => {
    const locationID = cat.lastSighting.location;
    const locationLabel = locationLabels[locationID] || "Unknown Location";
    acc[locationLabel] = (acc[locationLabel] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(locationCounts),
    datasets: [
      {
        label: "Number of Cat Sightings by Location",
        data: Object.values(locationCounts),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const neuteredCounts = { Neutered: 0, "Not Neutered": 0 };

  catsData.forEach((cat) => {
    if (cat.isNeutered) {
      neuteredCounts["Neutered"] += 1;
    } else {
      neuteredCounts["Not Neutered"] += 1;
    }
  });

  const chartData2 = {
    labels: Object.keys(neuteredCounts),
    datasets: [
      {
        label: "Neutered Status",
        data: Object.values(neuteredCounts),
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions2 = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const breedCounts = {};

  catsData.forEach((cat) => {
    const breed = cat.breed || "Unknown Breed";
    breedCounts[breed] = (breedCounts[breed] || 0) + 1;
  });

  const chartDataBreed = {
    labels: Object.keys(breedCounts),
    datasets: [
      {
        label: "Number of Cats by Breed/Color",
        data: Object.values(breedCounts),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsBreed = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar session={session} />
      <div className="flex flex-col m-32">
        <div className="flex flex-row gap-4">
          <Pie
            data={chartData2}
            options={chartOptions2}
            width={400}
            height={400}
          />
          <Bar
            data={chartDataBreed}
            options={chartOptionsBreed}
            width={600}
            height={400}
          />
        </div>

        <Bar data={chartData} options={chartOptions} width={800} height={400} />
      </div>
    </div>
  );
};

export default Home;
