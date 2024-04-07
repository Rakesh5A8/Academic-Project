import Cookies from 'js-cookie';
import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';

const StudentsData = ({ data , user}) => {

  const navigate = useNavigate();
  const authToken = Cookies.get('authToken')
  const [studentsData, setStudentsData] = useState(data);

  const [isTeams,setIsTeams] = useState(false)
  const [teams,setTeams]=useState([]);

  const [loading,setLoading] = useState(false);

    const finalizeTeams = async ()=>{
      setLoading(true);
        console.log("teams before sending:",teams)
        const res = await fetch("http://localhost:3001/manage/create-teams",{
          method:'POST',
          body:JSON.stringify({
            teams: teams,
            user: {
              id: user._id
            }
          }),
          headers:{
            "auth-token":authToken,
            "Content-Type": "application/json",
          }
        });
        const data = await res.json();
        setLoading(false);
        console.log(data);
        if(data.success){
          alert("You can now View the teams in the View Teams Tab");
          navigate("/view-teams")
        }

    }

  const getBackgroundColor = (teamIndex) => {
    const colors = ['#f0f8ff', '#fafad2', '#ffe4e1']; // Add more colors as needed
    return colors[teamIndex % colors.length];
  };

  const handleEdit = (rowIndex, key, value) => {
    // Update the state with the edited value
    const updatedData = [...studentsData];
    updatedData[rowIndex][key] = value;
    setStudentsData(updatedData);
  };

  const allocateTeams = ()=>{
   
    // Sort students in descending order of GPA
    const sortedStudents = data
        .filter((student) => !student['Internship Done'])
        .sort((a, b) => b.GPA - a.GPA);

    const teamCount = Math.round((sortedStudents.length)/4); // Set the desired number of teams
    console.log(teamCount)

    // Initialize teams array with   empty arrays
    const teams = new Array(teamCount)
        for(let i =0;i<teamCount;i++){
        teams[i] = new Array();
    }
   
      
    // Assign students to teams following the W pattern
    let teamIndex = 0;
    let direction=1;
    for (let i = 0; i < sortedStudents.length; i++) {
        console.log("team = ",teamIndex);
        console.log("member = ",sortedStudents[i])
        teams[teamIndex].push(sortedStudents[i]);

        if(direction===1){
            teamIndex++;
        }
        else{
            teamIndex--;
        }

        if(teamIndex===0 && direction===-1){
            teams[teamIndex].push(sortedStudents[i+1])
            i++;
            direction=1;
        }
        if(teamIndex===(teamCount) && direction===1){
            direction=-1;
            teamIndex--;
        }
        
    }

    console.log(teams);
    setTeams(teams);
    setIsTeams(true);
   
  }
  return (
    <div className="mt-6">
        {!isTeams? 
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="border p-2">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2">{rowIndex + 1}</td>
              {Object.keys(student).map((key) => (
                <td key={key} className="border p-2">
                  <input
                    type="text"
                    value={studentsData[rowIndex][key]}
                    onChange={(e) => handleEdit(rowIndex, key, e.target.value)}
                    className="w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>:

        <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
            <tr>
                <th className="border p-2">#</th>
                {Object.keys(data[0]).map((key) => (
                <th key={key} className="border p-2">
                    {key}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {teams.map((team, teamIndex) => (
                <React.Fragment key={teamIndex}>
                <tr>
                    <td colSpan={Object.keys(data[0]).length + 1} className="bg-gray-300">
                    Group {String.fromCharCode(65 + teamIndex)}
                    </td>
                </tr>
                {team.map((student, rowIndex) => (
                    <tr key={rowIndex} style={{ backgroundColor: getBackgroundColor(teamIndex) }}>
                    <td className="border p-2">{rowIndex + 1}</td>
                    {Object.keys(student).map((key) => (
                        <td key={key} className="border p-2">
                        {student[key]}
                        </td>
                    ))}
                    </tr>
                ))}
                </React.Fragment>
            ))}
            </tbody>
        </table>
    }
    {
        !isTeams?
      <button
        onClick={allocateTeams}
        className='bg-blue-500 text-white font-semibold w-full py-2 rounded-md mt-2'
      >
        Process and allocate Groups
      </button>:
      <>
      {loading && <p className='text-md text-zinc-600'>Pusing data to DataBase...</p> }
        <button
          onClick={finalizeTeams}
          className='bg-blue-500 text-white font-semibold w-full py-2 rounded-md mt-2'
        >
          Finalize Groups
        </button>
      </>
    }
    </div>
  );
};

export default StudentsData;
