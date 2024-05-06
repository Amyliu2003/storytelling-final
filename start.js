


import { userState } from "./main";
import { updateUserState } from "./main";

let canHover=true;
let first=true;
let now =-1;
window.timeToJump=false;


export async function tellAccount() {
      const { username, password, access } = userState;
  
      if (username && password && access) {
      //     console.log("tellAccount called", { username, password, access });
          return { username, password, access };
      }
  
      return null; 
  }


  

async function updateNow() {
      now ++;
}

export async function tellAnswer() {
    if (now === -1) {
        await updateNow();  
    }
    return now;
}

let three =document.getElementById("three");





window.onload=()=>{

    let bttn= document.getElementById("submitbttn");
    let login=document.getElementById("login");
    let audio1=document.getElementById("audio1");
    let message= document.getElementById("message");
    let book=document.getElementById("book1");
    book.style.display='none'



   

 if(first){

     

      setInterval(()=>{



            if(three){
                  audio1.onended = function() {
                     window.timeToJump =true;
                     three.style.display='block';
                     document.body.style.overflow='hidden';
                     login.style.display='flex'
                     book.style.display='none'
                     message.style.display='none'
                  };

                  if(!window.timeToJump){
                        first=false;
                        
                        document.getElementById('three').style.display='none'
                        document.getElementById('interaction').style.display='none'
                  }else{
                        
                        
                        document.getElementById('three').style.display='block'
                        document.getElementById('interaction').style.display='block'
                  }
            }




          },1000)
      
    
    bttn.addEventListener(('click'),()=>{
       const username=document.getElementById('username').value;
       const password=document.getElementById('password').value;
       let access;

        if(username.toLocaleLowerCase()=="lewis carroll"){
            access='author'
        }else if(username.toLocaleLowerCase()=="kitty"){
            access='cat'
            
        }else if(username.toLocaleLowerCase()=="alice"){
            access='alice'
        }else{
            access='who'
        }

        updateUserState(username,password,access)

       window.username=username;
       window.password=password;
       window.access=access;
       
      
        login.style.display='none'
        document.body.style.overflowY='visible';
        message.style.display='block';
        message.innerHTML="Welcome <strong>"+username+"</strong>. Please listen to the audio and answer following story.<br> Oh, yes, before you answer them, you must first <strong>find the question</strong>. →←"
        book.style.display='flex'
        audio1.play();
    })




    let para=document.getElementById("para");
    let block=document.getElementsByClassName('opacity');
    let story=document.getElementsByClassName('opacity1');
    story[0].style.display='flex';
//     console.log(para1)

let q= document.getElementsByClassName('question');

const questions = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7'];
const answers = [['kitty'], ['alice'], ['red queen','chess','pretend'], ['looking-through','house','glass'], ['i'], ['lewis carroll'], ['who is dreaming of who?'],['kitty',username,'lewis carroll']];
// Initialize an array to track the display state of each question

function toggleDisplay(element, show) {
      element.style.display = show ? 'flex' : 'none';
  }

  toggleDisplay(block[0], false);
  toggleDisplay(story[0], true);


function checkAnswer(index) {
      const userAnswer = q[index].value.toLowerCase(); // Get user answer and convert to lowercase
      let ifCorrect=false;

      console.log(now);

       if (answers[now].length>1){
            console.log('more than 1');
         for (let ans of answers[now]){
            if(userAnswer.includes(ans)){
                  ifCorrect=true;
                  console.log('correct');
                   break;
            }else{
                  console.log('you said: ('+q[index].value.toLowerCase()+') which is maybe correct');   
                  console.log(answers[now])
            }
            
         }
        
         return ifCorrect;

       }else{
            if(userAnswer.includes(answers[now])){
                  ifCorrect=true;
                  console.log('correct');
                 
            }else{
                  console.log('you said: ('+q[index].value.toLowerCase()+') which is incorrect');   
                  console.log(answers[now])
            }

            return ifCorrect;
            
       }
      
}



q.forEach((quest, index) => {

      quest.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if applicable
                console.log(now);
                const isCorrect = checkAnswer(0);
                if (isCorrect) {
                  console.log(now+` correct!`);
                    if(block[1]&&story[1]&&(now)!=7){
                        toggleDisplay(block[1], true); 
                        toggleDisplay(story[1], false); 
                        story[0].remove();
                        block[0].remove();
                       
                    }else{
                        toggleDisplay(story[0], true); 
                        block[0].remove();
                       
                    }
                    updateNow(now);
                    console.log(`${index+1} is not in display`);  // Notify user of incorrect answer
                    }
                  

                } else {
                    console.log('Incorrect answer. Please try again.'); // Notify user of incorrect answer
                }
            });
});

para.addEventListener('mouseenter', () => {
      // console.log('mouse enter');

      // console.log('show the question'+now);
      if(block[0]&&story[0]){
      toggleDisplay(block[0], true);
      toggleDisplay(story[0], false);

      }
      
});


para.addEventListener('mouseleave', () => {
      // console.log('mouse out');

      // console.log('show the hint'+now);

      if(block[0]&&story[0]){
      toggleDisplay(block[0], false);
      toggleDisplay(story[0], true);
      }

  });






}else{
      message.style.display='none'
      book.style.display='none'
      document.body.style.overflow='hidden';
      login.style.display='flex'

      bttn.addEventListener(('click'),()=>{
            first=false
            console.log('the second time')
      });



}



// },10000);

};



