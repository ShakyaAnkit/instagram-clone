import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
import { motion } from "framer-motion";
import axios from './axios';

function Imageupload({username}) {
    const [image,setImage] = useState(null);
    const [url , setUrl] = useState("");
    const [progress ,setProgress] = useState(0);
    const [caption,setCaption] = useState('');

    const [lastYPos, setLastYPos] = React.useState(0);
  const [shouldShowActions, setShouldShowActions] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      const yPos = window.scrollY;
      const isScrollingUp = yPos < lastYPos;

      setShouldShowActions(isScrollingUp);
      setLastYPos(yPos);
    }

    window.addEventListener("scroll", handleScroll, false);

    return () => {
      window.removeEventListener("scroll", handleScroll, false);
    };
  }, [lastYPos]);

    const handleChange = (e) =>{
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error)
                alert(error.message);
            },
            ()=>{
                //complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        setUrl(url);

                        axios.post('/upload',{
                            caption : caption,
                            user : username,
                            image : url,
                        });
                        //post image inside db
                        db.collection("posts").add({
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl : url,
                            username : username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }
    return (
        <motion.div className="outerdiv" 
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShowActions ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
        >
            <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            
            <input type="text" placeholder="Enter a caption..." onChange={event=> setCaption(event.target.value)} value={caption} />
            <input className="file" type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
          
        </div>
        </motion.div>
    )
}

export default Imageupload
