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
      .get("http://localhost:5000/activities")
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
      .post("http://localhost:5000/activity", { activity })
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
      .delete(`http://localhost:5000/activity/${index}`)
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
      .put(`http://localhost:5000/activity/${editIndex}`, { activity })
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
    <div className="bg-orange-400 text-center pt-20">
      <div>
        <h1 className="text-3xl font-semibold">Enter your today's activity</h1>
        <input
          type="text"
          className="mt-5 p-2"
          placeholder="Enter your activity"
          value={activity}
          onChange={onchange}
        />
        <input
          type="submit"
          className="bg-black p-2 ml-3 md:mt-0 mt-4 text-white"
          value={isEditing ? "Update Activity" : "Add Activity"}
          onClick={isEditing ? updateActivity : addActivity}
        />
      </div>

      <div className="border border-solid border-black mx-2 mt-6 md:mx-52">
        <ul className="text-left py-4 px-3">
          {activities.map((act, index) => (
            <div
              className="flex justify-around items-center gap-5 my-2"
              key={act.id}
            >
              <li className="w-1/2">
                {index + 1}. {act.activity}
              </li>
              <button
                className="bg-black p-2 w-1/4 text-white"
                onClick={() => editActivity(index)}
              >
                Edit
              </button>
              <button
                className="bg-black p-2 w-1/4 text-white"
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
          className="bg-black py-2 px-6 mb-3 text-white mt-3"
          type="button"
          value="Logout"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

export default Home;
