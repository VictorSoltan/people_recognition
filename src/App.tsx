import React from 'react';
import axios from 'axios'
import './App.css';

function App() {

  let selectedFile = React.useRef <any> (null),
  [link, setLink] = React.useState<{mainFile?: String, mask?: String}>({}),
  [defaultVideo, setDefaultVideo] = React.useState<Boolean>(false),
  [loading, setLoading] = React.useState<Boolean>(false),
  backAddress = "http://localhost:8000"

  const handleFileSelect = (event: any) => {
    selectedFile.current = event.target.files[0]
  }

  const handleSubmit = async(event: any) => {
    event.preventDefault()
    let formData = new FormData();
    formData.append("data", selectedFile.current);
    try {
        const file = selectedFile.current;
        const form = new FormData() as any;
        form.append('file', file);
        setLoading(true)
        axios.post(`${backAddress}/uploadfile/`, form, {
            headers: {'Content-Type': 'multipart/form-data'}
        })        
        .then((res) => {
            setLoading(false)
            console.log('res', res.data)
            setDefaultVideo(false)
            setLink({mainFile: res.data.mainFile, mask: res.data.mask})
            // setFolders(res.data)
            // setFolderName(res.data[0])
        })
        .catch((res) => {
          setLoading(false)
        })

    } catch(err) {
      console.log(err)
    }
  }

  function styleButton(e: any){
    e.target.style.transform = 'scale(0.95)'; e.target.style.opacity = '0.8'
  }

  function returnStyleButton(e: any){
    e.target.style.transform = 'scale(1)'; e.target.style.opacity = '1'
  }

  return (
    <div className="App">     
      <h1>People tracking</h1>
        {!defaultVideo&&!loading && <button onClick={() => setDefaultVideo(!defaultVideo)}>See default video</button>}        
        {defaultVideo&&!loading ? 
          <div className='videos'>
              <video width="1200" controls>
                  <source src={`${backAddress}/video/cudwa_ouput.webm`} type="video/mp4" />
              </video>
              <video width="1200" controls>
                  <source src={`${backAddress}/video/cudwa_mask_ouput.webm`} type="video/mp4" />
              </video>     
          </div> 
          : link.mainFile&&link.mask&&!loading ?
            <div className='videos'>
              <video width="1200" controls>
                  <source src={`${backAddress}/video/${link.mainFile}`} type="video/mp4" />
              </video>
              <video width="1200" controls>
                  <source src={`${backAddress}/video/${link.mask}`} type="video/mp4" />
              </video>     
            </div>
          : loading ? 
            <div className='load'/>  
          : <h2>or... Choose a video for upload</h2>
        }   
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileSelect} accept="video/*"/>
        <input type="submit" value="Upload File" 
          onMouseDown={e => styleButton(e)} onMouseLeave={e => returnStyleButton(e)} 
          onMouseUp={e => returnStyleButton(e)} onMouseOut={e => returnStyleButton(e)} />
      </form>            
    </div>
  );
}

export default App;
