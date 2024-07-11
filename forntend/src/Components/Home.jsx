import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]); // State to store activities
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [editIndex, setEditIndex] = useState(null); // State to track the index of the activity being edited
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities(); // Fetch activities on component mount
  }, []);

  const fetchActivities = () => {
    axios
      .get("https://todo-fullstack-zcsg.onrender.com/activities")
      .then((response) => {
        setActivities(response.data.activities);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  };

  const onchange = (e) => {
    setActivity(e.target.value);
  };

  const addActivity = (e) => {
    e.preventDefault(); // Prevent form submission
    axios
      .post("https://todo-fullstack-zcsg.onrender.com/activity", { activity })
      .then((response) => {
        console.log("Activity added successfully:", response.data);
        fetchActivities(); // Refresh activities list after adding new activity
        setActivity(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error adding activity:", error);
      });
  };

  const deleteActivity = (index) => {
    axios
      .delete(`https://todo-fullstack-zcsg.onrender.com/activity/${index}`)
      .then((response) => {
        console.log("Activity deleted successfully:", response.data);
        fetchActivities();
      })
      .catch((error) => {
        console.error("Error deleting activity:", error);
      });
  };

  const editActivity = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setActivity(activities[index].activity);
  };

  const updateActivity = (e) => {
    e.preventDefault(); // Prevent form submission
    axios
      .put(`https://todo-fullstack-zcsg.onrender.com/activity/${editIndex}`, { activity })
      .then((response) => {
        console.log("Activity updated successfully:", response.data);
        fetchActivities(); // Refresh activities list after updating activity
        setActivity(""); // Clear the input field
        setIsEditing(false); // Exit editing mode
        setEditIndex(null);
      })
      .catch((error) => {
        console.error("Error updating activity:", error);
      });
  };

  const onLogout = () => {
    navigate("/"); // Navigate back to the root ("/")
  };

  return (
    <div className="pt-20 text-center bg-orange-400">
      <div>
        <h1 className="text-3xl font-semibold">Enter your today's activity</h1>
        <input
          type="text"
          className="p-2 mt-5"
          placeholder="Enter your activity"
          value={activity}
          onChange={onchange}
        />
        <input
          type="submit"
          className="p-2 mt-4 ml-3 text-white bg-black md:mt-0"
          value={isEditing ? "Update Activity" : "Add Activity"}
          onClick={isEditing ? updateActivity : addActivity}
        />
      </div>

      <div className="mx-2 mt-6 border border-black border-solid md:mx-52">
        <ul className="px-3 py-4 text-left">
          {activities.map((act, index) => (
            <div
              className="flex items-center justify-around gap-5 my-2"
              key={act.id}
            >
              <li className="w-1/2">
                {index + 1}. {act.activity}
              </li>
              <button
                className="w-1/4 p-2 text-white bg-black"
                onClick={() => editActivity(index)}
              >
                Edit
              </button>
              <button
                className="w-1/4 p-2 text-white bg-black"
                onClick={() => deleteActivity(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </ul>
      </div>

      <div>
        <input
          className="px-6 py-2 mt-3 mb-3 text-white bg-black"
          type="button"
          value="Logout"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

export default Home;
