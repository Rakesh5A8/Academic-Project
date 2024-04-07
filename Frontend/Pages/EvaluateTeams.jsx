import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const EvaluateTeams = () => {
  const host = "http://localhost:3001";
  const authToken = Cookies.get('authToken');
  const user = JSON.parse(localStorage.getItem('user'));
  const role=user.role;
 


  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    const res = await fetch(`${host}/manage/get-teams`, {
      headers: {
        "auth-token": authToken,
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    console.log(data);
    setTeams(data.teams);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleReviewChange = (teamIndex, reviewIndex, e) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].reviews[reviewIndex].marks = e.target.value;
    setTeams(updatedTeams);
  };

  const handleUpdateReviews = async (teamIndex) => {
    // Implement the logic to update reviews in the backend
    console.log("Update reviews for team:", teams[teamIndex]);
    const res = await fetch(`${host}/manage/update-reviews`, {
      method: 'PATCH',
      body: JSON.stringify({
        teamId: teams[teamIndex]._id,
        reviews: teams[teamIndex].reviews,
      }),
      headers: {
        "auth-token": authToken,
        "Content-Type": "application/json",
      }
    });

    const data = await res.json();
    console.log(data);
    alert(data.message);
  };

  const handleAlertInputChange = (teamIndex,e) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].message = e.target.value;
    setTeams(updatedTeams);
  };

  const handleAlert = async (teamIndex) => {
    // Logic to handle the alert
    const alertMessage=teams[teamIndex].message;
    if (alertMessage.trim() === '') {
      alert('Please enter a message before saving the alert.');
      return;
    }

    const res = await fetch(`${host}/manage/save-alert`, {
      method: 'PATCH',
      body: JSON.stringify({
        teamId: teams[teamIndex]._id,
        message: alertMessage,
      }),
      headers: {
        "auth-token": authToken,
        "Content-Type": "application/json",
      }
    });

    const data = await res.json();
    console.log(data);
    alert(data.message);

  };
  const removeAlert = async (teamIndex) => {
    // Logic to handle the alert
    const alertMessage=teams[teamIndex].message;
    if (alertMessage.trim() === '' || teams[teamIndex].alert===false) {
      alert('No alert to remove');
      return;
    }

    const res = await fetch(`${host}/manage/remove-alert`, {
      method: 'PATCH',
      body: JSON.stringify({
        teamId: teams[teamIndex]._id,
      }),
      headers: {
        "auth-token": authToken,
        "Content-Type": "application/json",
      }
    });

    const data = await res.json();
    console.log(data);
    alert(data.message);

  };
  if(!teams || teams.length===0){
    return (
      <div className='p-6'>
        <h1 className='text-zinc-500 text-2xl font-semibold'>No teams available</h1>
      </div>
    )
  }
  return (
    <div className='px-6'>

      <p className='text-xl my-4'>Press <span className='text-sm text-white p-2 bg-zinc-400 rounded-md'>Ctrl+F</span> to search</p>
      {teams.map((team, teamIndex) => (
        <div key={team._id} className={`mb-6 p-4 border border-black rounded-md ${team.alert?'bg-rose-500':''}`}>
          <h2 className="text-xl font-semibold mb-4">Team {teamIndex + 1} - {team.projectName}</h2>
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                
              </tr>
            </thead>
            <tbody>
              {team.teamMembers.map((member, memberIndex) => (
                <tr key={member._id}>
                  <td className="border p-2">{memberIndex + 1}</td>
                  <td className="border p-2">{member.name}</td>
                  
                  
                </tr>
              ))}
            </tbody>
          </table>
          <div className='grid grid-cols-5 gap-x-4 p-4'>
            <span className='flex items-center text-lg font-semibold'>Review Marks</span>
            {team.reviews.map((review, reviewIndex) => (
              <span key={reviewIndex} className={`${role==="Project Evaluator"? 'border-2 border-zinc-600':'bg-zinc-200'} p-2`}>
                {((role==="Project Evaluator" || role==="Project Guide" ) || (role==="Project Head" && team.alert))?
                <input
                  type="text"
                  value={review.marks || ''}
                  onChange={(e) => handleReviewChange(teamIndex, reviewIndex, e)}
                  placeholder={`Review ${reviewIndex + 1}`}
                  className="w-full outline-none"
                />:
                <span className="w-full outline-none">
                  {review.marks}
                </span>
                }
              </span>
            ))}
            {role==="Project Evaluator" && <button onClick={(e)=>handleUpdateReviews(teamIndex)} className='bg-green-400 rounded-md p-2 px-4 text-white'>Save Marks</button> }
          </div>
          <div className='flex items-center'>
            {role==="Project Guide"?
            <input
              type="text"
              value={team.message}
              onChange={(e)=>handleAlertInputChange(teamIndex,e)}
              placeholder="Enter alert message"
              className="border p-2 mr-2"
            />:
            <span className={`${team.messsage?'p-3':''} mr-2 bg-red-600 text-white`}>{team.message}</span>
            }
            {role==="Project Guide" && 
            <div className='flex gap-4'>
              <button onClick={() => handleAlert(teamIndex)} className='bg-red-400 rounded-md p-2 px-4 text-white'>Save Alert!</button>
              <button onClick={() => removeAlert(teamIndex)} className='bg-green-300 rounded-md p-2 px-4 text-white'>Remove Alert</button>

            </div>

            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluateTeams;
