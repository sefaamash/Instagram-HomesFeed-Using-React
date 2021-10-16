import React,{useState,useEffect} from 'react';
import { Button } from '@material-ui/core';
import {db,storage} from './firebase';
import firebase from "firebase";
import './ImageUpload.css';


function ImageUpload({username}) {
    const [caption,setcaption]=useState('');
    const [image,setimage]=useState(null);
    const [progress,setprogress]=useState(0);

    const handleChange=(e)=>{
        if(e.target.files[0]){//if by mistake we pick 2 files so it will then take 1st file that we pick
            setimage(e.target.files[0]);
        }
    }
    const handleUpload=(e)=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image); //means go to the storage than go ref images taht we made/filename that we pick put it there that image
            uploadTask.on(//as we upload task uploadtask.on and state changes give me a  snapshot of progress as it is uploading
                'state_changed',
                (snapshot)=>{
                    //progress function
                    const progress=Math.round(
                        (snapshot.bytesTransferred/snapshot.totalBytes)*100);// what it will do as we r uploading it gona show us proress how much bytes is been transfered out of total bytes 
                        setprogress(progress);
},
    (error)=>{
        //error function .....\
        console.log(error);
        alert(error.message)

    },
    ()=>{
        //COMPLETE FUNCTION...
        storage
        .ref("images").child(image.name).getDownloadURL().then(url=>{//no we r grtting the download link of the image we upload 
            //storage.ref("images ") go to storage reference images .child(image.name) go to it name .getDownloadURL() then get its download link then add taht image to database collection {posts taht we make}
            //post image inside database
            db.collection('posts').add({
                              timestamp: firebase.firestore.FieldValue.serverTimestamp(),//it will five us server timestamp so that the latest image which is uploaded comes at the top
                               caption: caption,
                               imageUrl:url,//e upload it will give download link then we push taht download link o image url
                               username:username
                            });
                            //AFTER ITS DONE.... we gonna reset back to its state
                             setcaption('');
                             setprogress(0);
                             setimage(null);
        })
    }
    
           
    )}
    
    return (
        <div className="image_upload">
              {/*I want to have....*/ }
              <progress value={progress} max="100"/>
      {/*Caption Input*/ }
      <input type='text' placeholder='Enter a Caption' onChange={event=>setcaption(event.target.value)} value={caption}/>
      {/*File Picker....*/ }
      <input type='file' onChange={handleChange}/>
      {/*Post Button....*/ }
      <Button className='image_uploadbtn' type='submit'variant='outlined' onClick={handleUpload} color='secondary' style={{
      color:'red'
    }}>Upload</Button>
    
      
        </div>
    )
}

export default ImageUpload
