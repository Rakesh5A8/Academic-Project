import React, { useEffect, useRef, useState } from 'react';
import uploadCloud from "../assets/feather_upload-cloud.svg"
import fileCheck from "../assets/file-earmark-check-fill.svg"
import * as XLSX from 'xlsx';
import StudentsData from '../components/StudentsData';
import { Link, useNavigate } from 'react-router-dom'

const Allocate = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem('user')){
      navigate('/login');
    }
  },[])
  const user = JSON.parse(localStorage.getItem('user'));
  const role=user.role;

  if(!user || !user._id || role!=="Project Head"){
    return (
      <div className='h-full w-full py-20 flex items-center justify-center'>
        <h1 className='text-red-600 font-bold text-3xl'>
          Unauthorized to use this Route!!

        </h1>
      </div>
    )
  }

  const uploadDiv = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [fileUploaded,setFileUploaded] = useState(false);

  const [showData,setShowData] = useState(false);
  const [data,setData] = useState();

  const handleDragOver = (e) => {
    e.preventDefault();
    uploadDiv.current.classList.add('border-blue-500');
  };

  const handleDragLeave = () => {
    uploadDiv.current.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
    uploadDiv.current.classList.remove('border-blue-500');
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Handle the logic for file processing
    console.log('Files:', files);

    // Set the name of the first file in the uploadedFileName state
    if (files.length > 0) {
      setUploadedFileName(files[0].name);
      setFileUploaded(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Get the first (and only) file from the file input
    const file = fileInputRef.current.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
  
        // Assuming only one sheet in the Excel file
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
  
        // Handle the extracted data as needed (e.g., send it to the server, display it)
        console.log('Extracted Data:', jsonData);
        setData(jsonData);
        setShowData(true);
      };
      
      reader.readAsArrayBuffer(file);
    }
  };


  const handleBrowseClick = () => {
    setFileUploaded(false);
    fileInputRef.current.click();
  };

  return (
    <div className='w-full flex flex-col gap-y-8 items-center justify-center'>

      {!showData ? 
      <>
      <h1 className='mt-20 text-3xl font-semibold'>Upload File containing Student info</h1>
      <div className='p-4 border-2 rounded-md border-blue-500'>
        <form onSubmit={handleFormSubmit}>
          <div
            ref={uploadDiv}
            className='flex flex-col items-center gap-y-4 p-8 border-2 border-dashed border-zinc-400 rounded-md cursor-pointer'
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <img src={uploadCloud} className='h-20 w-20' alt="" />
            <p>Click to Browse Files or Drag & Drop Here.</p>
            
          </div>
          {fileUploaded && <div className='flex items-center gap-3 mt-4 bg-emerald-400 text-white rounded-md p-2'>
              <img src={fileCheck} alt="" />
              {uploadedFileName}
          </div>}
          <input
            ref={fileInputRef}
            type="file"
            className='hidden'
            onChange={handleFileInputChange}
          />
          <button
            type="submit"
            className='bg-blue-500 text-white font-semibold w-full py-2 rounded-md mt-8'
          >
            Extract Data
          </button>
        </form>
      </div>
      </>
      :
      <StudentsData data = {data} user={user}/>

      }
    </div>
  );
};

export default Allocate;
