import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Imageupload from './Imageupload';
import InstagramEmbed from 'react-instagram-embed';
import axios from './axios';

function getModalStyle() {
  const top = 50; 
  const left = 50;
  
  return{
    top : `${top}%`,
    left : `${left}%`,
    transform : `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  paper : {
    position : 'absolute',
    width : '80%',
    backgroundColor : theme.palette.background.paper,
    border : '2px solid #000',
    boxShadow : theme.shadows[5],
    padding : theme.spacing(2, 4, 3)
  }
}))

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false); 
  const [openSignIn , setOpenSignIn] = useState(false);
  const [username,setUsername] = useState(''); 
  const [password,setPassword] = useState(''); 
  const [email,setEmail] = useState(''); 
  const [user, setUser] = useState(null);

  useEffect(() => {
   const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);

       
      } else{
        // user has logged out...
        setUser(null);
      }
    })

    return ()=>{
      //perfrom some cleanup actions
      unsubscribe();
    }
  }, [user,username])

  useEffect(() => {
    // db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
    //   setPosts(snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     post : doc.data()
    //   }
    //     )));
        
    // })

    const fetchPosts = async () => 
    await  axios.get('/sync').then(response => {
      console.log(response);
      setPosts(response.data)
    })

    fetchPosts()
  },[])

  console.log('posts are >>>', posts)

  const signUp = (event)=>{
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message));
  }

  const signIn= (event)=>{
    event.preventDefault();
    auth  
      .signInWithEmailAndPassword(email, password)
      .catch((error)=>alert(error.message))

      setOpenSignIn(false);
  }
  return (
    <div className="app">

      {/* caption */}
     
      

      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              alt=""
            />
            </center>
          <Input 
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <center>
          <Button onClick={signUp}>Sign Up</Button>
          </center>
        </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              alt=""
            />
            </center>
        

          <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <center>
          <Button onClick={signIn}>Sign In</Button>
          </center>
        </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
        {user ? (
        <Button onClick={()=> auth.signOut()}>LogOut</Button>
      ): 
        (
          <div className="app__loginContainer">

            <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
             <Button onClick={()=> setOpen(true)}>Sign Up</Button>
          </div>
         
        )
      }
         </div>   
      <div className="app__posts">
      <div className="app__postsLeft">
      {
        posts.map((post)=>(
          <Post key = {post._id} postId={post._id} user={user} username={post.user} caption={post.caption} imageUrl={post.image } />
        ))
      }
      </div>   
      <div className="app__postsRight">
      <InstagramEmbed
        url='https://www.instagram.com/p/CFti_c3oTQx/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      </div>



      </div>

      
        {user?.displayName ? (
                <Imageupload username={user.displayName} />
              ):(
                <h3>Sorry you need to login to upload</h3>
              )}
         
    </div>
  );
}

export default App;
