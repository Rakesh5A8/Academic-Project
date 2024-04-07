import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ViewTeams = () => {
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

  const handleProjectNameChange = (teamIndex, e) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].projectName = e.target.value;
    setTeams(updatedTeams);
  };

  const handleUpdate = async(teamIndex) => {
    // Implement the logic to update the project name in the backend
    console.log("Update team:", teams[teamIndex]);
    const res = await fetch(`${host}/manage/update-project-name`,{
      method:'PATCH',
      body:JSON.stringify({
        teamId:teams[teamIndex]._id,
        projectName:teams[teamIndex].projectName
      }),
      headers:{
        "auth-token": authToken,
        "Content-Type": "application/json",
      }
    })

    const data =await res.json();
    console.log(data);
    alert(data.message);

  };

  const handleDelete = async(teamIndex) => {
   
    console.log("Delete team:", teams[teamIndex]);
    const teamId = teams[teamIndex]._id;
    const res = await fetch(`${host}/manage/delete-team`,{
      method:'DELETE',
      body:JSON.stringify({
        teamId:teams[teamIndex]._id,
      }),
      headers:{
        "auth-token": authToken,
        "Content-Type": "application/json",
      }
    })

    const data =await res.json();
    console.log(data);
    if(data.success){
      let updatedTeams = [...teams];
      updatedTeams = updatedTeams.filter((item)=>item._id!==teamId);
      console.log("updated_teams" ,updatedTeams)
      setTeams(updatedTeams);
    }
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
    <div className='p-6'>
      {teams.map((team, teamIndex) => (
        <div key={team._id} className="mb-6 p-4 border-2 border-black rounded-md">
          <h2 className="text-xl font-semibold mb-4">Team {teamIndex + 1} - {team.projectName}</h2>
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">GPA</th>
                {/* Add other columns as needed */}
              </tr>
            </thead>
            <tbody>
              {team.teamMembers.map((member, memberIndex) => (
                <tr key={member._id}>
                  <td className="border p-2">{memberIndex + 1}</td>
                  <td className="border p-2">{member.name}</td>
                  <td className="border p-2">{member.cgpa}</td>
                  {/* Add other columns as needed */}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            {role==="Project Head"&&
              <>
              <label className="block mb-2 font-semibold">Project Name:</label>
              <input
                type="text"
                value={team.projectName || ''}
                onChange={(e) => handleProjectNameChange(teamIndex, e)}
                className="w-full border p-2"
                />
              
              </>
            }
          </div>
          {role==="Project Head" && 
            <div className="mt-4 flex items-center">
              <button
                onClick={() => handleUpdate(teamIndex)}
                className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md mr-4"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(teamIndex)}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md"
              >
                Delete Team
              </button>
            </div>
          } 
        </div>
      ))}
    </div>
  );
};

export default ViewTeams;
