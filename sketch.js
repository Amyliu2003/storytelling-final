

import { mirrorTouch } from "./main";
import { userState } from "./main";
import { updateUserState } from "./main";

let canHover=true;
let first=true;
let now =0;


export async function tellAccount() {
      const { username, password, access } = userState;
  
      if (username && password && access) {
          console.log("tellAccount called", { username, password, access });
          return { username, password, access };
      }
  
      return null; 
  }

export async function tellAnswer() {
      return now;
}


window.onload=()=>{

    let bttn= document.getElementById("submitbttn");
    let login=document.getElementById("login");
    let audio1=document.getElementById("audio1");
    let message= document.getElementById("message");
    let book=document.getElementById("book1");
    book.style.display='none'



//     console.log(mirrorTouch());
   
setInterval(()=>{
 if(first){

      setInterval(()=>{
            if(mirrorTouch()){
                  first=false;
                  document.getElementById('three').style.display='none'
                  document.getElementById('interaction').style.display='none'
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

    let three =document.getElementById("three");


    let para=document.getElementById("para");
    let block=document.getElementsByClassName('opacity');
    let story=document.getElementsByClassName('opacity1');
    story[0].style.display='flex';
//     console.log(para1)

let q= document.getElementsByClassName('question');

const questions = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7'];
const answers = [['kitty'], ['alice'], ['red queen','chess','pretend'], ['looking-through','house','glass'], ['i'], ['lewis carroll'], ['who is dreaming of who?'],['Kitty',username,'lewis carroll']];
// Initialize an array to track the display state of each question

function toggleDisplay(element, show) {
      element.style.display = show ? 'flex' : 'none';
  }

  toggleDisplay(block[0], false);
  toggleDisplay(story[0], true);


function checkAnswer(index) {
      const userAnswer = q[index].value.toLowerCase(); // Get user answer and convert to lowercase
      let ifCorrect=false;

       if (answers[now].length>1){
            console.log('more than 1');
         for (let ans of answers[now]){
            if(userAnswer.includes(ans)){
                  ifCorrect=true;
                  console.log('correct');
                   break;
            }else{
                  console.log('you said: ('+q[index].value.toLowerCase()+') which is maybe correct');   
            }
            
         }
        
         return ifCorrect;

       }else{
            if(userAnswer.includes(answers[now])){
                  ifCorrect=true;
                  console.log('correct');
                 
            }else{
                  console.log('you said: ('+q[index].value.toLowerCase()+') which is incorrect');   
            }

            return ifCorrect;
            
       }
      
}



q.forEach((quest, index) => {

      quest.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if applicable
                const isCorrect = checkAnswer(0);
                if (isCorrect) {
                  console.log(now+` correct!`);
                  // tellAnswer();

                    if(block[1]&&story[1]&&(index+1)!=7){
                        toggleDisplay(block[1], true); 
                        toggleDisplay(story[1], false); 
                        story[0].remove();
                        block[0].remove();
                        now++;
    
                    }else{
                        
                    }



                    console.log(`${index+1} is not in display`);  // Notify user of incorrect answer
                    }

                } else {
                    console.log('Incorrect answer. Please try again.'); // Notify user of incorrect answer
                }
            });
});

para.addEventListener('mouseenter', () => {
      console.log('mouse enter');

      // console.log('show the question'+now);
      if(block[0]&&story[0]){
      toggleDisplay(block[0], true);
      toggleDisplay(story[0], false);

      }
      
});


para.addEventListener('mouseleave', () => {
      console.log('mouse out');

      // console.log('show the hint'+now);

      if(block[0]&&story[0]){
      toggleDisplay(block[0], false);
      toggleDisplay(story[0], true);
      }

  });






}else{
      message.style.display='none'
      book.style.display='none'

      bttn.addEventListener(('click'),()=>{
            first=false;
            console.log('the second time')
           
      });



}

if(three){
      audio1.onended = function() {
         three.style.display='block';
         document.body.style.overflow='hidden';
         login.style.display='flex'
      };
  }

},1000);

};



