import React,{useState,useEffect} from 'react';
import './App.css';
import Post  from './Post';

import {auth, db} from './firebase';
import {Button, Input, Modal}  from '@material-ui/core';
import { mergeClasses,makeStyles } from '@material-ui/core/styles';

import { Buttons  } from '@material-ui/core';
import Stories from './Stories';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle(){
  const top=50;
  const left=50;
  return{
    top:`${top}%`,
    left:`${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles=makeStyles((theme)=>({
  paper:{
    position: 'absolute',
    width:400,
    backgroundColor:theme.palette.background.paper,
    border:'2px solid #000',
    padding:theme.spacing(2,4,3)
 },
}));
function App() {
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle)
  const [posts,setposts]=useState([]);
  const [open, setOpen] = useState(false)
  const[openIn,setopenIn]=useState(false);
  const [username,setusername]=useState('');
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');
  const [user,setuser]=useState(null)
 //What useEffect does is  it runs a piece of code on specfic condition
 //user authtentication
 useEffect(() => {
 const unsubscribe=  auth.onAuthStateChanged((authUser)=>{//this line keeps u logged in and changes the state of user which is null

     if(authUser){
       //when user logged in
       console.log(authUser);
       setuser(authUser);}
     else{
       //user has logged out
       setuser(null)
     }
   })//Every single tme new user signup it will fire this
 
 }, [])

 //database
 useEffect(() => {
   //code runs here
   db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot=>{ //whenever something new is added inside post or newpost it gonna fire it real time to database
    setposts(snapshot.docs.map(doc=>({id:doc.id,
      post:doc.data()})
      ));//it gonna map through no of documents inside datbase then .data will provide us data inisdede it which s foreg username,caption etc
})
 }, [//conditions comes here if it is empty than it will run everytime the new action happen and then stop foreg comments
 ])
 const signUp=(event)=>{

  event.preventDefault();
  auth.createUserWithEmailAndPassword(email,password).then((authUser)=>{//ceate new usser
   return authUser.user.updateProfile({//it will save autghuser inside 'user' state that we set
      displayName:username
    })
  })
  .catch((error)=>alert(error.message));

  setOpen(false)//to close the modal once it is signup
 }

 const signIn=(event)=>{
   event.preventDefault();
   auth.signInWithEmailAndPassword(email,password)//it will sign in with already registed email and password
   .catch((error)=>alert(error.message));

   setopenIn(false)//to close the modal once it is signin

 }
  return (
    <div className="app">


      {/*when user logged in so it doent pick out username immediately so if its no there dont freakout amnd run the app so we use (user?)*/}

      {/*HEADER SECTION*/}
      <Modal open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <div className='app_head'>
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" class="app_headerImage" alt="" />
              </div>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)} />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)} />
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)} />

            <Button type='submit' variant='outlined' onClick={signUp} color='secondary' style={{
              color: 'red'
            }}>SignUp</Button></form>

        </div>
      </Modal>
      

      {/*modal no 2 for sign in*/}

      <Modal open={openIn} onClose={() => setopenIn(false)} onOpen={() => setopenIn(true)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <div className='app_head'>
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" class="app_headerImage" alt="" />
              </div>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)} />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)} />

            <Button type='submit' variant='outlined' onClick={signIn} color='secondary' style={{
              color: 'red'
            }}>SignIn</Button></form>

        </div>
      </Modal>


      <div className='app_header'>
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app_headerImage" alt="" />
        {user ? <Button variant='outlined' onClick={() => auth.signOut()} color='secondary' style={{
          color: 'red'
        }}>Log Out</Button> : (<div className='app_logincontainer'>

          <Button variant='outlined' onClick={() => setopenIn(true)} color='secondary' style={{
            color: 'red'
          }}>SignIn</Button>
          <Button variant='outlined' onClick={() => setOpen(true)} color='secondary' style={{
            color: 'red'
          }}>SignUp</Button> </div>)}

      </div>

      <Stories />
      {/*post*/}
      <div className='app_post'>
        <div classname='app_postleft'>
        { posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))}
              {/*ImageUpload*/}
         {user?.displayName ? (<ImageUpload username={user.displayName} />) : (<h3 className='login_head'> You need to login to upload</h3>)}
        </div>
       <div className='app_postright'>
     {/*  <InstagramEmbed
  url='https://www.instagram.com/p/CUpkuYlDc4S/?utm_source=ig_web_copy_link'
 
  maxWidth={300}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
     />*/}
       </div>
    
     </div>
      </div>
   
    
  
  );
}

export default App;
//useEffect(() => {
 //effect
  
//}, [input]) this means run the code above we write according to condition inside this line (input) whenver the page refreshes


// db.collection('posts') adding post to database
//snapshot means its like whenver some data is added it gonna snapshot it in real time and send it to database in realtime or update it
//every time chnage hapen snapsho fire the code or update it 

// what key do is it refreshes the only one we added not the whole bunch of post added before only the one add and with the id we can configure which post is refreshed

//catch((error)=>alert(error.message)) -------------whenever there is error in thrprocess of email password it will give error message
//error message is created by firebase for backend validation
//{orderBy("timestamp","desc")} it will upload according the greater timestamp desc means descending asc means ascending
//unsubscribe ---- when user logged in it pass the username and frontend listener useEfeect and then backend listener sp t will repeat to so we unsubscribe it