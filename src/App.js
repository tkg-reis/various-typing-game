import './App.css';
import axios from 'axios';
import useSound from 'use-sound';
import { useState ,useEffect} from 'react';
import TypeWriterSound from "./audio/typewriter.mp3";
import CorrectSound from "./audio/audio_correct.mp3";
import WrongSound from "./audio/audio_wrong.mp3";


function App() {
  const [info, setInfo] = useState();
  // 入力完了時の状態管理
  const [emptyState, setEmptyState] = useState();
  let currentSentence = "";
  const [error, setError] = useState("");
  const [play] = useSound(TypeWriterSound , {onend: () =>{
    console.log("sounds good");
  }});

  const changeHandler = () => {
    typeSound.play();
        // console.log(typeSound);
        typeSound.currentTime = 0;
        const sentenceArray = typeDisplay.querySelectorAll('span');
        // console.log(sentenceArray);
        const arrayValue = typeInput.value.split("");
        // フラグを立てる
        let correct = true;
        // console.log(arrayValue);
        sentenceArray.forEach((charsSpan,index) => {
            if((arrayValue[index] == null)) {
                charsSpan.classList.remove('corrected');
                charsSpan.classList.remove('incorrected');
                correct = false;
            } else if(charsSpan.innerHTML == arrayValue[index]) {
                charsSpan.classList.add('corrected');
                charsSpan.classList.remove('incorrected');
            } else {
                charsSpan.classList.add('incorrected');
                charsSpan.classList.remove('corrected');
                wrongSound.play();
                wrongSound.currentTime = 0;
                correct = false;
            }
        });
        if(correct == true) {
            correctSound.play();
            correctSound.currentTime = 0;
            renderNextSentence();
        }
  }

  useEffect(() => {
    const getData = async() => {
      try {
        const url = "https://api.quotable.io/random";
        const res = await axios.get(url);
        setInfo(res.data.content.split(""));
        console.log((res.data.content.split("")));
        console.log(res);
      } catch (error) {
        setError(false);
      }
    }
    getData();
    // 
  },[]);

  let startTime = 0;
  let originTime = 60;
  function startTimer() {
    timer.innerHTML = originTime;
    startTime = new Date();
    setInterval(() => {
        timer.innerHTML = originTime - getTimerTime();
        if(timer.innerHTML <= 0) TimeUp();
    },1000);
  }
  function getTimerTime () {
      return Math.floor((new Date() - startTime ) / 1000);
  }
  function TimeUp() {
      renderNextSentence();
  }
  renderNextSentence();

  return (
    <div className='App'>
      <button onClick={() => play()}>test</button>
      <h2 className='timer'>0</h2>
        <div className='typeDiplay'>
        {info.forEach((el) => {
            currentSentence += `<span>${el}</span>`
        }, "")};
        </div>
      <textarea className='textInput' onChange={() => changeHandler} autoFocus></textarea>
      <p>{!error ? error : ""}</p>
    </div>
  );
}

export default App;
