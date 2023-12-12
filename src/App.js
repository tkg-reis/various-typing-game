import './App.css';
import axios from 'axios';
import useSound from 'use-sound';
import Select from 'react-select';
import { useState ,useEffect, useRef} from 'react';
import TypeWriterSound from "./audio/typewriter.mp3";
import CollectSound from "./audio/audio_correct.mp3";
import WrongSound from "./audio/audio_wrong.mp3";

const options = [
  {value : "electroHarmonics", label : "エレクトロハーモニクス"},
  {value : "Dynalight", label : "筆記体"},
  {value : "Flow Circular", label : "やばさ１"},
  {value: "Libre Barcode 39" , label : "やばさ２"}
];

function App() {
  const [info, setInfo] = useState("start typing");
  const [selectedState, setSelectedState] = useState(null);
  const [error, setError] = useState("");
  const [typePlaySound] = useSound(TypeWriterSound , {onend: () =>{
    console.log("sounds good");
  }});
  const [collectSound] = useSound(CollectSound, {
    onend : () => {
      console.log("collect!");
    }
  });
  const [wrongSound] = useSound(WrongSound, {
    onend : () => {
      console.log("wrong!");
    }
  });

// fontfamilyの選択
  const ref = useRef(null);
  const ChangeFamily = (val) => {
    ref.current.style.fontFamily = val.value;
  }
  const textareaRef = useRef(null);
   let currentTextarea = textareaRef.current;

  const changeHandler = () => {
    typePlaySound();
        // typeSound.currentTime = 0;
        const sentenceArray = document.querySelectorAll('.typeDiplay > span');
        const arrayValue = currentTextarea.value.split("");
        let correct = true;
        console.log(arrayValue);
        sentenceArray.forEach((charsSpan,index) => {
            if((arrayValue[index] == null)) {
                // charsSpan.classList.remove('corrected');
                // charsSpan.classList.remove('incorrected');
                correct = false;
            } else if(charsSpan.innerHTML == arrayValue[index]) {
                // charsSpan.classList.add('corrected');
                // charsSpan.classList.remove('incorrected');
            } else {
                // charsSpan.classList.add('incorrected');
                // charsSpan.classList.remove('corrected');
                wrongSound();
                // wrongSound.currentTime = 0;
                correct = false;
            }
        });
        if(correct == true) {
          collectSound();
            // correctSound.currentTime = 0;
            // renderNextSentence();
        }
  }
  useEffect(() => {
    const getData = async() => {
      try {
        const url = "https://api.quotable.io/random";
        const res = await axios.get(url);
        setInfo(res.data.content);
      } catch (error) {
        setError(false);
      }
    }
    getData();
  },[]);

  let spiltTxt = info.split("");
  let timer = 0;
  let startTime = 0;
  let originTime = 60;
  // function startTimer() {
  //   timer.innerHTML = originTime;
  //   startTime = new Date();
  //   setInterval(() => {
  //       timer.innerHTML = originTime - getTimerTime();
  //       if(timer.innerHTML <= 0) TimeUp();
  //   },1000);
  // }
  // function getTimerTime () {
  //     return Math.floor((new Date() - startTime ) / 1000);
  // }
  // function TimeUp() {
  //     renderNextSentence();
  // }
  // renderNextSentence();

 

  return (
    <div className='App'>
      <button onClick={() => ChangeFamily()}>test</button>
      <div>
        <Select
          options={options}
          defaultValue={ref}
          onChange={ChangeFamily}
            />
      </div>
      <h2 className='timer' >{timer !== startTime ? originTime : startTime }</h2>
        <div className='typeDiplay' ref={ref}>
          {spiltTxt.map((value, i) => {
            return <span key={i}>{value}</span>
          })}
        </div>
      <textarea className='textInput' ref={textareaRef} onChange={changeHandler} autoFocus></textarea>
      <p>{!error ? error : ""}</p>
    </div>
  );
}

export default App;
